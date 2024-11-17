import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PasswordResetConfirmationRoutingModule } from './password-reset-confirmation-routing.module';
import { PasswordResetConfirmationComponent } from './password-reset-confirmation.component';


@NgModule({
  declarations: [
    PasswordResetConfirmationComponent
  ],
  imports: [
    CommonModule,
    PasswordResetConfirmationRoutingModule
  ]
})
export class PasswordResetConfirmationModule { }
