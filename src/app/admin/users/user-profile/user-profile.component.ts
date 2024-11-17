import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AlertsAndNotificationsService } from 'src/app/services/alerts-and-notifications.service';
import { PageEvent } from '@angular/material/paginator';
import { DatabaseService } from 'src/app/services/database.service';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { DataProvider } from 'src/app/providers/data.provider';
import { Booking } from 'src/app/structures/booking.structure';
import { Timestamp } from '@angular/fire/firestore';
import { UserData } from 'src/app/structures/user.structure';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
})
export class UserProfileComponent implements OnInit {
  @ViewChild('photoInput') photoInput: ElementRef;
  editMode: boolean = false;
  user: any;
  allBookings: Booking [];
  bookings: any[];
  pageSize: number = 2;

  editForm: FormGroup = new FormGroup({
    displayName: new FormControl('', [Validators.required]),
    photoURL: new FormControl(''),
    phoneNumber: new FormControl(),
    email: new FormControl(),
    dob: new FormControl(),
    address: new FormControl(),
    bankName: new FormControl(),
    accountNo: new FormControl(),
    ifscCode: new FormControl(),
  });

  constructor(
    private dataProvider: DataProvider,
    private alertService: AlertsAndNotificationsService,
    private databaseService: DatabaseService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.router.events.forEach((event) => {
      if (event instanceof NavigationEnd) {
        const url = this.router.url;
        const urlArr = url.split('/');
        
        const userId = urlArr[urlArr.length - 1];

        if (urlArr.length == 4 && urlArr[urlArr.length - 2] == 'users') {
      
          this.getUser(userId);
        }
      }
    });
  }

  getUser(userId:string) {
    this.dataProvider.pageSetting.blur = true;
    this.databaseService.getUser(userId).then(async (user) => {

      if (user.exists()) {
        this.user = user.data();
        this.user.id = userId;
        await this.databaseService.getAllBookings().then((data) => {
          this.allBookings= [];
          data.forEach((doc) => {
              if(doc.data()!['userId'] == userId){
              
                    this.allBookings.push(doc.data() as Booking);
                    this.bookings = this.allBookings.slice(0, this.pageSize);
                
                }
              
            });
          });
      } else {
        this.router.navigate(['..'], { relativeTo: this.route });
        this.alertService.presentToast('Invalid user ID', 'error')
      }
      this.dataProvider.pageSetting.blur = false;
    });
  }

  ngOnInit(): void {
   

  }

  async saveChanges() {
    if (this.editForm.valid) {
      this.dataProvider.pageSetting.blur = true;

      const id = this.user.id;
      console.log(id);
      if (id) {
        // Upload photo, if it exists
        if (
          this.photoInput.nativeElement.files.length == 1 &&
          this.validateProfilePhoto()
        ) {
          await this.databaseService
            .upload('users/' + id, this.photoInput.nativeElement.files[0])
            .then((url) => {
              this.editForm.get('photoURL')!.setValue(url);
            });
        }

        const dob = new Date(this.editForm.get('dob')?.value);
        // Update user data
        const user = {
          name: this.editForm.get('displayName')?.value,
          photoURL: this.editForm.get('photoURL')?.value,
          dob: Timestamp.fromDate(dob),
          email: this.editForm.get('email')?.value,
          phone: this.editForm.get('phoneNumber')?.value,
          address: this.editForm.get('address')?.value,
          accountNo: this.editForm.get('accountNo')?.value,
          ifscCode: this.editForm.get('ifscCode')?.value,
          access: this.user.access,
          created: this.user.created,
          emailVerified: this.user.emailVerified,
          totalBookings: 0,
          lastBooking: null,
          activeNow: false,
        };
        // Send updated data to database
        await this.databaseService.editUser(id,user);

        this.editMode = false;
        this.alertService.presentToast('User updated successfully');
        location.reload();
      } else {
        this.alertService.presentToast(
          'Error: Unable to fetch user ID',
          'error'
        );
      }

      this.dataProvider.pageSetting.blur = false;
    } else {
      this.alertService.presentToast('Your name is required');
    }
  }


  goToEditMode() {
    if (this.user) {
      const dobDate = this.user.dob?.toDate();
      var dob;
      if (dobDate) {
        dob =
          String(dobDate.getFullYear()).padStart(4, '0') +
          '-' +
          String(dobDate.getMonth() + 1).padStart(2, '0') +
          '-' +
          String(dobDate.getDate()).padStart(2, '0');
      }

      this.editForm.patchValue({
        displayName: this.user.name,
        phoneNumber: this.user.phone,
        dob: dob,
        email: this.user.email,
        address: this.user.address,
        bankName: this.user.bankName,
        accountNo: this.user.accountNo,
        ifscCode: this.user.ifscCode,
      });
      this.editMode = true;
    } else {
      this.alertService.presentToast(
        'Error: Unable to fetch user data',
        'error'
      );
    }
  }

  validateProfilePhoto() {
    const file = this.photoInput.nativeElement.files[0];

    if (!['image/png', 'image/jpg', 'image/jpeg'].includes(file.type)) {
      this.alertService.presentToast(
        'Your photo should either be in .png or .jpg'
      );
      this.photoInput.nativeElement.value = '';
      return false;
    }

    if (file.size > 100_000) {
      this.alertService.presentToast(
        "Your photo's size should not exceed 100 KB"
      );
      this.photoInput.nativeElement.value = '';
      return false;
    }

    return true;
  }

  uploadProfilePhoto() {
    if (this.validateProfilePhoto()) {
      const file = this.photoInput.nativeElement.files[0];
    }
  }

  saveEdit() {
    if (confirm('Are you sure?') && this.editForm.valid) {
      if (this.photoInput.nativeElement.files.length == 1) {
        this.uploadProfilePhoto();
      }
      this.editMode = false;
    } else {
      this.alertService.presentToast('Your name is required');
    }
  }

  cancelEdit() {
    this.editMode = false;
  }

  getUsers(event: PageEvent) {
    var currIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    const startIndex = currIndex * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.bookings = this.bookings.slice(startIndex, endIndex);
    this.allBookings = this.bookings;
  }
}
