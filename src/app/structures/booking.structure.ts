import { Timestamp } from '@angular/fire/firestore';

export type Booking = {
  bookingId?: string;
  userId: string;
  bookedBy?: string; // will not send this to the backend, only added for search
  date: Timestamp;
  timeSlot: '10am to 2pm' | '3pm to 7pm' | '7pm to 11pm';
  seatNo: string;
  bookedFor: string;
  paidAmount: number;
  status: 'Confirmed' | 'Cancelled';
};
