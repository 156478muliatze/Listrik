export interface Room {
  id: string;
  number: string;
  owner: string;
}

export interface Reading {
  id: string;
  roomId: string;
  month: number; // 1-12
  year: number;
  startReading: number;
  endReading: number;
  usage: number;
  cost: number;
  creditApplied: number;
  finalCost: number;
}

export interface Payment {
  id:string;
  readingId: string;
  paymentDate: string; // ISO string date
  amountPaid: number;
}

export interface Credit {
    roomId: string;
    amount: number;
}
