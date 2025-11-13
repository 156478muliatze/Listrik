
import React, { useState, useEffect } from 'react';
import { Room } from '../types';

interface RoomFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (room: Omit<Room, 'id'> & { id?: string }) => void;
  roomToEdit?: Room | null;
}

const RoomFormModal: React.FC<RoomFormModalProps> = ({ isOpen, onClose, onSave, roomToEdit }) => {
  const [number, setNumber] = useState('');
  const [owner, setOwner] = useState('');

  useEffect(() => {
    if (roomToEdit) {
      setNumber(roomToEdit.number);
      setOwner(roomToEdit.owner);
    } else {
      setNumber('');
      setOwner('');
    }
  }, [roomToEdit, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!number || !owner) {
        alert("Nomor kamar dan nama pemilik tidak boleh kosong.");
        return;
    }
    onSave({ id: roomToEdit?.id, number, owner });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6">{roomToEdit ? 'Edit Kamar' : 'Tambah Kamar Baru'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="roomNumber" className="block text-slate-700 font-medium mb-2">Nomor Kamar</label>
            <input
              id="roomNumber"
              type="text"
              value={number}
              onChange={(e) => setNumber(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>
          <div className="mb-6">
            <label htmlFor="ownerName" className="block text-slate-700 font-medium mb-2">Nama Pemilik / Penghuni</label>
            <input
              id="ownerName"
              type="text"
              value={owner}
              onChange={(e) => setOwner(e.target.value)}
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

export default RoomFormModal;
