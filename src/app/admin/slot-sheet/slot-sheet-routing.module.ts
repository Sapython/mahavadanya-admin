import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SlotSheetComponent } from './slot-sheet.component';

const routes: Routes = [{ path: '', component: SlotSheetComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SlotSheetRoutingModule { }
