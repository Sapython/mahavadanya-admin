import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CheckYourMailComponent } from './check-your-mail.component';

const routes: Routes = [{ path: '', component: CheckYourMailComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CheckYourMailRoutingModule { }
