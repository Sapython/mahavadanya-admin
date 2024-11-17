import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Component, OnInit, Input, ViewChild, AfterViewInit } from '@angular/core';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-slot-sheet',
  templateUrl: './slot-sheet.component.html',
  styleUrls: ['./slot-sheet.component.scss']
})
export class SlotSheetComponent implements OnInit {

  displayedColumns = [
    'Name',
    'Details',
    'Date',
    'Block A-21',
    'Block A-22',
    'Block A-23',
    'Block B-24',
    'Block B-25',
    'Block B-26',
    'Block C-27',
    'Block C-28',
    'Block C-29',

  ];


  trData = [
    { name: 'Rohan', mobile: `Username:rohan \nEmail:koushik@gmail.com \nGender:Male`, date: '5-july-2022', BlockA21: '22 <- 21', BlockA22: '21 -> 22', BlockA23: '23', BlockB24: '24', BlockB25: '25', BlockB26: '26', BlockC27: '27', BlockC28: '28', BlockC29: '29' },
    { name: 'Naveen', mobile: `Username:rohan \nEmail:koushik@gmail.com \nGender:Male`, date: '5-july-2022', BlockA21: '21', BlockA22: '22', BlockA23: '23', BlockB24: '24', BlockB25: '25', BlockB26: '26', BlockC27: '27', BlockC28: '28', BlockC29: '29' },
    { name: 'Guru', mobile: `Username:rohan \nEmail:koushik@gmail.com \nGender:Male`, date: '5-july-2022', BlockA21: '21', BlockA22: '22', BlockA23: '23', BlockB24: '24', BlockB25: '25', BlockB26: '26', BlockC27: '27', BlockC28: '28', BlockC29: '29' },
    { name: 'Saptm', mobile: `Username:rohan \nEmail:koushik@gmail.com \nGender:Male`, date: '5-july-2022', BlockA21: '21', BlockA22: '22', BlockA23: '23', BlockB24: '24', BlockB25: '25', BlockB26: '26', BlockC27: '27', BlockC28: '28', BlockC29: '29' },
    { name: 'Ravi', mobile: `Username:rohan \nEmail:koushik@gmail.com \nGender:Male`, date: '5-july-2022', BlockA21: '21', BlockA22: '22', BlockA23: '23', BlockB24: '24', BlockB25: '25', BlockB26: '26', BlockC27: '27', BlockC28: '28', BlockC29: '29' },
    { name: 'Mohan', mobile: `Username:rohan \nEmail:koushik@gmail.com \nGender:Male`, date: '5-july-2022', BlockA21: '21', BlockA22: '22', BlockA23: '23', BlockB24: '24', BlockB25: '25', BlockB26: '26', BlockC27: '27', BlockC28: '28', BlockC29: '29' },
    { name: 'Sohan', mobile: `Username:rohan \nEmail:koushik@gmail.com \nGender:Male`, date: '5-july-2022', BlockA21: '21', BlockA22: '22', BlockA23: '23', BlockB24: '24', BlockB25: '25', BlockB26: '26', BlockC27: '27', BlockC28: '28', BlockC29: '29' },
    { name: 'Kohan', mobile: `Username:rohan \nEmail:koushik@gmail.com \nGender:Male`, date: '5-july-2022', BlockA21: '21', BlockA22: '22', BlockA23: '23', BlockB24: '24', BlockB25: '25', BlockB26: '26', BlockC27: '27', BlockC28: '28', BlockC29: '29' },
    { name: 'Tohan', mobile: `Username:rohan \nEmail:koushik@gmail.com \nGender:Male`, date: '5-july-2022', BlockA21: '21', BlockA22: '22', BlockA23: '23', BlockB24: '24', BlockB25: '25', BlockB26: '26', BlockC27: '27', BlockC28: '28', BlockC29: '29' },
    { name: 'Nonan', mobile: `Username:rohan \nEmail:koushik@gmail.com \nGender:Male`, date: '5-july-2022', BlockA21: '21', BlockA22: '22', BlockA23: '23', BlockB24: '24', BlockB25: '25', BlockB26: '26', BlockC27: '27', BlockC28: '28', BlockC29: '29' },

  ];


