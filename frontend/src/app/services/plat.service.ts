import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Plat, PlatCompteur } from '../models/plat.model';

@Injectable({
  providedIn: 'root'
})
export class PlatService {
  private apiUrl = 'http://localhost:8000/api/plats';

  constructor(private http: HttpClient) {}

  getPlats(disponibility?: boolean, search?: string): Observable<Plat[]> {
    let params = new HttpParams();
    if (disponibility !== undefined) {
      params = params.set('disponibility', disponibility.toString());
    }
    if (search) {
      params = params.set('search', search);
    }
    return this.http.get<Plat[]>(`${this.apiUrl}/`, { params });
  }

  getPlatById(id: string): Observable<Plat> {
    return this.http.get<Plat>(`${this.apiUrl}/${id}/`);
  }

  getCompteurs(): Observable<PlatCompteur[]> {
    return this.http.get<PlatCompteur[]>(`${this.apiUrl}/compteurs/`);
  }

  createPlat(formData: FormData): Observable<Plat> {
    return this.http.post<Plat>(`${this.apiUrl}/`, formData);
  }

  updatePlat(id: string, formData: FormData): Observable<Plat> {
    return this.http.patch<Plat>(`${this.apiUrl}/${id}/`, formData);
  }

  deletePlat(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}/`);
  }
}
