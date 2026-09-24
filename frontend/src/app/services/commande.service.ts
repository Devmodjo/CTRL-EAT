import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Commande, CommandeStatus, CuisiniereRecapResponse } from '../models/commande.model';

@Injectable({
  providedIn: 'root'
})
export class CommandeService {
  private apiUrl = 'http://localhost:8000/api';

  constructor(private http: HttpClient) {}

  createCommande(payload: { items_input: { plat_id: string; quantity: number }[]; client_id?: string; notes?: string }): Observable<Commande> {
    return this.http.post<Commande>(`${this.apiUrl}/commande/`, payload);
  }

  getCommandes(clientId?: string, status?: CommandeStatus, dateLivraison?: string): Observable<Commande[]> {
    let params = new HttpParams();
    if (clientId) params = params.set('client_id', clientId);
    if (status) params = params.set('status', status);
    if (dateLivraison) params = params.set('date_livraison', dateLivraison);

    return this.http.get<Commande[]>(`${this.apiUrl}/commande/`, { params });
  }

  getCommandeById(id: string): Observable<Commande> {
    return this.http.get<Commande>(`${this.apiUrl}/commande/${id}/`);
  }

  uploadPaymentProof(commandeId: string, file: File): Observable<{ message: string; commande: Commande }> {
    const formData = new FormData();
    formData.append('payment_proof', file);
    return this.http.post<{ message: string; commande: Commande }>(
      `${this.apiUrl}/commande/${commandeId}/upload-preuve/`,
      formData
    );
  }

  validerPaiement(commandeId: string): Observable<{ message: string; commande: Commande }> {
    return this.http.post<{ message: string; commande: Commande }>(
      `${this.apiUrl}/commande/${commandeId}/valider-paiement/`,
      {}
    );
  }

  updateCommandeStatus(commandeId: string, status: CommandeStatus): Observable<Commande> {
    return this.http.patch<Commande>(`${this.apiUrl}/commande/${commandeId}/`, { status });
  }

  getCuisiniereRecap(): Observable<CuisiniereRecapResponse> {
    return this.http.get<CuisiniereRecapResponse>(`${this.apiUrl}/cuisiniere/recap/`);
  }
}
