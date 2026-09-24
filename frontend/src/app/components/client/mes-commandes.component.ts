import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CommandeService } from '../../services/commande.service';
import { AuthService } from '../../services/auth.service';
import { Commande } from '../../models/commande.model';

@Component({
  selector: 'app-mes-commandes',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mb-20">
      
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-4 border-b border-[#EEEEEE]">
        <div>
          <h1 class="text-3xl font-black text-black tracking-tight flex items-center gap-3">
            <i class="fa-solid fa-clock-rotate-left text-[#06C167]"></i> Suivi de mes Commandes
          </h1>
          <p class="text-xs text-gray-500 mt-1">Suivez en temps réel la préparation et la livraison de vos repas sur le campus.</p>
        </div>

        <a routerLink="/menu" class="bg-black hover:bg-[#222222] text-white font-bold px-5 py-2.5 rounded-full text-xs transition-transform active:scale-95 w-fit">
          + Nouvelle commande
        </a>
      </div>

      <!-- Loading State -->
      <div *ngIf="loading" class="text-center py-20">
        <i class="fa-solid fa-circle-notch fa-spin text-3xl text-black"></i>
        <p class="text-xs font-semibold text-gray-500 mt-3">Chargement de vos commandes...</p>
      </div>

      <!-- Empty State -->
      <div *ngIf="!loading && commandes.length === 0" class="bg-[#F6F6F6] rounded-3xl p-12 text-center border border-[#E8E8E8] max-w-md mx-auto">
        <i class="fa-solid fa-receipt text-5xl text-gray-400 mb-4"></i>
        <h3 class="font-black text-black text-lg">Aucune commande en cours</h3>
        <p class="text-gray-500 text-xs mt-1 mb-6">Précommandez vos repas la veille avant 22h00.</p>
        <a routerLink="/menu" class="bg-black text-white font-bold px-6 py-3 rounded-full text-xs">
          Parcourir le Menu
        </a>
      </div>

      <!-- Order Cards (Uber Eats Live Order Timeline) -->
      <div *ngIf="!loading && commandes.length > 0" class="space-y-6">
        <div *ngFor="let cmd of commandes" class="bg-white rounded-3xl p-6 sm:p-8 border border-[#EEEEEE] shadow-sm space-y-6 uber-card">
          
          <!-- Order Header -->
          <div class="flex flex-wrap items-center justify-between gap-4 border-b border-[#EEEEEE] pb-4">
            <div>
              <div class="flex items-center gap-3">
                <span class="font-black text-black text-lg">Commande #{{ cmd.id.substring(0, 8) }}</span>
                <span class="status-pill status-{{ cmd.status }}">{{ cmd.status_display }}</span>
              </div>
              <p class="text-gray-500 text-xs mt-1">
                Créée le {{ cmd.date_creation | date:'dd/MM/yyyy HH:mm' }} • Livraison prévisionnelle : <strong class="text-black">{{ cmd.date_livraison | date:'dd/MM/yyyy' }} à 12h00</strong>
              </p>
            </div>

            <div class="text-right">
              <span class="text-[10px] text-gray-400 font-bold block uppercase tracking-wider">Total</span>
              <span class="text-2xl font-black text-black">{{ cmd.total_price }} FCFA</span>
            </div>
          </div>

          <!-- UBER EATS LIVE TIMELINE PROGRESS -->
          <div class="bg-[#F6F6F6] p-6 rounded-2xl border border-[#E8E8E8] space-y-4">
            <span class="text-[10px] font-black text-gray-400 uppercase tracking-widest block">Progression de la commande</span>
            
            <div class="grid grid-cols-5 gap-2 text-center text-[10px] sm:text-xs font-bold">
              
              <!-- Step 1: Reçue -->
              <div class="flex flex-col items-center gap-2">
                <div [class]="getStepClass(cmd.status, 1)">
                  <i class="fa-solid fa-receipt"></i>
                </div>
                <span [class]="getStepTextClass(cmd.status, 1)">1. Reçue</span>
              </div>

              <!-- Step 2: Confirmée -->
              <div class="flex flex-col items-center gap-2">
                <div [class]="getStepClass(cmd.status, 2)">
                  <i class="fa-solid fa-check-double"></i>
                </div>
                <span [class]="getStepTextClass(cmd.status, 2)">2. Confirmée</span>
              </div>

              <!-- Step 3: En Cuisine -->
              <div class="flex flex-col items-center gap-2">
                <div [class]="getStepClass(cmd.status, 3)">
                  <i class="fa-solid fa-fire-burner"></i>
                </div>
                <span [class]="getStepTextClass(cmd.status, 3)">3. En Cuisine</span>
              </div>

              <!-- Step 4: Prête -->
              <div class="flex flex-col items-center gap-2">
                <div [class]="getStepClass(cmd.status, 4)">
                  <i class="fa-solid fa-box-open"></i>
                </div>
                <span [class]="getStepTextClass(cmd.status, 4)">4. Prête</span>
              </div>

              <!-- Step 5: Livrée -->
              <div class="flex flex-col items-center gap-2">
                <div [class]="getStepClass(cmd.status, 5)">
                  <i class="fa-solid fa-handshake"></i>
                </div>
                <span [class]="getStepTextClass(cmd.status, 5)">5. Livrée</span>
              </div>
            </div>
          </div>

          <!-- Items list -->
          <div class="bg-[#F6F6F6] p-4 rounded-2xl border border-[#E8E8E8]">
            <h5 class="text-xs font-black text-black uppercase tracking-wider mb-2">Contenu du repas :</h5>
            <div class="divide-y divide-[#EEEEEE]">
              <div *ngFor="let item of cmd.items" class="py-2 flex justify-between items-center text-xs">
                <div class="flex items-center gap-2">
                  <span class="font-black text-[#06C167] bg-[#E6F8F0] px-2 py-0.5 rounded-full">{{ item.quantity }}x</span>
                  <span class="font-bold text-black">{{ item.plat_detail?.name || 'Plat' }}</span>
                </div>
                <span class="font-black text-black">{{ item.subtotal }} FCFA</span>
              </div>
            </div>
          </div>

          <!-- Payment Proof Status -->
          <div class="flex items-center justify-between text-xs pt-1">
            <div class="flex items-center gap-2">
              <span class="text-gray-500 font-semibold">Paiement Mobile Money :</span>
              <span *ngIf="cmd.payment_verified" class="text-[#06C167] font-black flex items-center gap-1">
                <i class="fa-solid fa-circle-check"></i> Reçu validé
              </span>
              <span *ngIf="!cmd.payment_verified && cmd.payment_proof_url" class="text-amber-600 font-bold flex items-center gap-1">
                <i class="fa-solid fa-clock"></i> Reçu sous vérification
              </span>
              <span *ngIf="!cmd.payment_verified && !cmd.payment_proof_url" class="text-red-600 font-bold flex items-center gap-1">
                <i class="fa-solid fa-triangle-exclamation"></i> Reçu non téléversé
              </span>
            </div>

            <a *ngIf="cmd.payment_proof_url" [href]="cmd.payment_proof_url" target="_blank" class="text-[#06C167] hover:underline font-bold flex items-center gap-1">
              <i class="fa-solid fa-image"></i> Voir le reçu
            </a>
          </div>

        </div>
      </div>

    </div>
  `
})
export class MesCommandesComponent implements OnInit {
  commandes: Commande[] = [];
  loading = true;

  constructor(
    private commandeService: CommandeService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();
    const clientId = user?.client_id;
    
    this.commandeService.getCommandes(clientId).subscribe({
      next: (data) => {
        this.commandes = data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  getStepNumber(status: string): number {
    switch (status) {
      case 'EN_ATTENTE': return 1;
      case 'CONFIRMER': return 2;
      case 'EN_PREPARATION': return 3;
      case 'PRETE': return 4;
      case 'LIVREE': return 5;
      default: return 1;
    }
  }

  getStepClass(status: string, step: number): string {
    const currentStep = this.getStepNumber(status);
    const base = "w-10 h-10 rounded-full flex items-center justify-center text-xs font-black transition-all ";
    if (currentStep >= step) {
      return base + "bg-[#06C167] text-white shadow-sm scale-105";
    }
    return base + "bg-[#EEEEEE] text-gray-400";
  }

  getStepTextClass(status: string, step: number): string {
    const currentStep = this.getStepNumber(status);
    if (currentStep >= step) {
      return "text-[#06C167] font-black";
    }
    return "text-gray-400 font-semibold";
  }
}
