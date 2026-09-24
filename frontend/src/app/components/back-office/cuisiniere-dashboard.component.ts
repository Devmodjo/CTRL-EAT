import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CommandeService } from '../../services/commande.service';
import { CuisiniereRecapResponse } from '../../models/commande.model';

@Component({
  selector: 'app-cuisiniere-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 mb-20">
      
      <!-- Uber Eats Kitchen KDS Display Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 bg-black text-white p-6 sm:p-8 rounded-3xl shadow-xl">
        <div>
          <span class="bg-[#06C167] text-white text-[10px] font-black px-3.5 py-1 rounded-full uppercase tracking-wider">
            Écran de Production Cuisine
          </span>
          <h1 class="text-2xl sm:text-3xl font-black mt-2">Récapitulatif des Repas à Préparer</h1>
          <p class="text-gray-400 text-xs sm:text-sm mt-0.5">Quantités cumulées exactes pour la livraison de demain à 12h00</p>
        </div>

        <button (click)="fetchRecap()" class="bg-[#F6F6F6] hover:bg-[#EEEEEE] text-black font-bold px-5 py-3 rounded-full text-xs flex items-center gap-2 shadow-sm">
          <i class="fa-solid fa-rotate"></i> Actualiser
        </button>
      </div>

      <!-- Loading State -->
      <div *ngIf="loading" class="text-center py-20">
        <i class="fa-solid fa-circle-notch fa-spin text-4xl text-black"></i>
        <p class="text-gray-500 text-xs font-semibold mt-3">Calcul des quantités en cuisine...</p>
      </div>

      <!-- Dashboard Cuisinière -->
      <div *ngIf="!loading && recap" class="space-y-8">
        
        <!-- Key Metrics Cards -->
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-6">
          
          <div class="bg-[#F6F6F6] p-6 rounded-3xl border border-[#E8E8E8] flex items-center gap-4">
            <div class="w-14 h-14 rounded-2xl bg-white border border-[#E8E8E8] text-black flex items-center justify-center text-2xl font-bold shadow-sm">
              <i class="fa-solid fa-calendar-day"></i>
            </div>
            <div>
              <span class="text-[10px] font-black text-gray-400 block uppercase tracking-wider">Date de Livraison</span>
              <span class="text-lg font-black text-black">{{ recap.date_livraison_formatee }} à 12h</span>
            </div>
          </div>

          <div class="bg-[#F6F6F6] p-6 rounded-3xl border border-[#E8E8E8] flex items-center gap-4">
            <div class="w-14 h-14 rounded-2xl bg-white border border-[#E8E8E8] text-black flex items-center justify-center text-2xl font-bold shadow-sm">
              <i class="fa-solid fa-receipt"></i>
            </div>
            <div>
              <span class="text-[10px] font-black text-gray-400 block uppercase tracking-wider">Commandes Payées</span>
              <span class="text-2xl font-black text-black">{{ recap.total_commandes }}</span>
            </div>
          </div>

          <div class="bg-[#F6F6F6] p-6 rounded-3xl border border-[#E8E8E8] flex items-center gap-4">
            <div class="w-14 h-14 rounded-2xl bg-white border border-[#E8E8E8] text-[#06C167] flex items-center justify-center text-2xl font-bold shadow-sm">
              <i class="fa-solid fa-bowl-food"></i>
            </div>
            <div>
              <span class="text-[10px] font-black text-gray-400 block uppercase tracking-wider">Total Portions à Cuisiner</span>
              <span class="text-2xl font-black text-[#06C167]">{{ recap.total_portion_repas }} portions</span>
            </div>
          </div>

        </div>

        <!-- Kitchen Production Cards -->
        <div class="bg-white rounded-3xl p-6 sm:p-8 border border-[#EEEEEE] shadow-sm space-y-6">
          <div class="flex items-center justify-between border-b border-[#EEEEEE] pb-4">
            <h2 class="text-xl font-black text-black flex items-center gap-2">
              <i class="fa-solid fa-fire-burner text-[#06C167]"></i> Fiche de Production Culinaire
            </h2>
            <span class="text-xs font-bold text-[#06C167] bg-[#E6F8F0] px-3.5 py-1.5 rounded-full border border-[#A7F3D0]">
              Zero Gaspillage
            </span>
          </div>

          <div *ngIf="recap.plats_a_preparer.length === 0" class="text-center py-16">
            <i class="fa-solid fa-utensils text-4xl text-gray-300 mb-3"></i>
            <p class="text-gray-600 font-bold text-base">Aucune commande validée pour le moment pour demain.</p>
          </div>

          <div *ngIf="recap.plats_a_preparer.length > 0" class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div *ngFor="let item of recap.plats_a_preparer" class="bg-[#F6F6F6] border border-[#E8E8E8] p-6 rounded-3xl flex items-center justify-between gap-4 uber-card">
              
              <div class="flex items-center gap-4">
                <div class="w-16 h-16 rounded-2xl bg-white overflow-hidden shrink-0 border border-[#E8E8E8]">
                  <img *ngIf="item.plat_image" [src]="item.plat_image" [alt]="item.plat_nom" class="w-full h-full object-cover">
                  <div *ngIf="!item.plat_image" class="w-full h-full flex items-center justify-center text-gray-400">
                    <i class="fa-solid fa-bowl-food text-2xl"></i>
                  </div>
                </div>

                <div>
                  <h3 class="font-black text-xl text-black">{{ item.plat_nom }}</h3>
                  <p class="text-gray-500 text-xs font-semibold mt-0.5">{{ item.plat_prix }} FCFA / portion</p>
                </div>
              </div>

              <!-- High Contrast Quantity Badge -->
              <div class="bg-black text-white px-5 py-3 rounded-2xl text-center shrink-0 shadow-md">
                <span class="text-3xl font-black block leading-none text-[#06C167]">{{ item.quantite_totale_a_preparer }}</span>
                <span class="text-[10px] font-black uppercase tracking-wider">portions</span>
              </div>

            </div>
          </div>
        </div>

      </div>

    </div>
  `
})
export class CuisiniereDashboardComponent implements OnInit {
  recap: CuisiniereRecapResponse | null = null;
  loading = true;

  constructor(private commandeService: CommandeService) {}

  ngOnInit(): void {
    this.fetchRecap();
  }

  fetchRecap(): void {
    this.loading = true;
    this.commandeService.getCuisiniereRecap().subscribe({
      next: (data) => {
        this.recap = data;
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }
}
