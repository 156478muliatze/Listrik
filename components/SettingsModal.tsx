
import React, { useState, useEffect } from 'react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (newRate: number) => void;
  currentRate: number;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, onSave, currentRate }) => {
  const [rate, setRate] = useState(currentRate);

  useEffect(() => {
    setRate(currentRate);
  }, [currentRate, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if(rate > 0) {
        onSave(rate);
        onClose();
    } else {
        alert("Tarif harus lebih besar dari 0.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6">Pengaturan</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label htmlFor="ratePerKwh" className="block text-slate-700 font-medium mb-2">Tarif per kWh (Rp)</label>
            <input
              id="ratePerKwh"
              type="number"
              value={rate}
              onChange={(e) => setRate(Number(e.target.value))}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
              min="1"
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

export default SettingsModal;
