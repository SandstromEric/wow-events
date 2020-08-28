import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogCreateBookingComponent } from './dialog-create-booking.component';

describe('DialogCreateBookingComponent', () => {
  let component: DialogCreateBookingComponent;
  let fixture: ComponentFixture<DialogCreateBookingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogCreateBookingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogCreateBookingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
