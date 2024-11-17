import { Injectable } from '@angular/core';
import {
  Firestore,
  addDoc,
  collection,
  doc,
  updateDoc,
  deleteDoc,
  getDocs,
  query,
  getDoc,
  setDoc,
  where,
} from '@angular/fire/firestore';

import {
  DocumentSnapshot,
  endAt,
  increment,
  limit,
  limitToLast,
  orderBy,
  startAfter,
} from 'firebase/firestore';
import { Card } from '../structures/card.structure';
import { UserData } from '../structures/user.structure';
import { Booking } from '../structures/booking.structure';
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from '@angular/fire/storage';

@Injectable({
  providedIn: 'root',
})
export class DatabaseService {
  storage = getStorage();

  constructor(private fs: Firestore) {}

  async upload(
    path: string,
    file: File | ArrayBuffer | Blob | Uint8Array
  ): Promise<any> {
    // const ext = file!.name.split('.').pop();
    if (file) {
      try {
        const storageRef = ref(this.storage, path);
        const task = uploadBytesResumable(storageRef, file);
        await task;
        const url = await getDownloadURL(storageRef);
        return url;
      } catch (e: any) {
        console.error(e);
        return e;
      }
    } else {
      // handle invalid file
      return false;
    }
  }

  getCounters() {
    return getDoc(doc(this.fs, 'sitedata/counters/'));
  }

  getSeats() {
    return getDoc(doc(this.fs, 'sitedata/seats/'));
  }

  async addUser(user: UserData) {
    await updateDoc(doc(this.fs, 'sitedata/counters'), {
      totalUsers: increment(1),
    });
    await this.updateUserAnalytics('added');
    return addDoc(collection(this.fs, 'users'), user);
  }

  getAllUsers() {
    return getDocs(
      query(
        collection(this.fs, 'users'),
        where('access', '==', 'user'),
        orderBy('name')
      )
    );
  }

  getActiveUsers() {
    return getDocs(
      query(
        collection(this.fs, 'users'),
        where('activeNow', '==', true),
        orderBy('name')
      )
    );
  }

  getFirstUsers(length: number) {
    return getDocs(
      query(
        collection(this.fs, 'users'),
        where('access', '==', 'user'),
        orderBy('name'),
        limit(length)
      )
    );
  }

  getNextUsers(length: number, lastDocument: DocumentSnapshot) {
    return getDocs(
      query(
        collection(this.fs, 'users'),
        orderBy('name'),
        where('access', '==', 'user'),
        limit(length),
        startAfter(lastDocument)
      )
    );
  }

  getPreviousUsers(length: number, firstDocument: DocumentSnapshot) {
    return getDocs(
      query(
        collection(this.fs, 'users'),
        orderBy('name'),
        where('access', '==', 'user'),
        limitToLast(length),
        endAt(firstDocument)
      )
    );
  }

  editUser(userId: string, user: UserData) {
    return updateDoc(doc(this.fs, 'users/' + userId), user);
  }

  async deleteUser(userId: string) {
    await updateDoc(doc(this.fs, 'sitedata/counters'), {
      totalUsers: increment(-1),
    });
    this.updateUserAnalytics('deleted');
    return deleteDoc(doc(this.fs, 'users/' + userId));
  }

  //Cards CRUD
  addCard(card: Card) {
    return addDoc(collection(this.fs, 'cards'), card);
  }

  // addCard(card: Card) {
  //   return addDoc(collection(this.fs, 'cards'), card);
  // }

  getAllCard() {
    return getDocs(query(collection(this.fs, 'cards'), orderBy('price')));
  }

  editCard(id: string, card: Card) {
    return updateDoc(doc(this.fs, 'cards/' + id), card);
  }

  deleteCard(id: string) {
    return deleteDoc(doc(this.fs, 'cards/' + id));
  }

  ///getUsers
  getUser(id: string) {
    return getDoc(doc(this.fs, 'users/' + id));
  }

  //CRUD for bookings

  async addBooking(booking: Booking) {
    await updateDoc(doc(this.fs, 'sitedata/counters'), {
      totalBookings: increment(1),
    });
    await this.updateBookingAnalytics('added');
    await this.updateEarningAnalytics(booking.paidAmount);
    return addDoc(collection(this.fs, 'bookings'), booking);
  }

  getAllBookings() {
    return getDocs(query(collection(this.fs, 'bookings'), orderBy('date')));
  }

  getFirstBookings(length: number) {
    return getDocs(
      query(
        collection(this.fs, 'bookings'),
        orderBy('bookingNo'),
        limit(length)
      )
    );
  }

  getNextBookings(length: number, lastDocument: DocumentSnapshot) {
    return getDocs(
      query(
        collection(this.fs, 'bookings'),
        orderBy('bookingNo'),
        limit(length),
        startAfter(lastDocument)
      )
    );
  }

  getPreviousBookings(length: number, firstDocument: DocumentSnapshot) {
    return getDocs(
      query(
        collection(this.fs, 'bookings'),
        orderBy('bookingNo'),
        limitToLast(length),
        endAt(firstDocument)
      )
    );
  }

  async editBooking(bookingId: string, booking: Booking) {
    // calculate difference between payable amounts
    const oldBookingDoc = await getDoc(doc(this.fs, 'bookings/' + bookingId));
    if (oldBookingDoc.exists()) {
      const oldBooking = oldBookingDoc.data() as Booking;
      const difference = booking.paidAmount - oldBooking.paidAmount;
      await this.updateEarningAnalytics(difference);
      return updateDoc(doc(this.fs, 'bookings/' + bookingId), booking);
    }
  }

  async cancelBooking(bookingId: string, refundAmount: number) {
    await updateDoc(doc(this.fs, 'sitedata/counters'), {
      totalCancelledBookings: increment(1),
    });
    await this.updateBookingAnalytics('cancelled');
    await this.updateEarningAnalytics(-refundAmount);
    return updateDoc(doc(this.fs, 'bookings/' + bookingId), {
      status: 'Cancelled',
    });
  }

  updateBookingAnalytics(booking: 'added' | 'cancelled') {
    const today = new Date();
    const docId = today.getMonth().toString() + today.getFullYear().toString();
    return setDoc(
      doc(this.fs, 'analytics/' + docId),
      {
        bookings: increment(booking == 'added' ? 1 : 0),
        cancelled: increment(booking == 'cancelled' ? 1 : 0),
      },
      { merge: true }
    );
  }

  updateUserAnalytics(user: 'added' | 'deleted') {
    const today = new Date();
    const docId = today.getMonth().toString() + today.getFullYear().toString();
    return setDoc(
      doc(this.fs, 'analytics/' + docId),
      {
        users: user == 'added' ? increment(1) : increment(-1),
      },
      { merge: true }
    );
  }

  updateEarningAnalytics(amount: number) {
    const today = new Date();
    const docId = today.getMonth().toString() + today.getFullYear().toString();
    return setDoc(
      doc(this.fs, 'analytics/' + docId),
      {
        earnings: increment(amount),
      },
      { merge: true }
    );
  }

  getAnalytics(month: number, year: number) {
    return getDoc(
      doc(this.fs, 'analytics/' + month.toString() + year.toString())
    );
  }

  
  getAllNotification() {
    return getDocs(query(collection(this.fs, 'admin-notifications'), orderBy('timestamp')));
  }


  
}
