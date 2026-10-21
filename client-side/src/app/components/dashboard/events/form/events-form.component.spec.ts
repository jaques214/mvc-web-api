import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormEventsComponent } from './events-form.component';
import { RestService } from '@services/rest.service';
import { of } from 'rxjs';
import { provideRouter } from '@angular/router';
import { routes } from '@app/app.routes';
import { provideNativeDateAdapter } from '@angular/material/core';

describe('FormEventsComponent', () => {
  let component: FormEventsComponent;
  let fixture: ComponentFixture<FormEventsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ FormEventsComponent ],
      providers: [
        provideNativeDateAdapter(),
        {
          provide: RestService,
          useValue: {
            getCollection: () => of({}),
          },
        },
        provideRouter(routes),
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormEventsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
