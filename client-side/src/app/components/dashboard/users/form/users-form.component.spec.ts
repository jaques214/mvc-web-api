import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormUsersComponent } from './users-form.component';
import { RestService } from '@services/rest.service';
import { of } from 'rxjs';
import { provideRouter } from '@angular/router';
import { routes } from '@app/app.routes';

describe('FormUsersComponent', () => {
  let component: FormUsersComponent;
  let fixture: ComponentFixture<FormUsersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ FormUsersComponent ],
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
    fixture = TestBed.createComponent(FormUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
