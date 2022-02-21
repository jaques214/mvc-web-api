import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormShowroomsComponent } from './showrooms-form.component';

describe('FormShowroomsComponent', () => {
  let component: FormShowroomsComponent;
  let fixture: ComponentFixture<FormShowroomsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormShowroomsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormShowroomsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
