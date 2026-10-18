import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormUsersComponent } from './users-form.component';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { routes } from '@app/app.routes';

describe('FormUsersComponent', () => {
  let component: FormUsersComponent;
  let fixture: ComponentFixture<FormUsersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ FormUsersComponent ],
      providers: [provideHttpClient(withInterceptorsFromDi()), provideRouter(routes)]
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
