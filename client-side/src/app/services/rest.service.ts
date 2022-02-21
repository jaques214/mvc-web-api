import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Collection } from '@models/collection';
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
  private wrapper = new Collection();
  private endpoint = `${API_ENDPOINT}/api`;
  constructor(private http: HttpClient) {}

  getCollection<Type>(collection: string, id: string): Observable<Type> {
    const url = `${this.endpoint}/${this.wrapper.collection(collection)}/${id}`;
    return this.http.get<Type>(url);
  }

  getAllCollections<Type>(collection: string): Observable<Type[]> {
    const url = `${this.endpoint}/${this.wrapper.collection(collection)}`;
    return this.http.get<Type[]>(url);
  }

  deleteCollection<Type>(collection: string, id: any): Observable<Type> {
    const url = `${this.endpoint}/${this.wrapper.collection(collection)}/${id}`;
    return this.http.delete<Type>(url);
  }

  updateCollection<Type>(
    collection: string,
    id: any,
    data: Object,
    hasFile: boolean = false
  ): Observable<Type> {
    const url = `${this.endpoint}/${this.wrapper.collection(collection)}/${id}`;
    const payload = hasFile ? this.buildFormData(data) : JSON.stringify(data);
    return this.http.put<Type>(url, payload, hasFile ? {} : httpOptions);
  }

  addCollection<Type>(
    collection: string,
    data: Object,
    hasFile: boolean = false
  ): Observable<Type> {
    const url = `${this.endpoint}/${this.wrapper.collection(collection)}`;
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
