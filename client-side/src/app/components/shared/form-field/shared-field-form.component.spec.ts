import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedFieldFormComponent } from './shared-field-form.component';

describe('EventsDateFormComponent', () => {
  let component: SharedFieldFormComponent;
  let fixture: ComponentFixture<SharedFieldFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SharedFieldFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SharedFieldFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
