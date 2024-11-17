import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
declare const UIkit: any;
@Component({
  selector: 'app-confirm-delete-modal',
  templateUrl: './confirm-delete-modal.component.html',
  styleUrls: ['./confirm-delete-modal.component.scss'],
})
export class ConfirmDeleteModalComponent implements OnInit {
  @Input() text: string = 'Are you sure you want to delete this?';
  @Output() confirm: EventEmitter<any> = new EventEmitter<any>();
  @Output() hidden: EventEmitter<any> = new EventEmitter<any>();

  constructor() {}

  btnClick(confirm: boolean) {
    if (confirm) {
      this.confirm.emit();
    }
    UIkit.modal(document.getElementById('delete-confirm-modal')).hide();
  }

  ngOnInit(): void {}
}
