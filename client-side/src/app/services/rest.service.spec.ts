import { TestBed } from '@angular/core/testing';

import { RestService } from './rest.service';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('RestService', () => {
  let service: RestService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [provideHttpClient(withInterceptorsFromDi())]
    });
    service = TestBed.inject(RestService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
