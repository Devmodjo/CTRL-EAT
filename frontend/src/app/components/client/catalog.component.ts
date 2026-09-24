import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { PlatService } from '../../services/plat.service';
import { CartService } from '../../services/cart.service';
import { PlatCompteur } from '../../models/plat.model';

@Component({
  selector: 'app-catalog',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 mb-20">
      
      <!-- Uber Eats Restaurant Store Banner -->
      <div class="bg-[#F6F6F6] rounded-3xl p-6 sm:p-8 mb-8 border border-[#E8E8E8] flex flex-col md:flex-row items-center justify-between gap-6">
        <div class="space-y-2 text-center md:text-left">
          <div class="flex items-center justify-center md:justify-start gap-2">
            <span class="bg-[#06C167] text-white text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase">IAI-Cameroun</span>
            <span class="text-xs font-bold text-gray-500"><i class="fa-solid fa-star text-amber-400"></i> 4.9 (200+ avis)</span>
          </div>
          <h1 class="text-3xl sm:text-4xl font-black text-black tracking-tight">Menu de la Cuisine Centralisée</h1>
          <p class="text-xs sm:text-sm text-gray-600 max-w-xl">
            Commandez vos portions avant <strong>22h00</strong>. Livraison groupée le lendemain à <strong>12h00</strong>.
          </p>
        </div>

        <div class="bg-white px-6 py-4 rounded-2xl border border-[#E8E8E8] shadow-sm text-center md:text-right shrink-0">
          <span class="text-[10px] font-black text-gray-400 uppercase tracking-widest block">Heure Limite</span>
          <span class="text-lg font-black text-black">22h00 précise</span>
        </div>
      </div>

      <!-- Uber Eats Search Bar & Filters -->
      <div class="mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
        
        <!-- Search Input -->
        <div class="relative w-full md:w-96">
          <input type="text" [(ngModel)]="searchQuery" (input)="onSearchChange()"
            placeholder="Rechercher dans le menu..."
            class="w-full pl-11 pr-4 py-3 rounded-full bg-[#F6F6F6] border border-[#E8E8E8] text-sm focus:outline-none focus:bg-white focus:border-black font-semibold text-black">
          <i class="fa-solid fa-magnifying-glass absolute left-4 top-3.5 text-gray-400 text-base"></i>
        </div>

        <!-- Filter Pills -->
        <div class="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1">
          <button (click)="filterCat('all')" [class]="selectedCat === 'all' ? pillActive : pillInactive">
            Tous les plats ({{ filteredPlats.length }})
          </button>
          <button (click)="filterCat('popular')" [class]="selectedCat === 'popular' ? pillActive : pillInactive">
            <i class="fa-solid fa-fire mr-1 text-amber-500"></i> Populaires
          </button>
        </div>
      </div>

      <!-- Toast Notification -->
      <div *ngIf="addedNotification" class="fixed bottom-24 right-6 z-50 bg-[#06C167] text-white text-xs font-black px-5 py-3.5 rounded-full shadow-2xl flex items-center gap-3 fade-in">
        <i class="fa-solid fa-circle-check text-lg"></i>
        <span>{{ addedNotification }}</span>
      </div>

      <!-- Loading State -->
      <div *ngIf="loading" class="text-center py-20">
        <i class="fa-solid fa-circle-notch fa-spin text-3xl text-black"></i>
        <p class="text-xs font-semibold text-gray-500 mt-3">Chargement du menu...</p>
      </div>

      <!-- Food Store Grid (Uber Eats UI) -->
      <div *ngIf="!loading && filteredPlats.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        <div *ngFor="let plat of filteredPlats" class="group uber-card bg-white rounded-2xl overflow-hidden border border-[#EEEEEE] flex flex-col justify-between">
          <div>
            <div class="relative h-56 bg-[#F6F6F6] overflow-hidden">
              <img *ngIf="plat.image" [src]="plat.image" [alt]="plat.name" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300">
              <div *ngIf="!plat.image" class="w-full h-full flex items-center justify-center text-gray-400">
                <i class="fa-solid fa-bowl-food text-5xl"></i>
              </div>

              <!-- Price Badge -->
              <div class="absolute top-3 right-3 bg-black/90 text-white text-xs font-black px-3.5 py-1.5 rounded-full shadow backdrop-blur-sm">
                {{ plat.price }} FCFA
              </div>

              <!-- Live Portion Counter Badge -->
              <div class="absolute bottom-3 left-3 bg-[#06C167] text-white text-[11px] font-black px-3 py-1 rounded-full shadow flex items-center gap-1.5">
                <i class="fa-solid fa-fire text-amber-300"></i> {{ plat.commandes_demain_count }} réserves
              </div>
            </div>

            <div class="p-5 space-y-2">
              <div class="flex justify-between items-start">
                <h3 class="font-black text-lg text-black leading-tight">{{ plat.name }}</h3>
                <span class="font-black text-sm text-black shrink-0 ml-2">{{ plat.price }} FCFA</span>
              </div>
              <p class="text-xs text-gray-500 line-clamp-2">Repas savoureux préparé pour la communauté de l'IAI-Cameroun.</p>
            </div>
          </div>

          <div class="p-5 pt-0">
            <button (click)="addToCart(plat)"
              class="w-full bg-[#000000] hover:bg-[#222222] text-white font-bold py-3 rounded-full text-xs transition-transform active:scale-95 flex items-center justify-center gap-2 shadow-sm">
              <i class="fa-solid fa-plus text-xs"></i> Ajouter au panier
            </button>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div *ngIf="!loading && filteredPlats.length === 0" class="text-center py-20 bg-[#F6F6F6] rounded-3xl border border-[#E8E8E8] max-w-md mx-auto">
        <i class="fa-solid fa-utensils text-4xl text-gray-400 mb-3"></i>
        <h3 class="font-bold text-black text-base">Aucun plat disponible</h3>
      </div>

    </div>
  `
})
export class CatalogComponent implements OnInit {
  plats: PlatCompteur[] = [];
  filteredPlats: PlatCompteur[] = [];
  searchQuery = '';
  selectedCat = 'all';
  loading = true;
  addedNotification = '';

  pillActive = 'bg-black text-white font-bold px-4 py-2 rounded-full text-xs shadow-sm shrink-0';
  pillInactive = 'bg-[#F6F6F6] text-black hover:bg-[#EEEEEE] font-bold px-4 py-2 rounded-full text-xs shrink-0';

  constructor(
    private platService: PlatService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.fetchPlats();
  }

  fetchPlats(): void {
    this.platService.getCompteurs().subscribe({
      next: (data) => {
        this.plats = data;
        this.filteredPlats = data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  onSearchChange(): void {
    let result = this.plats;
    const query = this.searchQuery.toLowerCase().trim();
    if (query) {
      result = result.filter(p => p.name.toLowerCase().includes(query));
    }
    if (this.selectedCat === 'popular') {
      result = result.filter(p => p.commandes_demain_count > 0);
    }
    this.filteredPlats = result;
  }

  filterCat(cat: string): void {
    this.selectedCat = cat;
    this.onSearchChange();
  }

  addToCart(platCompteur: PlatCompteur): void {
    const platObj = {
      id: platCompteur.id,
      name: platCompteur.name,
      price: platCompteur.price,
      image: platCompteur.image,
      disponibility: platCompteur.disponibility
    };
    this.cartService.addToCart(platObj, 1);

    this.addedNotification = `${platCompteur.name} ajouté au panier !`;
    setTimeout(() => {
      this.addedNotification = '';
    }, 2500);
  }
}
