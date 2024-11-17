import { Component, OnInit } from '@angular/core';
import { Timestamp } from '@angular/fire/firestore';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import Fuse from 'fuse.js';
import { DataProvider } from 'src/app/providers/data.provider';
import { AlertsAndNotificationsService } from 'src/app/services/alerts-and-notifications.service';
import { DatabaseService } from 'src/app/services/database.service';
import { Booking } from 'src/app/structures/booking.structure';
import { UserData } from 'src/app/structures/user.structure';
declare const UIkit: any;

@Component({
  selector: 'app-bookings',
  templateUrl: './bookings.component.html',
  styleUrls: ['./bookings.component.scss'],
})
export class BookingsComponent implements OnInit {
  bookings: Booking[];
  bookingNames: { [key: string]: string };
  filteredBookings: Booking[];
  pageSize: number = 2;
  allUsers: UserData[];
  seatNos: string[];
  bookingToEdit: Booking | null;
  bookingToCancel: Booking | null;
  bookingForm: FormGroup = new FormGroup({
    userId: new FormControl(null, [Validators.required]),
    date: new FormControl('', [Validators.required]),
    timeSlot: new FormControl(null, [Validators.required]),
    seatNo: new FormControl(null, [Validators.required]),
    bookedFor: new FormControl(null, [Validators.required]),
    paidAmount: new FormControl('', [Validators.required]),
  });

  constructor(
    private databaseService: DatabaseService,
    private dataProvider: DataProvider,
    private alertService: AlertsAndNotificationsService
  ) {}

  async ngOnInit(): Promise<void> {
    await this.databaseService.getAllBookings().then((data) => {
      this.bookings = [];
      this.bookingNames = {};

      data.forEach(async (doc) => {
        const booking = { bookingId: doc.id, ...doc.data() } as Booking;

        // Fetch user's name from the id if not already fetched
        if (!(booking.userId in this.bookingNames)) {
          await this.databaseService.getUser(booking.userId).then((user) => {
            this.bookingNames[booking.userId] = (user.data() as UserData).name;
          });
        }

        // Add to the booking object so that we can search
        booking.bookedBy = this.bookingNames[booking.userId];
        this.bookings.push(booking);
      });

      this.filteredBookings = this.bookings;
    });
  }

  editBooking(booking: Booking) {
    this.bookingToEdit = booking;
    this.bookingForm.patchValue(booking);
    const date = booking.date.toDate();
    this.bookingForm.patchValue({
      date:
        String(date.getFullYear()).padStart(4, '0') +
        '-' +
        String(date.getMonth() + 1).padStart(2, '0') +
        '-' +
        String(date.getDate()).padStart(2, '0'),
    });
  }

  async loadUsersAndSeats() {
    if (!this.allUsers || this.allUsers.length === 0) {
      await this.databaseService.getAllUsers().then((data) => {
        this.allUsers = [];
        data.forEach((doc) => {
          this.allUsers.push({ id: doc.id, ...doc.data() } as UserData);
        });
      });
    }
    if (!this.seatNos || this.seatNos.length === 0) {
      await this.databaseService.getSeats().then((data) => {
        this.seatNos = data.data()!['numbers'];
      });
    }
  }

  resetBookingModal() {
    this.bookingForm.reset();
    this.bookingToEdit = null;
  }

  async submit() {
    if (this.bookingForm.valid) {
      this.dataProvider.pageSetting.blur = true;
      const booking = this.bookingForm.value as Booking;
      booking.date = Timestamp.fromDate(
        new Date(this.bookingForm.get('date')?.value)
      );
      booking.status = 'Confirmed';
      if (this.bookingToEdit) {
        await this.databaseService.editBooking(
          this.bookingToEdit['bookingId']!,
          booking
        );
        this.alertService.presentToast('Booking edited successfully');
      } else {
        await this.databaseService.addBooking(booking);
        this.alertService.presentToast('Booking added successfully');
      }
      this.ngOnInit();
      UIkit.modal(document.getElementById('booking-modal')).hide();
      this.dataProvider.pageSetting.blur = false;
    }
  }

  searchBookings(event: Event) {
    const query = (event.target as HTMLInputElement)?.value.trim();
    if (query.length > 0) {
      const options = { keys: ['bookedBy', 'bookingNo'] };
      const fuse = new Fuse(this.bookings, options);
      const results = fuse.search(query);
      this.filteredBookings = [];
      results.forEach((result: any) => {
        this.filteredBookings.push(result.item);
      });
    } else {
      this.filteredBookings = this.bookings;
    }
  }

  cancelBooking() {
    this.dataProvider.pageSetting.blur = true;
    if (this.bookingToCancel) {
      const amountToRefund = 0.8 * this.bookingToCancel.paidAmount; // 80% of the booking amount will be refund
      this.databaseService
        .cancelBooking(this.bookingToCancel['bookingId']!, amountToRefund)
        .then(async () => {
          UIkit.modal(document.getElementById('delete-confirm-modal')).hide();
          this.ngOnInit();
          this.dataProvider.pageSetting.blur = false;
          this.alertService.presentToast('Booking cancelled successfully');
        });
    }
  }
}
