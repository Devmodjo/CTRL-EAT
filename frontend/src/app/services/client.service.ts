import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ClientProfile } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  private apiUrl = 'http://localhost:8000/api/clients';

  constructor(private http: HttpClient) {}

  getClients(): Observable<ClientProfile[]> {
    return this.http.get<ClientProfile[]>(`${this.apiUrl}/`);
  }

  getClientById(id: string): Observable<ClientProfile> {
    return this.http.get<ClientProfile>(`${this.apiUrl}/${id}/`);
  }

  updateClient(id: string, data: Partial<ClientProfile>): Observable<ClientProfile> {
    return this.http.patch<ClientProfile>(`${this.apiUrl}/${id}/`, data);
  }

  deleteClient(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}/`);
  }
}
