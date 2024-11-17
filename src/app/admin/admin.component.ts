import { Component, OnInit } from '@angular/core';
import { DataProvider } from '../providers/data.provider';
import { DatabaseService } from '../services/database.service';
import { Notification } from '../structures/adminNotification.structure';
declare const UIkit: any;

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
})
export class AdminComponent implements OnInit {
  notificationIcon: 'regular' | 'solid' = 'regular';
  notifications: Notification[];
  constructor(public dataProvider: DataProvider,public databaseService:DatabaseService) {}

  ngOnInit(): void {
    const notificationDropdown = document.getElementById(
      'notification-dropdown'
    );
    notificationDropdown?.addEventListener(
      'beforeshow',
      () => {
        this.notificationIcon = 'solid';
      },
      false
    );
    notificationDropdown?.addEventListener(
      'hidden',
      () => {
        this.notificationIcon = 'regular';
      },
      false
    );
   this.databaseService.getAllNotification().then((docs)=>{
    this.notifications=[];
      docs.forEach((doc)=>{
        this.notifications.push(doc.data() as Notification);
       
      }
      )
  
  })
  }
  closeModal() {
    const modal = document.getElementById('notification-modal');
    UIkit.modal(modal).hide();
  
  
  }
}
