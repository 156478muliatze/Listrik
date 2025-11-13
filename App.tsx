import React, { useState, useMemo } from 'react';
import useLocalStorage from './hooks/useLocalStorage';
import { Room, Reading, Payment, Credit } from './types';
import RoomCard from './components/RoomCard';
import RoomFormModal from './components/RoomFormModal';
import ReadingFormModal from './components/ReadingFormModal';
import SettingsModal from './components/SettingsModal';
import ConfirmationModal from './components/ConfirmationModal';
import ReportModal from './components/ReportModal';
import PaymentFormModal from './components/PaymentFormModal';
import { PlusIcon, SettingsIcon, ReportIcon } from './components/icons';

const App: React.FC = () => {
  const [rooms, setRooms] = useLocalStorage<Room[]>('kost_rooms', []);
  const [readings, setReadings] = useLocalStorage<Reading[]>('kost_readings', []);
  const [payments, setPayments] = useLocalStorage<Payment[]>('kost_payments', []);
  const [credits, setCredits] = useLocalStorage<Credit[]>('kost_credits', []);
  const [ratePerKwh, setRatePerKwh] = useLocalStorage<number>('kost_rate', 1500);

  const [isRoomModalOpen, setIsRoomModalOpen] = useState(false);
  const [isReadingModalOpen, setIsReadingModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  const [roomToEdit, setRoomToEdit] = useState<Room | null>(null);
  const [roomForReading, setRoomForReading] = useState<Room | null>(null);
  const [roomToDelete, setRoomToDelete] = useState<Room | null>(null);
  const [readingForPayment, setReadingForPayment] = useState<Reading | null>(null);

  const latestReadings = useMemo(() => {
    const latestMap = new Map<string, Reading>();
    readings.forEach(reading => {
      const existing = latestMap.get(reading.roomId);
      if (!existing || (reading.year > existing.year) || (reading.year === existing.year && reading.month > existing.month)) {
        latestMap.set(reading.roomId, reading);
      }
    });
    return latestMap;
  }, [readings]);

  const paymentsByReadingId = useMemo(() => {
    const map = new Map<string, Payment>();
    payments.forEach(p => map.set(p.readingId, p));
    return map;
  }, [payments]);

  const creditsByRoomId = useMemo(() => {
    const map = new Map<string, number>();
    credits.forEach(c => map.set(c.roomId, c.amount));
    return map;
  }, [credits]);

  // Room handlers
  const handleOpenAddRoom = () => {
    setRoomToEdit(null);
    setIsRoomModalOpen(true);
  };
  
  const handleOpenEditRoom = (room: Room) => {
    setRoomToEdit(room);
    setIsRoomModalOpen(true);
  };

  const handleSaveRoom = (roomData: Omit<Room, 'id'> & { id?: string }) => {
    if (roomData.id) {
      setRooms(prev => prev.map(r => r.id === roomData.id ? { ...r, ...roomData } : r));
    } else {
      setRooms(prev => [...prev, { ...roomData, id: new Date().toISOString() }]);
    }
  };

  const handleDeleteRoom = (room: Room) => {
    setRoomToDelete(room);
    setIsConfirmModalOpen(true);
  };

  const confirmDeleteRoom = () => {
    if (roomToDelete) {
      // also delete associated readings, payments and credits
      const readingsToDelete = readings.filter(r => r.roomId === roomToDelete.id).map(r => r.id);
      setPayments(prev => prev.filter(p => !readingsToDelete.includes(p.readingId)));
      setReadings(prev => prev.filter(r => r.roomId !== roomToDelete.id));
      setCredits(prev => prev.filter(c => c.roomId !== roomToDelete.id));
      setRooms(prev => prev.filter(r => r.id !== roomToDelete.id));
    }
  };

  // Reading handlers
  const handleOpenAddReading = (room: Room) => {
    setRoomForReading(room);
    setIsReadingModalOpen(true);
  };
  
  const handleSaveReading = (readingData: Omit<Reading, 'id' | 'usage' | 'cost' | 'creditApplied' | 'finalCost'>) => {
    const usage = readingData.endReading - readingData.startReading;
    const cost = usage * ratePerKwh;
    
    const currentCredit = credits.find(c => c.roomId === readingData.roomId)?.amount || 0;
    const creditToApply = Math.min(cost, currentCredit);
    const finalCost = cost - creditToApply;

    if (creditToApply > 0) {
        const newCreditAmount = currentCredit - creditToApply;
        if (newCreditAmount > 0) {
            setCredits(prev => prev.map(c => c.roomId === readingData.roomId ? {...c, amount: newCreditAmount} : c));
        } else {
            setCredits(prev => prev.filter(c => c.roomId !== readingData.roomId));
        }
    }

    const newReading = { ...readingData, id: new Date().toISOString(), usage, cost, creditApplied: creditToApply, finalCost };
    setReadings(prev => [...prev, newReading]);
  };

  // Payment handlers
  const handleOpenPaymentModal = (reading: Reading) => {
    setReadingForPayment(reading);
    setIsPaymentModalOpen(true);
  };
  
  const handleOpenPaymentForRoom = (room: Room) => {
    const roomReadings = readings.filter(r => r.roomId === room.id);
    const paidReadingIds = new Set(payments.map(p => p.readingId));
    const unpaidReadings = roomReadings
      .filter(r => !paidReadingIds.has(r.id))
      .sort((a, b) => {
        if(b.year !== a.year) return b.year - a.year;
        return b.month - a.month;
      });
    
    if (unpaidReadings.length > 0) {
      handleOpenPaymentModal(unpaidReadings[0]);
    } else {
      alert("Tidak ada tagihan yang belum lunas untuk kamar ini.");
    }
  };

  const handleSavePayment = (paymentData: Omit<Payment, 'id'>) => {
    const reading = readings.find(r => r.id === paymentData.readingId);
    if (!reading) return;

    const overpayment = paymentData.amountPaid - reading.finalCost;

    if (overpayment > 0) {
        setCredits(prev => {
            const existingCredit = prev.find(c => c.roomId === reading.roomId);
            if (existingCredit) {
                return prev.map(c => c.roomId === reading.roomId ? {...c, amount: c.amount + overpayment} : c);
            } else {
                return [...prev, { roomId: reading.roomId, amount: overpayment }];
            }
        });
    }

    const newPayment = { ...paymentData, id: new Date().toISOString() };
    setPayments(prev => [...prev, newPayment]);
  };

  // Settings handler
  const handleSaveSettings = (newRate: number) => {
    setRatePerKwh(newRate);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white shadow-sm sticky top-0 z-10 no-print">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-indigo-600">Aplikasi Listrik Kost</h1>
          <div className="flex items-center space-x-2">
            <button onClick={() => setIsReportModalOpen(true)} className="flex items-center space-x-2 p-2 rounded-lg hover:bg-slate-100 transition-colors">
              <ReportIcon className="w-6 h-6 text-slate-600"/>
              <span className="font-semibold text-slate-700">Laporan</span>
            </button>
             <button onClick={() => setIsSettingsModalOpen(true)} className="flex items-center space-x-2 p-2 rounded-lg hover:bg-slate-100 transition-colors">
              <SettingsIcon className="w-6 h-6 text-slate-600"/>
              <span className="hidden sm:inline font-semibold text-slate-700">Pengaturan</span>
            </button>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-slate-800">Daftar Kamar</h2>
            <button
              onClick={handleOpenAddRoom}
              className="flex items-center justify-center bg-indigo-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 transition-all shadow-lg hover:shadow-xl"
            >
              <PlusIcon className="w-5 h-5 mr-2" />
              Tambah Kamar
            </button>
        </div>

        {rooms.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {rooms.map(room => {
              const latestReading = latestReadings.get(room.id);
              const payment = latestReading ? paymentsByReadingId.get(latestReading.id) : undefined;
              const credit = creditsByRoomId.get(room.id) || 0;
              const hasUnpaidBill = readings.some(r => r.roomId === room.id && !paymentsByReadingId.has(r.id));
              return (
              <RoomCard
                key={room.id}
                room={room}
                latestReading={latestReading}
                payment={payment}
                credit={credit}
                hasUnpaidBill={hasUnpaidBill}
                onAddReading={handleOpenAddReading}
                onAddPayment={handleOpenPaymentForRoom}
                onEdit={handleOpenEditRoom}
                onDelete={handleDeleteRoom}
              />
            )})}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-lg shadow-md">
            <p className="text-xl text-slate-500">Belum ada kamar yang ditambahkan.</p>
            <p className="text-slate-400 mt-2">Klik "Tambah Kamar" untuk memulai.</p>
          </div>
        )}
      </main>

      <RoomFormModal
        isOpen={isRoomModalOpen}
        onClose={() => setIsRoomModalOpen(false)}
        onSave={handleSaveRoom}
        roomToEdit={roomToEdit}
      />

      <ReadingFormModal
        isOpen={isReadingModalOpen}
        onClose={() => setIsReadingModalOpen(false)}
        onSave={handleSaveReading}
        room={roomForReading}
        latestReading={roomForReading ? latestReadings.get(roomForReading.id) : undefined}
        currentCredit={roomForReading ? creditsByRoomId.get(roomForReading.id) || 0 : 0}
        ratePerKwh={ratePerKwh}
      />

      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        onSave={handleSaveSettings}
        currentRate={ratePerKwh}
      />
      
      {readingForPayment && (
        <PaymentFormModal
          isOpen={isPaymentModalOpen}
          onClose={() => setIsPaymentModalOpen(false)}
          onSave={handleSavePayment}
          reading={readingForPayment}
          room={rooms.find(r => r.id === readingForPayment.roomId) || null}
        />
      )}

      <ConfirmationModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={confirmDeleteRoom}
        title="Konfirmasi Hapus"
        message={`Apakah Anda yakin ingin menghapus kamar ${roomToDelete?.number} (${roomToDelete?.owner})? Semua data tagihan, pembayaran, dan sisa kredit terkait juga akan dihapus.`}
      />

      <ReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        rooms={rooms}
        readings={readings}
        payments={payments}
        credits={credits}
        onPayReading={handleOpenPaymentModal}
      />
    </div>
  );
};

export default App;
