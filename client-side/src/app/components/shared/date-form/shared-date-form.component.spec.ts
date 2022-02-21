import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedDateFormComponent } from './shared-date-form.component';

describe('SharedDateFormComponent', () => {
  let component: SharedDateFormComponent;
  let fixture: ComponentFixture<SharedDateFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SharedDateFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SharedDateFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
