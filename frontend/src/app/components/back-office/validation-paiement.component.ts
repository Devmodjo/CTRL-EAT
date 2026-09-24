import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CommandeService } from '../../services/commande.service';
import { Commande } from '../../models/commande.model';

@Component({
  selector: 'app-validation-paiement',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mb-20">
      
      <!-- Executive Backoffice Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 bg-slate-950 text-white p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-xl">
        <div>
          <span class="bg-emerald-600 text-white text-[10px] font-black px-3.5 py-1 rounded-full uppercase tracking-wider">
            Validation Reçus Mobile Money
          </span>
          <h1 class="text-2xl sm:text-3xl font-black mt-2">Vérification des Paiements</h1>
          <p class="text-slate-300 text-xs sm:text-sm mt-0.5">Validez les captures d'écran des étudiants pour incrémenter le compteur de la cuisinière.</p>
        </div>

        <a routerLink="/backoffice/admin" class="bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 font-bold px-5 py-3 rounded-2xl text-xs flex items-center gap-2">
          ← Tableau de bord
        </a>
      </div>

      <!-- Loading State -->
      <div *ngIf="loading" class="text-center py-20">
        <i class="fa-solid fa-circle-notch fa-spin text-4xl text-emerald-600"></i>
        <p class="text-slate-500 text-xs font-semibold mt-3">Chargement des reçus à vérifier...</p>
      </div>

      <!-- Notification succès -->
      <div *ngIf="successMessage" class="bg-emerald-600 text-white p-4 rounded-2xl text-xs font-black shadow-lg mb-6 flex items-center justify-between">
        <div class="flex items-center gap-2">
          <i class="fa-solid fa-circle-check text-xl"></i>
          <span>{{ successMessage }}</span>
        </div>
        <button (click)="successMessage = ''" class="text-white hover:text-emerald-200">
          <i class="fa-solid fa-xmark text-base"></i>
        </button>
      </div>

      <!-- Liste vide -->
      <div *ngIf="!loading && pendingCommandes.length === 0" class="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm max-w-md mx-auto">
        <i class="fa-solid fa-circle-check text-5xl text-emerald-500 mb-3"></i>
        <h3 class="font-black text-slate-800 text-lg">Aucun reçu en attente</h3>
        <p class="text-slate-500 text-xs mt-1">Tous les paiements Mobile Money reçus ont déjà été confirmés.</p>
      </div>

      <!-- Grid Reçus à valider -->
      <div *ngIf="!loading && pendingCommandes.length > 0" class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div *ngFor="let cmd of pendingCommandes" class="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between space-y-4 food-card">
          
          <div class="space-y-4">
            <div class="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span class="font-black text-slate-900 text-lg">Commande #{{ cmd.id.substring(0, 8) }}</span>
                <span class="text-xs text-slate-400 block font-semibold">{{ cmd.date_creation | date:'dd/MM/yyyy HH:mm' }}</span>
              </div>
              <div class="text-right">
                <span class="text-xl font-black text-orange-600">{{ cmd.total_price }} FCFA</span>
                <span class="text-[10px] text-slate-400 block font-bold uppercase">Mobile Money</span>
              </div>
            </div>

            <!-- Client Info Card -->
            <div class="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-xs space-y-1.5">
              <p><strong class="text-slate-900">Étudiant :</strong> {{ cmd.client_detail?.name }} {{ cmd.client_detail?.surname }}</p>
              <p><strong class="text-slate-900">Filière / Classe :</strong> {{ cmd.client_detail?.classe }}</p>
              <p><strong class="text-slate-900">Numéro Mobile Money :</strong> <span class="font-mono font-bold text-slate-900">{{ cmd.client_detail?.phone }}</span></p>
              <p><strong class="text-slate-900">Livraison cible :</strong> {{ cmd.date_livraison | date:'dd/MM/yyyy' }} à 12h00</p>
            </div>

            <!-- Receipt Image Box -->
            <div>
              <span class="text-xs font-bold text-slate-800 block mb-2">Capture du reçu reçu :</span>
              
              <div *ngIf="cmd.payment_proof_url" class="relative h-60 bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 shadow-inner group">
                <img [src]="cmd.payment_proof_url" alt="Preuve de paiement" class="w-full h-full object-contain">
                <a [href]="cmd.payment_proof_url" target="_blank" class="absolute bottom-3 right-3 bg-slate-900/90 text-white text-[11px] font-bold px-3 py-1.5 rounded-xl backdrop-blur-sm shadow-md">
                  <i class="fa-solid fa-up-right-from-square"></i> Agrandir
                </a>
              </div>

              <div *ngIf="!cmd.payment_proof_url" class="bg-amber-50 border border-amber-200 p-4 rounded-2xl text-center text-amber-800 text-xs font-medium">
                <i class="fa-solid fa-triangle-exclamation text-xl text-amber-600 block mb-1"></i>
                L'étudiant n'a pas encore joint son reçu de paiement.
              </div>
            </div>
          </div>

          <!-- Confirm Payment Button -->
          <div class="pt-2">
            <button (click)="validerPaiement(cmd)" [disabled]="validatingId === cmd.id"
              class="w-full bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-bold py-3.5 rounded-2xl shadow-lg shadow-emerald-600/20 transition-all text-xs flex items-center justify-center gap-2">
              <i *ngIf="validatingId === cmd.id" class="fa-solid fa-circle-notch fa-spin"></i>
              <i *ngIf="validatingId !== cmd.id" class="fa-solid fa-check text-sm"></i>
              <span>Confirmer le Paiement & Incrémenter le Compteur</span>
            </button>
          </div>

        </div>
      </div>

    </div>
  `
})
export class ValidationPaiementComponent implements OnInit {
  pendingCommandes: Commande[] = [];
  loading = true;
  validatingId: string | null = null;
  successMessage = '';

  constructor(private commandeService: CommandeService) {}

  ngOnInit(): void {
    this.fetchPendingCommandes();
  }

  fetchPendingCommandes(): void {
    this.commandeService.getCommandes(undefined, 'EN_ATTENTE').subscribe({
      next: (data) => {
        this.pendingCommandes = data;
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  validerPaiement(cmd: Commande): void {
    this.validatingId = cmd.id;
    this.commandeService.validerPaiement(cmd.id).subscribe({
      next: (res) => {
        this.validatingId = null;
        this.successMessage = res.message || `Paiement confirmé avec succès pour la commande #${cmd.id.substring(0, 8)} !`;
        this.fetchPendingCommandes();
      },
      error: () => {
        this.validatingId = null;
      }
    });
  }
}
