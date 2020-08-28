import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserArmoryComponent } from './user-armory.component';

describe('UserArmoryComponent', () => {
  let component: UserArmoryComponent;
  let fixture: ComponentFixture<UserArmoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserArmoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserArmoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
