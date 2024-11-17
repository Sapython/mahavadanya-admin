import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Timestamp } from '@angular/fire/firestore';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DataProvider } from 'src/app/providers/data.provider';
import { AlertsAndNotificationsService } from 'src/app/services/alerts-and-notifications.service';
import { DatabaseService } from 'src/app/services/database.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  @ViewChild('photoInput') photoInput: ElementRef;
  editMode: boolean = false;

  editForm: FormGroup = new FormGroup({
    photoURL: new FormControl(),
    name: new FormControl('', [Validators.required]),
    phone: new FormControl(),
    dob: new FormControl(),
    address: new FormControl(),
    accountNo: new FormControl(),
    ifscCode: new FormControl(),
  });

  constructor(
    private alertService: AlertsAndNotificationsService,
    public dataProvider: DataProvider,
    private databaseService: DatabaseService
  ) {}

  goToEditMode() {
    if (this.dataProvider.userData) {
      const dobDate = this.dataProvider.userData!.dob?.toDate();
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
        name: this.dataProvider.userData!.name,
        phone: this.dataProvider.userData!.phone,
        dob: dob,
        address: this.dataProvider.userData!.address,
        accountNo: this.dataProvider.userData!.accountNo,
        ifscCode: this.dataProvider.userData!.ifscCode,
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
    var valid = false;

    if (!['image/png', 'image/jpg', 'image/jpeg'].includes(file.type)) {
      this.alertService.presentToast(
        'Your photo should either be in .png or .jpg'
      );
    } else if (file.size > 100_000) {
      this.alertService.presentToast(
        "Your photo's size should not exceed 100KB"
      );
    } else {
      valid = true;
    }

    if (!valid) {
      this.photoInput.nativeElement.value = '';
    }
    return valid;
  }

  async saveChanges() {
    if (this.editForm.valid) {
      this.dataProvider.pageSetting.blur = true;

      const id = this.dataProvider.userData?.id;
      if (id) {
        // Upload photo, if it exists
        if (
          this.photoInput.nativeElement.files.length == 1 &&
          this.validateProfilePhoto()
        ) {
          await this.databaseService
            .upload('users/' + id, this.photoInput.nativeElement.files[0])
            .then((url) => {
              this.dataProvider.userData!.photoURL = url;
            });
        }

        // Update user data
        this.dataProvider.userData!.name = this.editForm.get('name')?.value;
        this.dataProvider.userData!.phone = this.editForm.get('phone')?.value;
        const dob = this.editForm.get('dob')?.value;
        if (dob) {
          this.dataProvider.userData!.dob = Timestamp.fromDate(new Date(dob));
        }
        this.dataProvider.userData!.address =
          this.editForm.get('address')?.value;
        this.dataProvider.userData!.accountNo =
          this.editForm.get('accountNo')?.value;
        this.dataProvider.userData!.ifscCode =
          this.editForm.get('ifscCode')?.value;

        // Send updated data to database
        await this.databaseService.editUser(id, this.dataProvider.userData!);

        this.editMode = false;
        this.alertService.presentToast('Profile updated successfully');
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

  cancelEdit() {
    this.editMode = false;
  }

  ngOnInit(): void {}
}
