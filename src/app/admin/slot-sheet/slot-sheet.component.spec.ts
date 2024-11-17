import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SlotSheetComponent } from './slot-sheet.component';

describe('SlotSheetComponent', () => {
  let component: SlotSheetComponent;
  let fixture: ComponentFixture<SlotSheetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SlotSheetComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SlotSheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
