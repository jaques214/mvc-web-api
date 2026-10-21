import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormShowroomsComponent } from './showrooms-form.component';
import { RestService } from '@services/rest.service';
import { of } from 'rxjs';
import { provideRouter } from '@angular/router';
import { routes } from '@app/app.routes';

describe('FormShowroomsComponent', () => {
  let component: FormShowroomsComponent;
  let fixture: ComponentFixture<FormShowroomsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ FormShowroomsComponent ],
      providers: [
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
    fixture = TestBed.createComponent(FormShowroomsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
