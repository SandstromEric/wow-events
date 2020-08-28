import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogEventCreateComponent } from './dialog-event-create.component';

describe('DialogEventCreateComponent', () => {
  let component: DialogEventCreateComponent;
  let fixture: ComponentFixture<DialogEventCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogEventCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogEventCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
