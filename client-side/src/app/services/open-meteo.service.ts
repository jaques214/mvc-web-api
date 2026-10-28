import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_ENDPOINT } from '@shared/index'

export type WeatherData = {
  hourly: {
    time: string[];
    temperature_2m: Record<string, number>;
    weather_code: Record<string, number>;
  };
};

@Injectable({
  providedIn: 'root',
})
export class OpenMeteoService {
  private endpoint = `${API_ENDPOINT}/api`;
  constructor(private http: HttpClient) { }

  getEventWeatherDetails(
    eventId: string,
    sessionId: string,
  ): Observable<WeatherData> {
    return this.http.get<WeatherData>(
      `${this.endpoint}/events/${eventId}/sessions/${sessionId}/weather`,
    );
  }
}
