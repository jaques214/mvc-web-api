import { Component, Input, OnChanges, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { WMO_WEATHER_CODES } from 'src/app/shared';
import { EventViewTable } from '../dashboard/events/list/events-list.component';
import {
  OpenMeteoService,
  type WeatherData,
} from '@services/open-meteo.service';

type WeatherUIData = {
  location: string;
  temperature: string;
  description: string;
  date: string;
  icon: string;
};

const suffixMap: Record<string, string> = { one: 'st', two: 'nd', few: 'rd', other: 'th' };
const pluralRule = new Intl.PluralRules('en-GB', { type: 'ordinal' });

const ordinalDay = (n: number): string => `${n}${suffixMap[pluralRule.select(n)]}`;

const monthFmt = new Intl.DateTimeFormat('en-GB', { month: 'short' });

const formatDate = (date: Date) => `${ordinalDay(date.getDate())} ${monthFmt.format(date)}`;

@Component({
  selector: 'app-weather-widget',
  imports: [],
  templateUrl: './weather-widget.component.html',
  styleUrl: './weather-widget.component.css',
})
export class WeatherWidgetComponent implements OnChanges, OnDestroy {
  @Input({ required: true }) event: EventViewTable | null = null;
  @Input() selectedSessionID?: string = '';
  weatherDetails: WeatherUIData | null = null;
  private weatherSubscription?: Subscription;

  constructor(private weatherService: OpenMeteoService) {}

  getEventWeatherDetails(
    eventId: string,
    sessionId: string,
  ): Observable<WeatherData> {
    return this.weatherService.getEventWeatherDetails(eventId, sessionId);
  }

  ngOnChanges(): void {
    this.weatherSubscription?.unsubscribe();
    this.weatherDetails = null;

    if (!this.event || !this.selectedSessionID) return;
    const session = this.event.sessions.find(
      (session) => session._id === this.selectedSessionID,
    );
    if (!session) return;

    this.weatherSubscription = this.getEventWeatherDetails(
      this.event._id,
      this.selectedSessionID,
    ).subscribe({
      next: (weather) => {
        const hour = session.startTime.split(':')[0];
        const time = +hour >= 7 && +hour <= 22 ? 'day' : 'night';

        this.weatherDetails = {
          location: `${this.event?.address?.street}, ${this.event?.address?.country}`,
          temperature: weather.hourly.temperature_2m[hour].toFixed(0),
          description:
            WMO_WEATHER_CODES[weather.hourly.weather_code[hour]?.toString()]
              .condition ?? '',
          date: formatDate(new Date(session.date)),
          icon:
            time +
            '-' +
            WMO_WEATHER_CODES[weather.hourly.weather_code[hour]?.toString()]
              .icon,
        };
      },
      error: (error) => {
        console.error('Error loading event weather:', error);
      },
    });
  }

  ngOnDestroy(): void {
    this.weatherSubscription?.unsubscribe();
  }
}
