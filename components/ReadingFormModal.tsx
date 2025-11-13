import React, { useState, useEffect, useMemo } from 'react';
import { Room, Reading } from '../types';

interface ReadingFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (reading: Omit<Reading, 'id' | 'usage' | 'cost' | 'creditApplied' | 'finalCost'>) => void;
  room: Room | null;
  latestReading?: Reading;
  currentCredit: number;
  ratePerKwh: number;
}

const ReadingFormModal: React.FC<ReadingFormModalProps> = ({ isOpen, onClose, onSave, room, latestReading, currentCredit, ratePerKwh }) => {
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [startReading, setStartReading] = useState(0);
  const [endReading, setEndReading] = useState(0);

  useEffect(() => {
    if (isOpen) {
        const currentDate = new Date();
        setMonth(currentDate.getMonth() + 1);
        setYear(currentDate.getFullYear());
        setStartReading(latestReading?.endReading || 0);
        setEndReading(latestReading?.endReading || 0);
    }
  }, [isOpen, latestReading]);

  const usage = useMemo(() => {
      const end = endReading || 0;
      const start = startReading || 0;
      return end > start ? end - start : 0;
  }, [startReading, endReading]);
  
  const cost = useMemo(() => usage * ratePerKwh, [usage, ratePerKwh]);
  const creditToApply = useMemo(() => Math.min(cost, currentCredit), [cost, currentCredit]);
  const finalCost = useMemo(() => cost - creditToApply, [cost, creditToApply]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (endReading <= startReading) {
        alert("Meteran bulan ini harus lebih besar dari meteran bulan lalu.");
        return;
    }
    if(room) {
        onSave({
          roomId: room.id,
          month,
          year,
          startReading,
          endReading,
        });
        onClose();
    }
  };
  
  const formatNumber = (num: number) => new Intl.NumberFormat('id-ID').format(num);

  if (!isOpen || !room) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-2">Catat Meteran Baru</h2>
        <p className="text-slate-600 mb-6">Kamar {room.number} ({room.owner})</p>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
                <label htmlFor="month" className="block text-slate-700 font-medium mb-2">Bulan</label>
                <select id="month" value={month} onChange={e => setMonth(Number(e.target.value))} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500">
                    {Array.from({length: 12}, (_, i) => i + 1).map(m => (
                        <option key={m} value={m}>{new Date(2000, m - 1, 1).toLocaleString('id-ID', { month: 'long' })}</option>
                    ))}
                </select>
            </div>
            <div>
                 <label htmlFor="year" className="block text-slate-700 font-medium mb-2">Tahun</label>
                 <input id="year" type="number" value={year} onChange={e => setYear(Number(e.target.value))} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="startReading" className="block text-slate-700 font-medium mb-2">Meteran Lama (kWh)</label>
              <input
                id="startReading"
                type="number"
                value={startReading}
                onChange={(e) => setStartReading(Number(e.target.value))}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg bg-slate-100"
                readOnly
              />
            </div>
            <div>
              <label htmlFor="endReading" className="block text-slate-700 font-medium mb-2">Meteran Baru (kWh)</label>
              <input
                id="endReading"
                type="number"
                value={endReading}
                onChange={(e) => setEndReading(Number(e.target.value))}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
          </div>

          <div className="bg-indigo-50 p-4 rounded-lg mt-6">
              <h3 className="font-semibold text-lg text-indigo-800 mb-2">Ringkasan Tagihan</h3>
              <div className="space-y-1 text-indigo-700">
                  <p>Pemakaian: <span className="font-bold">{formatNumber(usage)} kWh</span></p>
                  <p>Subtotal Tagihan: <span className="font-bold">Rp {formatNumber(cost)}</span></p>
                  {creditToApply > 0 && <p className="text-blue-600">Kredit Digunakan: <span className="font-bold">- Rp {formatNumber(creditToApply)}</span></p>}
                  <p className="text-xl border-t border-indigo-200 pt-2 mt-2">Total Bayar: <span className="font-bold">Rp {formatNumber(finalCost)}</span></p>
              </div>
          </div>
          
          <div className="flex justify-end space-x-4 mt-8">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 bg-slate-100 text-slate-700 font-semibold rounded-lg hover:bg-slate-200 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-indigo-500 text-white font-semibold rounded-lg hover:bg-indigo-600 transition-colors"
            >
              Simpan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReadingFormModal;
