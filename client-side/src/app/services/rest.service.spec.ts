import { TestBed } from '@angular/core/testing';

import { RestService } from './rest.service';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { API_ENDPOINT } from '@shared/index';

describe('RestService', () => {
  let service: RestService;
  let httpTestingController: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
      ],
    });
    service = TestBed.inject(RestService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('preserves uploaded files and serializes structured form fields', () => {
    const covidTest = new File(['negative'], 'covid-test.txt', {
      type: 'text/plain',
    });

    service
      .addCollection(
        'Ticket',
        {
          eventId: 'event-id',
          sessionId: 'session-id',
          covidTest,
        },
        true,
      )
      .subscribe();

    const request = httpTestingController.expectOne(
      `${API_ENDPOINT}/api/tickets`,
    );
    expect(request.request.body instanceof FormData).toBeTrue();

    const formData = request.request.body as FormData;
    expect((formData.get('covidTest') as File).name).toBe('covid-test.txt');
    expect(formData.get('eventId')).toBe('event-id');
    expect(formData.get('sessionId')).toBe('session-id');
    request.flush({});
  });

  afterEach(() => httpTestingController.verify());
});
