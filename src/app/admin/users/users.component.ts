import { Component, OnInit, ViewChild } from '@angular/core';
import { Timestamp } from '@angular/fire/firestore';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { DataProvider } from 'src/app/providers/data.provider';
import { AlertsAndNotificationsService } from 'src/app/services/alerts-and-notifications.service';
import { DatabaseService } from 'src/app/services/database.service';
import { UserData } from 'src/app/structures/user.structure';
import Fuse from 'fuse.js';
declare const UIkit: any;
@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent implements OnInit {
  totalUsers: number;
  allUsers: UserData[];
  users: any[];
  filteredUsers: any[];
  pageSize: number = 10;
  userToEdit: any;
  userToDelete: any;
  userForm: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required]),
    photoURL: new FormControl(''),
    dob: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required]),
    phone: new FormControl('', [Validators.required]),
    address: new FormControl('', [Validators.required]),
    accountNo: new FormControl('', [Validators.required]),
    ifscCode: new FormControl('', [Validators.required]),
  });

  @ViewChild('paginator') paginator: any;

  constructor(
    private databaseService: DatabaseService,
    private alertService: AlertsAndNotificationsService,
    private dataProvider: DataProvider
  ) {}

  ngOnInit(): void {
    this.databaseService.getCounters().then((doc) => {
      this.totalUsers = doc.data()!['totalUsers'];
    });

    this.databaseService.getFirstUsers(this.pageSize).then((docs) => {
      this.users = [];
      docs.forEach((doc) => {
        this.users.push({ id: doc.id, ...doc.data() });
      });
      this.filteredUsers = this.users;
    });
  }
  resetSubscriptionModal() {
    this.userForm.reset();

    this.userToEdit = null;
  }
  async searchUsers(event: Event) {
    if (!this.allUsers) {
      this.dataProvider.pageSetting.blur = true;
      await this.databaseService.getAllUsers().then((docs) => {
        this.allUsers = [];
        docs.forEach((doc) => {
          this.allUsers.push({ id: doc.id, ...doc.data() } as UserData);
        });
      });
      this.dataProvider.pageSetting.blur = false;
    }

    const query = (event.target as HTMLInputElement)?.value.trim();
    if (query.length > 0) {
      const options = { keys: ['name', 'phone'] };
      const fuse = new Fuse(this.allUsers, options);
      const results = fuse.search(query);
      this.filteredUsers = [];
      results.forEach((result: any) => {
        this.filteredUsers.push(result.item);
      });
    } else {
      this.filteredUsers = this.users;
    }
  }
  deleteUser() {
    this.dataProvider.pageSetting.blur = true;
    this.databaseService.deleteUser(this.userToDelete.id).then(async () => {
      UIkit.modal(document.getElementById('delete-confirm-modal')).hide();
      this.dataProvider.pageSetting.blur = false;
      this.alertService.presentToast('User deleted successfully');
      this.ngOnInit();
    });
  }
  validatePhotos(event: Event): void {
    const target = event.target as HTMLInputElement;
    const files = target.files;
    if (files) {
      const file = files[0];
      var fileIsValid = false;
      if (!['image/png', 'image/jpeg', 'image/jpg'].includes(file.type)) {
        this.alertService.presentToast(
          'Only png, jpeg and jpg images are allowed',
          'error'
        );
      } else if (file.size >= 1_000_000) {
        this.alertService.presentToast(
          "Each image's size must be less than 1 MB",
          'error'
        );
      } else {
        fileIsValid = true;
      }
      if (!fileIsValid) {
        target.value = '';
        return;
      }
    }
  }
  async submit() {
    if (this.userForm.valid) {
      this.dataProvider.pageSetting.blur = true;
      //upload photos
      const userPhoto = document.getElementById(
        'user-photo'
      ) as HTMLInputElement;
      if (userPhoto && userPhoto.files && userPhoto.files.length > 0) {
        await this.databaseService
          .upload('users/' + new Date().getTime(), userPhoto.files[0])
          .then((url) => {
            this.userForm.get('photoURL')!.setValue(url);
          });
      } else {
        this.userForm.value.photoURL = this.userForm.value.photoURL;
      }

      const dob = new Date(this.userForm.get('dob')?.value);
      const user = {
        name: this.userForm.get('name')?.value,
        photoURL: this.userForm.get('photoURL')?.value,
        dob: Timestamp.fromDate(dob),
        email: this.userForm.get('email')?.value,
        phone: this.userForm.get('phone')?.value,
        address: this.userForm.get('address')?.value,
        accountNo: this.userForm.get('accountNo')?.value,
        ifscCode: this.userForm.get('ifscCode')?.value,
        access: 'user',
        created: Timestamp.now(),
        emailVerified: false,
        totalBookings: 0,
        lastBooking: null,
        activeNow: false,
      } as UserData;
      if (this.userToEdit) {
        await this.databaseService.editUser(this.userToEdit.id, user);
        UIkit.modal(document.getElementById('user-modal')).hide();
      } else {
        await this.databaseService.addUser(user);
        UIkit.modal(document.getElementById('user-modal')).hide();
      }
      this.dataProvider.pageSetting.blur = false;
      if (this.userToEdit) {
        this.alertService.presentToast('User edited successfully');
      } else {
        this.alertService.presentToast('User added successfully');
      }
      this.ngOnInit();
    } else {
      this.alertService.presentToast(
        'Please enter all the required fields correctly',
        'error'
      );
    }
  }

  getUsers(event: PageEvent) {
    var currIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    const startIndex = currIndex * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.filteredUsers = this.users;
  }
}
