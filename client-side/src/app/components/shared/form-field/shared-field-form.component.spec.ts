import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup } from '@angular/forms';

import { SharedFieldFormComponent } from './shared-field-form.component';

describe('SharedFieldFormComponent', () => {
  let component: SharedFieldFormComponent;
  let fixture: ComponentFixture<SharedFieldFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ SharedFieldFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SharedFieldFormComponent);
    component = fixture.componentInstance;
    component.input = {
      label: 'Name',
      name: 'name',
      type: 'text',
    };
    component.form = new FormGroup({
      name: new FormControl(''),
    });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
