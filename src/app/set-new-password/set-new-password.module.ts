import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SetNewPasswordRoutingModule } from './set-new-password-routing.module';
import { SetNewPasswordComponent } from './set-new-password.component';


@NgModule({
  declarations: [
    SetNewPasswordComponent
  ],
  imports: [
    CommonModule,
    SetNewPasswordRoutingModule
  ]
})
export class SetNewPasswordModule { }
