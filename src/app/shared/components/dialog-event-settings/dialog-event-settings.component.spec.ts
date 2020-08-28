import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogEventSettingsComponent } from './dialog-event-settings.component';

describe('DialogEventSettingsComponent', () => {
  let component: DialogEventSettingsComponent;
  let fixture: ComponentFixture<DialogEventSettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogEventSettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogEventSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
