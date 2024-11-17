import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PasswordResetConfirmationComponent } from './password-reset-confirmation.component';

const routes: Routes = [{ path: '', component: PasswordResetConfirmationComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PasswordResetConfirmationRoutingModule { }
