import { Injectable } from '@angular/core';
import { User } from '@angular/fire/auth';
import {
  Firestore,
  DocumentReference,
  CollectionReference,
  collection,
  setDoc,
  doc,
  Timestamp,
} from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { DataProvider } from '../providers/data.provider';
import {
  ExtraLoginEmailInfo,
  ExtraLoginGoogleInfo,
} from '../structures/method.structure';
import { UserData } from '../structures/user.structure';
import { AlertsAndNotificationsService } from './alerts-and-notifications.service';

@Injectable({
  providedIn: 'root',
})
export class UserDataService {
  usersDoc: CollectionReference;
  userDoc: DocumentReference | undefined;
  constructor(
    private firestore: Firestore,
    private router: Router,
    private alertify: AlertsAndNotificationsService,
    private dataProvider: DataProvider
  ) {
    this.usersDoc = collection(this.firestore, 'users');
  }
  public async setGoogleUserData(user: User, userData: ExtraLoginGoogleInfo) {
    this.dataProvider.pageSetting.blur = true;
    this.dataProvider.pageSetting.lastRedirect = '';
    let data: UserData = {
      id: user.uid,
      access: 'admin',
      created: Timestamp.now(),
      name: user.displayName || '',
      email: user.email || '',
      emailVerified: true,
      phone: userData.phoneNumber,
      photoURL: user.photoURL || this.getRandomImage(),
    };
    this.userDoc = doc(this.firestore, 'users/' + user.uid);
    await setDoc(this.userDoc, data).then(() => {
      this.alertify.presentToast('Signed in successfully');
    });
    this.dataProvider.pageSetting.blur = false;
    this.router.navigate(['admin']);
  }
  public async setEmailUserData(user: User, userData: ExtraLoginEmailInfo) {
    this.dataProvider.pageSetting.blur = true;
    this.dataProvider.pageSetting.lastRedirect = '';
    let data: UserData = {
      id: user.uid,
      access: 'admin',
      created: Timestamp.now(),
      name: user.displayName || '',
      email: user.email || '',
      emailVerified: true,
      phone: userData.phoneNumber,
      photoURL: user.photoURL || this.getRandomImage(),
    };
    this.userDoc = doc(this.firestore, 'users/' + user.uid);
    await setDoc(this.userDoc, data).then(() => {
      this.alertify.presentToast('Signed in successfully');
    });
    this.dataProvider.pageSetting.blur = false;
    this.router.navigate(['admin']);
  }
  getRandomImage(): string {
    return (
      'https://avatars.dicebear.com/api/gridy/' +
      (Math.random().toString(36).substring(2, 15) +
        Math.random().toString(36).substring(2, 15)) +
      '.svg'
    );
  }
}
