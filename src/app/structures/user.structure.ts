import { Timestamp } from '@angular/fire/firestore';

export type UserData = {
  id?: string;
  photoURL?: string;
  name: string;
  access: 'user' | 'admin';
  // some fields will be optional if access is admin
  email: string;
  emailVerified: boolean;
  phone: string;
  dob?: Timestamp;
  address?: string;
  accountNo?: string;
  ifscCode?: string;
  activeNow?: boolean;
  totalBookings?: number;
  lastBooking?: Timestamp | null;
  created?: Timestamp;
};
