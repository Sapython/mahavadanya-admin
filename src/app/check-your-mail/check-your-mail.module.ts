import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CheckYourMailRoutingModule } from './check-your-mail-routing.module';
import { CheckYourMailComponent } from './check-your-mail.component';


@NgModule({
  declarations: [
    CheckYourMailComponent
  ],
  imports: [
    CommonModule,
    CheckYourMailRoutingModule
  ]
})
export class CheckYourMailModule { }
