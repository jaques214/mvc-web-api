import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { API_ENDPOINT } from '@shared/index';
import { JwtInterceptorService } from './jwt-interceptor.service';
import { OpenMeteoService } from './open-meteo.service';

describe('OpenMeteoService', () => {
  let service: OpenMeteoService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    localStorage.setItem(
      'currentUser',
      JSON.stringify({ token: 'weather-test-token' }),
    );

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
        {
          provide: HTTP_INTERCEPTORS,
          useClass: JwtInterceptorService,
          multi: true,
        },
      ],
    });

    service = TestBed.inject(OpenMeteoService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
    localStorage.removeItem('currentUser');
  });

  it('sends the JWT when requesting event weather', () => {
    service.getEventWeatherDetails('event-id', 'session-id').subscribe();

    const request = httpTestingController.expectOne(
      `${API_ENDPOINT}/api/events/event-id/sessions/session-id/weather`,
    );
    expect(request.request.headers.get('x-access-token')).toBe(
      'weather-test-token',
    );
    request.flush({ hourly: {} });
  });
});
