import React, { useState, useEffect } from 'react';
import { Room, Reading, Payment } from '../types';

interface PaymentFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (payment: Omit<Payment, 'id'>) => void;
  reading: Reading | null;
  room: Room | null;
}

const PaymentFormModal: React.FC<PaymentFormModalProps> = ({ isOpen, onClose, onSave, reading, room }) => {
  const [paymentDate, setPaymentDate] = useState('');
  const [amountPaid, setAmountPaid] = useState(0);

  useEffect(() => {
    if (reading) {
      setPaymentDate(new Date().toISOString().split('T')[0]); // Set today's date
      setAmountPaid(reading.finalCost);
    }
  }, [reading, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (amountPaid < reading.finalCost) {
      if(!window.confirm("Jumlah pembayaran kurang dari tagihan. Anda yakin ingin melanjutkan?")) {
        return;
      }
    }
    if (reading) {
      onSave({
        readingId: reading.id,
        paymentDate,
        amountPaid,
      });
      onClose();
    }
  };

  const formatNumber = (num: number) => new Intl.NumberFormat('id-ID').format(num);

  if (!isOpen || !reading || !room) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-2">Catat Pembayaran</h2>
        <p className="text-slate-600 mb-6">Kamar {room.number} ({room.owner})</p>

        <div className="bg-indigo-50 p-4 rounded-lg mb-6">
          <h3 className="font-semibold text-lg text-indigo-800 mb-2">Detail Tagihan</h3>
          <div className="space-y-1 text-indigo-700">
            <p>Periode: <span className="font-bold">{new Date(reading.year, reading.month - 1).toLocaleString('id-ID', { month: 'long', year: 'numeric' })}</span></p>
            <p>Tagihan Asli: <span className="font-bold">Rp {formatNumber(reading.cost)}</span></p>
            {reading.creditApplied > 0 && <p className="text-blue-600">Kredit Digunakan: <span className="font-bold">- Rp {formatNumber(reading.creditApplied)}</span></p>}
            <p className="text-xl border-t border-indigo-200 pt-2 mt-2">Total Tagihan: <span className="font-bold">Rp {formatNumber(reading.finalCost)}</span></p>
          </div>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="paymentDate" className="block text-slate-700 font-medium mb-2">Tanggal Pembayaran</label>
            <input
              id="paymentDate"
              type="date"
              value={paymentDate}
              onChange={(e) => setPaymentDate(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>
           <div className="mb-6">
            <label htmlFor="amountPaid" className="block text-slate-700 font-medium mb-2">Jumlah Dibayar (Rp)</label>
            <input
              id="amountPaid"
              type="number"
              value={amountPaid}
              onChange={(e) => setAmountPaid(Number(e.target.value))}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 bg-slate-100 text-slate-700 font-semibold rounded-lg hover:bg-slate-200 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition-colors"
            >
              Simpan Pembayaran
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PaymentFormModal;