  ELEMENT_DATA: PeriodicElement[] = [
    { name: 'Rohan', mobile: 1212435223231, date: '5-july-2022', BlockA21: 'true', BlockA22: 'true', BlockA23: 'true', BlockB24: 'true', BlockB25: 'true', BlockB26: 'true', BlockC27: 'true', BlockC28: 'true', BlockC29: 'true' },
    { name: 'Naveen', mobile: 1212435223232, date: '5-july-2022', BlockA21: 'true', BlockA22: 'true', BlockA23: 'true', BlockB24: 'true', BlockB25: 'true', BlockB26: 'true', BlockC27: 'true', BlockC28: 'true', BlockC29: 'true' },
    { name: 'Guru', mobile: 1212435223233, date: '5-july-2022', BlockA21: 'true', BlockA22: 'true', BlockA23: 'true', BlockB24: 'true', BlockB25: 'true', BlockB26: 'true', BlockC27: 'true', BlockC28: 'true', BlockC29: 'true' },
    { name: 'Saptm', mobile: 1212435223234, date: '5-july-2022', BlockA21: 'true', BlockA22: 'true', BlockA23: 'true', BlockB24: 'true', BlockB25: 'true', BlockB26: 'true', BlockC27: 'true', BlockC28: 'true', BlockC29: 'true' },
    { name: 'Ravi', mobile: 1212435223235, date: '5-july-2022', BlockA21: 'true', BlockA22: 'true', BlockA23: 'true', BlockB24: 'true', BlockB25: 'true', BlockB26: 'true', BlockC27: 'true', BlockC28: 'true', BlockC29: 'true' },
    { name: 'Mohan', mobile: 1212435223236, date: '5-july-2022', BlockA21: 'true', BlockA22: 'true', BlockA23: 'true', BlockB24: 'true', BlockB25: 'true', BlockB26: 'true', BlockC27: 'true', BlockC28: 'true', BlockC29: 'true' },
    { name: 'Sohan', mobile: 1212435223237, date: '5-july-2022', BlockA21: 'true', BlockA22: 'true', BlockA23: 'true', BlockB24: 'true', BlockB25: 'true', BlockB26: 'true', BlockC27: 'true', BlockC28: 'true', BlockC29: 'true' },
    { name: 'Kohan', mobile: 1212435223238, date: '5-july-2022', BlockA21: 'true', BlockA22: 'true', BlockA23: 'true', BlockB24: 'true', BlockB25: 'true', BlockB26: 'true', BlockC27: 'true', BlockC28: 'true', BlockC29: 'true' },
    { name: 'Tohan', mobile: 1212435223239, date: '5-july-2022', BlockA21: 'true', BlockA22: 'true', BlockA23: 'true', BlockB24: 'true', BlockB25: 'true', BlockB26: 'true', BlockC27: 'true', BlockC28: 'true', BlockC29: 'true' },
    { name: 'Nonan', mobile: 12124352232310, date: '5-july-2022', BlockA21: 'true', BlockA22: 'true', BlockA23: 'true', BlockB24: 'true', BlockB25: 'true', BlockB26: 'true', BlockC27: 'true', BlockC28: 'true', BlockC29: 'true' },
  ];

  dataSource = new MatTableDataSource(this.ELEMENT_DATA);

  constructor() { }



  /** Announce the change in sort state for assistive technology. */



  ngOnInit(): void {
  }



}


export interface PeriodicElement {
  name: string;
  mobile: number;
  date: string;
  BlockA21: string;
  BlockA22: string;
  BlockA23: string;
  BlockB24: string;
  BlockB25: string;
  BlockB26: string;
  BlockC27: string;
  BlockC28: string;
  BlockC29: string;

}

