import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import type { Schema } from '@models/index';
import { API_ENDPOINT } from '@shared/index'

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  }),
};

@Injectable({
  providedIn: 'root',
})
export class RestService {
  private endpoint = `${API_ENDPOINT}/api`;
  constructor(private http: HttpClient) { }

  collection(schema: Schema) {
    switch (schema) {
      case 'User':
        return 'users';
      case 'Agent':
        return 'agents';
      case 'Event':
        return 'events';
      case 'Showroom':
        return 'showrooms';
      case 'Ticket':
        return 'tickets';
      default:
        return 'users';
    }
  }

  getCollection<Type>(collection: Schema, id: string): Observable<Type> {
    const url = `${this.endpoint}/${this.collection(collection)}/${id}`;
    return this.http.get<Type>(url);
  }

  getAllCollections<Type>(collection: Schema): Observable<Type[]> {
    const url = `${this.endpoint}/${this.collection(collection)}`;
    return this.http.get<Type[]>(url);
  }

  deleteCollection<Type>(collection: Schema, id: string): Observable<Type> {
    const url = `${this.endpoint}/${this.collection(collection)}/${id}`;
    return this.http.delete<Type>(url);
  }

  updateCollection<Type>(
    collection: Schema,
    id: string,
    data: Object,
    hasFile: boolean = false
  ): Observable<Type> {
    const url = `${this.endpoint}/${this.collection(collection)}/${id}`;
    const payload = hasFile ? this.buildFormData(data) : JSON.stringify(data);
    return this.http.put<Type>(url, payload, hasFile ? {} : httpOptions);
  }

  addCollection<Type>(
    collection: Schema,
    data: Object,
    hasFile: boolean = false
  ): Observable<Type> {
    const url = `${this.endpoint}/${this.collection(collection)}`;
    const payload = hasFile ? this.buildFormData(data) : JSON.stringify(data);
    return this.http.post<Type>(url, payload, hasFile ? {} : httpOptions);
  }

  private buildFormData(data: Object): FormData {
    const form = new FormData();
    for (const key of Object.keys(data)) {
      const field = (data as any)[key];
      form.append(key, typeof field == 'object' ? JSON.stringify(field) : field);
    }
    return form;
  }
}
