import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup } from '@angular/forms';
import { provideNativeDateAdapter } from '@angular/material/core';

import { SharedDateFormComponent } from './shared-date-form.component';

describe('SharedDateFormComponent', () => {
  let component: SharedDateFormComponent;
  let fixture: ComponentFixture<SharedDateFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SharedDateFormComponent],
      providers: [provideNativeDateAdapter()]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SharedDateFormComponent);
    component = fixture.componentInstance;
    component.dateFields = {
      label: 'Date',
      name: 'date',
    };
    component.form = new FormGroup({
      date: new FormControl(''),
    });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
