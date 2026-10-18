import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup } from '@angular/forms';

import { SharedTimeFormComponent } from './shared-time-form.component';

describe('SharedTimeFormComponent', () => {
  let component: SharedTimeFormComponent;
  let fixture: ComponentFixture<SharedTimeFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ SharedTimeFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SharedTimeFormComponent);
    component = fixture.componentInstance;
    component.timeFields = {
      label: 'Time',
      name: 'time',
      type: 'time',
      placeholder: 'Choose a time',
      inputs: [],
    };
    component.form = new FormGroup({
      time: new FormControl(''),
    });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
