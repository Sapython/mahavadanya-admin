import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SlotSheetRoutingModule } from './slot-sheet-routing.module';
import { SlotSheetComponent } from './slot-sheet.component';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';


@NgModule({
  declarations: [
    SlotSheetComponent
  ],
  imports: [
    CommonModule,
    SlotSheetRoutingModule,
    MatTableModule,
    MatIconModule,
    MatPaginatorModule,
    MatSortModule,
    MatInputModule

  ]
})
export class SlotSheetModule { }
