import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassesAndRolesComponent } from './classes-and-roles.component';

describe('ClassesAndRolesComponent', () => {
  let component: ClassesAndRolesComponent;
  let fixture: ComponentFixture<ClassesAndRolesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClassesAndRolesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClassesAndRolesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
