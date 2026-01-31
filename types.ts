export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  phone: string;
  depositBal: number;
  winningBal: number;
  bonusBal: number;
  totalMatches: number;
  totalWon: number;
  lifetimeEarnings: number;
  status: string;
}

export interface Tournament {
  id: string;
  title: string;
  bannerUrl: string;
  status: 'Open' | 'Live' | 'Completed' | 'Full';
  prizePool: number;
  topWinners: number;
  maxSlots: number;
  booyah: number;
  perKill: number;
  entryFee: number;
  startTime: string; // ISO string or timestamp
  map: string;
  roomId?: string;
  roomPass?: string;
}

export interface Transaction {
  id: string;
  type: string;
  amount: number;
  status: 'Success' | 'Pending' | 'Failed';
  date: string;
}

export interface Notification {
  id: string;
  title: string;
  body: string;
  date: string;
}

export type ScreenName = 'auth' | 'home' | 'wallet' | 'profile' | 'notifications' | 'add-money' | 'withdraw' | 'edit-profile' | 'transactions';
