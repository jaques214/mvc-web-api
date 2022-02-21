import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedTimeFormComponent } from './shared-time-form.component';

describe('EventsTimeFormComponent', () => {
  let component: SharedTimeFormComponent;
  let fixture: ComponentFixture<SharedTimeFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SharedTimeFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SharedTimeFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
