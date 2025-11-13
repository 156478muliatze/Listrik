import React from 'react';
import { Room, Reading, Payment } from '../types';
import { EditIcon, TrashIcon, BoltIcon, CurrencyDollarIcon, CheckCircleIcon } from './icons';

interface RoomCardProps {
  room: Room;
  latestReading?: Reading;
  payment?: Payment;
  credit: number;
  hasUnpaidBill: boolean;
  onAddReading: (room: Room) => void;
  onAddPayment: (room: Room) => void;
  onEdit: (room: Room) => void;
  onDelete: (room: Room) => void;
}

const RoomCard: React.FC<RoomCardProps> = ({ room, latestReading, payment, credit, hasUnpaidBill, onAddReading, onAddPayment, onEdit, onDelete }) => {
  const formatNumber = (num: number) => new Intl.NumberFormat('id-ID').format(num);
  const isPaid = !!payment;

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden transition-transform duration-300 hover:scale-105 hover:shadow-lg flex flex-col">
      <div className="p-6 flex-grow">
        <div className="flex justify-between items-start">
          <div>
            <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold">Kamar {room.number}</div>
            <p className="block mt-1 text-lg leading-tight font-medium text-black">{room.owner}</p>
          </div>
          <div className="flex space-x-2">
            <button onClick={() => onEdit(room)} className="text-slate-500 hover:text-slate-800 transition-colors">
              <EditIcon />
            </button>
            <button onClick={() => onDelete(room)} className="text-slate-500 hover:text-red-600 transition-colors">
              <TrashIcon />
            </button>
          </div>
        </div>
        
        <div className="mt-4 border-t border-slate-200 pt-4">
          <div className="flex justify-between items-center mb-2">
            <h4 className="text-md font-semibold text-slate-700">Info Terakhir</h4>
            {credit > 0 && (
                 <span className="text-sm font-semibold text-blue-600 bg-blue-100 px-3 py-1 rounded-full">
                    Sisa Kredit: Rp {formatNumber(credit)}
                </span>
            )}
          </div>
          {latestReading ? (
            <div className="space-y-2 text-slate-600">
              <p><strong>Periode:</strong> {new Date(latestReading.year, latestReading.month - 1).toLocaleString('id-ID', { month: 'long', year: 'numeric' })}</p>
              <p><strong>Pemakaian:</strong> {formatNumber(latestReading.usage)} kWh</p>
              <div className="flex justify-between items-center">
                <p className="font-bold text-lg text-indigo-600"><strong>Tagihan:</strong> Rp {formatNumber(latestReading.finalCost)}</p>
                {isPaid && (
                  <span className="flex items-center text-sm font-semibold text-green-600 bg-green-100 px-3 py-1 rounded-full">
                    <CheckCircleIcon className="w-5 h-5 mr-1" />
                    Lunas
                  </span>
                )}
              </div>
            </div>
          ) : (
            <p className="text-slate-500 italic">Belum ada data pemakaian.</p>
          )}
        </div>
      </div>
      
      <div className="p-6 pt-0 mt-auto">
          <div className="grid grid-cols-2 gap-2 text-sm">
             <button
                onClick={() => onAddReading(room)}
                className="w-full flex items-center justify-center bg-indigo-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 transition-colors"
              >
                <BoltIcon className="w-4 h-4 mr-2" />
                Catat Meteran
              </button>
            
              <button
                onClick={() => onAddPayment(room)}
                disabled={!hasUnpaidBill}
                className="w-full flex items-center justify-center bg-green-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition-colors disabled:bg-slate-300 disabled:cursor-not-allowed"
              >
                <CurrencyDollarIcon className="w-4 h-4 mr-2" />
                Bayar Tagihan
              </button>
          </div>
      </div>
    </div>
  );
};

export default RoomCard;
