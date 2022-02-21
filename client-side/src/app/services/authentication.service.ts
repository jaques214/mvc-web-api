import { User } from '@models/users';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_ENDPOINT } from '@shared/index'

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<User> {
    return this.http.post<User>(`${API_ENDPOINT}/api/auth/login`, JSON.stringify({ username, password }), httpOptions);
  }

  logout(): Observable<void> {
    return this.http.get<void>(`${API_ENDPOINT}/api/auth/logout`);
  }

  register(username: string, password: string): Observable<User> {
    return this.http.post<User>(`${API_ENDPOINT}/api/auth/register`, JSON.stringify({ username, password}), httpOptions);
  }
}
