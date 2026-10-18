import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormShowroomsComponent } from './showrooms-form.component';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { routes } from '@app/app.routes';

describe('FormShowroomsComponent', () => {
  let component: FormShowroomsComponent;
  let fixture: ComponentFixture<FormShowroomsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ FormShowroomsComponent ],
      providers: [provideHttpClient(withInterceptorsFromDi()), provideRouter(routes)]
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
