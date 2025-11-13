import React, { useState, useMemo } from 'react';
import { Room, Reading, Payment, Credit } from '../types';
import { CheckCircleIcon } from './icons';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  rooms: Room[];
  readings: Reading[];
  payments: Payment[];
  credits: Credit[];
  onPayReading: (reading: Reading) => void;
}

const ReportModal: React.FC<ReportModalProps> = ({ isOpen, onClose, rooms, readings, payments, credits, onPayReading }) => {
  const [viewMode, setViewMode] = useState<'all' | 'single'>('all');
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const paymentsByReadingId = useMemo(() => {
    const map = new Map<string, Payment>();
    payments.forEach(p => map.set(p.readingId, p));
    return map;
  }, [payments]);

  const filteredReadings = useMemo(() => {
    if (viewMode === 'single') return [];
    return readings
      .filter(r => r.month === selectedMonth && r.year === selectedYear)
      .map(reading => {
        const room = rooms.find(room => room.id === reading.roomId);
        const payment = paymentsByReadingId.get(reading.id);
        return { ...reading, room, payment };
      })
      .filter(item => item.room);
  }, [readings, rooms, selectedMonth, selectedYear, paymentsByReadingId, viewMode]);
  
  const selectedRoomDetails = useMemo(() => {
    if (viewMode !== 'single' || !selectedRoomId) return null;
    const room = rooms.find(r => r.id === selectedRoomId);
    if (!room) return null;
    
    const roomReadings = [...readings]
      .filter(r => r.roomId === selectedRoomId)
      .sort((a, b) => {
          if (b.year !== a.year) return b.year - a.year;
          return b.month - a.month;
      });

    const credit = credits.find(c => c.roomId === selectedRoomId)?.amount || 0;

    return { room, readings: roomReadings, credit };
  }, [viewMode, selectedRoomId, rooms, readings, credits]);


  const availableYears = useMemo(() => {
      const years = new Set(readings.map(r => r.year));
      return Array.from(years).sort((a, b) => Number(b) - Number(a));
  }, [readings]);
  
  const formatNumber = (num: number) => new Intl.NumberFormat('id-ID').format(num);
  const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' });

  const handleClose = () => {
    onClose();
    setTimeout(() => {
      setViewMode('all');
      setSelectedRoomId(null);
    }, 300); // Reset state after modal close animation
  }
  
  const handleViewRoomDetails = (roomId: string) => {
    setSelectedRoomId(roomId);
    setViewMode('single');
  }

  const handleBackToAll = () => {
    setViewMode('all');
    setSelectedRoomId(null);
  }

  if (!isOpen) return null;

  const renderAllRoomsView = () => (
    <>
      <div className="no-print flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Laporan Pemakaian Listrik</h2>
          <div className="flex items-center space-x-2">
                <select value={selectedMonth} onChange={e => setSelectedMonth(Number(e.target.value))} className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500">
                  {Array.from({length: 12}, (_, i) => i + 1).map(m => (
                      <option key={m} value={m}>{new Date(2000, m - 1, 1).toLocaleString('id-ID', { month: 'long' })}</option>
                  ))}
              </select>
              <select value={selectedYear} onChange={e => setSelectedYear(Number(e.target.value))} className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500">
                  {availableYears.length > 0 ? availableYears.map(y => <option key={y} value={y}>{y}</option>) : <option value={new Date().getFullYear()}>{new Date().getFullYear()}</option>}
              </select>
          </div>
      </div>
      <div id="report-content">
          <h3 className="text-xl font-semibold text-center mb-1">Laporan Tagihan Listrik Kost</h3>
          <p className="text-center text-slate-600 mb-6">Bulan: {new Date(selectedYear, selectedMonth - 1).toLocaleString('id-ID', { month: 'long', year: 'numeric' })}</p>
          {filteredReadings.length > 0 ? (
          <table className="w-full text-left border-collapse">
              <thead className="bg-slate-100">
              <tr>
                  <th className="p-3 font-semibold text-sm border-b">No. Kamar</th>
                  <th className="p-3 font-semibold text-sm border-b">Penghuni</th>
                  <th className="p-3 font-semibold text-sm border-b text-right">Pemakaian (kWh)</th>
                  <th className="p-3 font-semibold text-sm border-b text-right">Total Tagihan</th>
                  <th className="p-3 font-semibold text-sm border-b text-center">Status</th>
              </tr>
              </thead>
              <tbody>
              {filteredReadings.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50">
                      <td className="p-3 border-b border-slate-200">{item.room?.number}</td>
                      <td className="p-3 border-b border-slate-200">
                        <button onClick={() => handleViewRoomDetails(item.roomId)} className="text-indigo-600 hover:underline font-medium">
                          {item.room?.owner}
                        </button>
                      </td>
                      <td className="p-3 border-b border-slate-200 text-right font-medium">{formatNumber(item.usage)}</td>
                      <td className="p-3 border-b border-slate-200 text-right font-bold text-indigo-600">Rp {formatNumber(item.finalCost)}</td>
                      <td className="p-3 border-b border-slate-200 text-center">
                          {item.payment ? (
                                <span className="inline-flex items-center text-xs font-semibold text-green-700 bg-green-100 px-2 py-1 rounded-full">
                                  <CheckCircleIcon className="w-4 h-4 mr-1"/>
                                  Lunas
                              </span>
                          ) : (
                              <span className="inline-flex text-xs font-semibold text-red-700 bg-red-100 px-2 py-1 rounded-full">
                                  Belum Lunas
                              </span>
                          )}
                      </td>
                  </tr>
              ))}
              </tbody>
          </table>
          ) : <p className="text-center text-slate-500 py-10">Tidak ada data untuk periode yang dipilih.</p>}
      </div>
    </>
  );
  
  const renderSingleRoomView = () => {
    if (!selectedRoomDetails) return null;
    const { room, readings: roomReadings, credit } = selectedRoomDetails;
    return (
      <>
        <div className="no-print flex justify-between items-start mb-6">
            <div>
              <button onClick={handleBackToAll} className="text-indigo-600 hover:text-indigo-800 font-semibold mb-4">&larr; Kembali ke Laporan Bulanan</button>
              <h2 className="text-2xl font-bold">Riwayat Tagihan Kamar {room.number}</h2>
              <p className="text-slate-600 text-lg">{room.owner}</p>
            </div>
            {credit > 0 && (
              <div className="text-right">
                <p className="font-semibold text-slate-700">Sisa Kredit</p>
                <p className="font-bold text-2xl text-blue-600">Rp {formatNumber(credit)}</p>
              </div>
            )}
        </div>
        <div id="room-detail-content">
          {roomReadings.length > 0 ? (
          <table className="w-full text-left border-collapse">
              <thead className="bg-slate-100">
              <tr>
                  <th className="p-3 font-semibold text-sm border-b">Periode</th>
                  <th className="p-3 font-semibold text-sm border-b text-right">Tagihan Asli</th>
                  <th className="p-3 font-semibold text-sm border-b text-right">Kredit Digunakan</th>
                  <th className="p-3 font-semibold text-sm border-b text-right">Tagihan Akhir</th>
                  <th className="p-3 font-semibold text-sm border-b text-center">Status Pembayaran</th>
              </tr>
              </thead>
              <tbody>
              {roomReadings.map((reading) => {
                  const payment = paymentsByReadingId.get(reading.id);
                  return (
                  <tr key={reading.id} className="hover:bg-slate-50">
                      <td className="p-3 border-b border-slate-200">{new Date(reading.year, reading.month - 1).toLocaleString('id-ID', { month: 'long', year: 'numeric' })}</td>
                      <td className="p-3 border-b border-slate-200 text-right">Rp {formatNumber(reading.cost)}</td>
                      <td className="p-3 border-b border-slate-200 text-right text-blue-600">- Rp {formatNumber(reading.creditApplied)}</td>
                      <td className="p-3 border-b border-slate-200 text-right font-bold text-indigo-600">Rp {formatNumber(reading.finalCost)}</td>
                      <td className="p-3 border-b border-slate-200 text-center">
                            {payment ? (
                              <div className="text-xs text-green-700 flex flex-col items-center">
                                  <span className="font-bold inline-flex items-center"><CheckCircleIcon className="w-4 h-4 mr-1"/> Lunas</span>
                                  <span>({formatDate(payment.paymentDate)})</span>
                              </div>
                          ) : (
                            reading.finalCost > 0 ? (
                              <button onClick={() => onPayReading(reading)} className="bg-green-500 text-white text-xs font-bold py-1 px-3 rounded-md hover:bg-green-600">
                                  Bayar
                              </button>
                            ) : (
                               <span className="inline-flex items-center text-xs font-semibold text-green-700 bg-green-100 px-2 py-1 rounded-full">
                                  <CheckCircleIcon className="w-4 h-4 mr-1"/>
                                  Lunas (Kredit)
                              </span>
                            )
                          )}
                      </td>
                  </tr>
              )})}
              </tbody>
          </table>
          ) : <p className="text-center text-slate-500 py-10">Tidak ada riwayat tagihan untuk kamar ini.</p>}
        </div>
      </>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-5xl max-h-[90vh] flex flex-col print-container">
        <div className="flex-grow overflow-y-auto">
          {viewMode === 'all' ? renderAllRoomsView() : renderSingleRoomView()}
        </div>
        <div className="flex justify-end space-x-4 mt-8 no-print">
          <button type="button" onClick={handleClose} className="px-6 py-2 bg-slate-100 text-slate-700 font-semibold rounded-lg hover:bg-slate-200 transition-colors">
            Tutup
          </button>
          <button type="button" onClick={() => window.print()} className="px-6 py-2 bg-indigo-500 text-white font-semibold rounded-lg hover:bg-indigo-600 transition-colors">
            Cetak
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportModal;
