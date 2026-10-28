import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { OpenMeteoService, type WeatherData } from '@services/open-meteo.service';
import type { EventViewTable } from '../dashboard/events/list/events-list.component';

import { WeatherWidgetComponent } from './weather-widget.component';

describe('WeatherWidgetComponent', () => {
  let component: WeatherWidgetComponent;
  let fixture: ComponentFixture<WeatherWidgetComponent>;
  let weatherService: jasmine.SpyObj<OpenMeteoService>;
  const event: EventViewTable = {
    _id: 'event-1',
    title: 'Test event',
    arena: '',
    availability: 0,
    occupation: 0,
    price: 0,
    description: '',
    promoter: '',
    minimumAge: 0,
    salesStartDate: new Date(),
    salesEndDate: new Date(),
    email: '',
    tel: '',
    sessions: [
      {
        _id: 'session-1',
        date: '2025-01-01',
        startTime: '2025-01-01T10:00:00',
        endTime: '2025-01-01T11:00:00',
      },
      {
        _id: 'session-2',
        date: '2025-01-02',
        startTime: '2025-01-02T11:00:00',
        endTime: '2025-01-02T12:00:00',
      },
    ],
  };
  const weather: WeatherData = {
    hourly: {
      time: [],
      temperature_2m: { '10': 20, '11': 21 },
      weather_code: { '10': 0, '11': 1 },
    },
  };

  beforeEach(async () => {
    weatherService = jasmine.createSpyObj<OpenMeteoService>(
      'OpenMeteoService',
      ['getEventWeatherDetails'],
    );
    weatherService.getEventWeatherDetails.and.returnValue(of(weather));

    await TestBed.configureTestingModule({
      imports: [WeatherWidgetComponent],
      providers: [{ provide: OpenMeteoService, useValue: weatherService }],
    })
    .compileComponents();

    fixture = TestBed.createComponent(WeatherWidgetComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('event', event);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('loads weather when the selected session changes', () => {
    fixture.componentRef.setInput('selectedSessionID', 'session-1');
    fixture.detectChanges();

    expect(weatherService.getEventWeatherDetails).toHaveBeenCalledOnceWith(
      'event-1',
      'session-1',
    );

    fixture.componentRef.setInput('selectedSessionID', 'session-2');
    fixture.detectChanges();

    expect(weatherService.getEventWeatherDetails).toHaveBeenCalledWith(
      'event-1',
      'session-2',
    );
    expect(weatherService.getEventWeatherDetails).toHaveBeenCalledTimes(2);
    expect(component.weatherDetails?.temperature).toBe(21);
  });
});
