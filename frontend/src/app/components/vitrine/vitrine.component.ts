import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PlatService } from '../../services/plat.service';
import { PlatCompteur } from '../../models/plat.model';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-vitrine',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <!-- Uber Eats Style Hero Section -->
    <section class="bg-[#F6F6F6] py-12 lg:py-16 border-b border-[#E8E8E8]">
      <div class="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          <!-- Hero Text -->
          <div class="lg:col-span-7 space-y-6">
            <h1 class="text-4xl sm:text-6xl font-black text-black tracking-tighter leading-none">
              Vos repas du campus, <br>
              <span class="text-[#06C167]">livrés demain à 12h.</span>
            </h1>

            <p class="text-gray-600 text-base sm:text-lg max-w-xl font-normal leading-relaxed">
              Précommandez vos plats préférés de la cuisine IAI-Cameroun avant <strong>22h00</strong>. 
              Une production fraîche sur mesure pour une livraison à heure fixe sur la cour principale.
            </p>

            <!-- Uber Eats Schedule Banner -->
            <div class="bg-white border border-[#E8E8E8] p-4 rounded-2xl max-w-md flex items-center justify-between shadow-sm">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-full bg-[#E6F8F0] text-[#06C167] flex items-center justify-center text-lg">
                  <i class="fa-solid fa-clock-rotate-left"></i>
                </div>
                <div>
                  <span class="text-[10px] font-black text-gray-400 uppercase tracking-wider block">Règle de commande</span>
                  <span class="text-xs font-bold text-black">Validation avant <strong class="text-[#06C167] underline">22h00</strong></span>
                </div>
              </div>
              <span class="bg-black text-white text-[11px] font-bold px-3 py-1 rounded-full">12h00 Fixe</span>
            </div>

            <!-- CTA Buttons -->
            <div class="flex flex-col sm:flex-row items-center gap-3 pt-2">
              <a routerLink="/menu" class="w-full sm:w-auto bg-[#000000] hover:bg-[#222222] text-white font-bold px-8 py-4 rounded-full text-sm transition-transform active:scale-95 text-center shadow-md">
                Parcourir le Menu & Commander
              </a>
              <a routerLink="/register" class="w-full sm:w-auto bg-white border border-[#E8E8E8] hover:bg-[#F6F6F6] text-black font-bold px-6 py-4 rounded-full text-sm text-center">
                Créer un compte Étudiant
              </a>
            </div>
          </div>

          <!-- Hero Graphic Card (Uber Eats Kitchen Card) -->
          <div class="lg:col-span-5">
            <div class="bg-white rounded-3xl p-6 border border-[#E8E8E8] shadow-lg space-y-4 uber-card">
              <div class="relative h-48 rounded-2xl bg-gray-100 overflow-hidden">
                <img src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80" alt="Cuisine IAI" class="w-full h-full object-cover">
                <div class="absolute top-3 left-3 bg-[#06C167] text-white text-xs font-black px-3 py-1 rounded-full shadow flex items-center gap-1">
                  <i class="fa-solid fa-star text-amber-300 text-[10px]"></i> 4.9 (200+ avis)
                </div>
                <div class="absolute bottom-3 right-3 bg-black/80 text-white text-xs font-bold px-3 py-1 rounded-full backdrop-blur-sm">
                  Cuisine Centralisée IAI
                </div>
              </div>

              <div class="space-y-1">
                <h3 class="font-black text-xl text-black">Cuisine Centrale IAI-Cameroun</h3>
                <p class="text-xs text-gray-500">Plats traditionnels • Repas équilibrés • Cuisine fraîche du jour</p>
              </div>

              <div class="pt-2 border-t border-[#EEEEEE] flex items-center justify-between text-xs font-bold text-gray-700">
                <span><i class="fa-solid fa-truck text-[#06C167] mr-1.5"></i> Livraison Cour Principale</span>
                <span class="text-black font-black">Gratuit</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>

    <!-- Categories Icon Bar (Clean FontAwesome Vector Icons - NO EMOJIS) -->
    <section class="py-8 bg-white border-b border-[#EEEEEE]">
      <div class="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <h2 class="text-xs font-black text-gray-400 uppercase tracking-widest mb-6">Explorer par catégorie</h2>
        
        <div class="flex items-center gap-8 overflow-x-auto pb-2">
          <div (click)="filterCat('all')" class="flex flex-col items-center gap-2 cursor-pointer category-pill shrink-0">
            <div class="w-16 h-16 rounded-full bg-[#F6F6F6] hover:bg-[#EEEEEE] flex items-center justify-center text-xl text-black border border-[#E8E8E8]">
              <i class="fa-solid fa-utensils"></i>
            </div>
            <span class="text-xs font-bold text-black">Tous les Plats</span>
          </div>

          <div (click)="filterCat('chauds')" class="flex flex-col items-center gap-2 cursor-pointer category-pill shrink-0">
            <div class="w-16 h-16 rounded-full bg-[#F6F6F6] hover:bg-[#EEEEEE] flex items-center justify-center text-xl text-black border border-[#E8E8E8]">
              <i class="fa-solid fa-drumstick-bite"></i>
            </div>
            <span class="text-xs font-bold text-black">Poulet & Grillades</span>
          </div>

          <div (click)="filterCat('riz')" class="flex flex-col items-center gap-2 cursor-pointer category-pill shrink-0">
            <div class="w-16 h-16 rounded-full bg-[#F6F6F6] hover:bg-[#EEEEEE] flex items-center justify-center text-xl text-black border border-[#E8E8E8]">
              <i class="fa-solid fa-bowl-rice"></i>
            </div>
            <span class="text-xs font-bold text-black">Riz & Sauces</span>
          </div>

          <div (click)="filterCat('boissons')" class="flex flex-col items-center gap-2 cursor-pointer category-pill shrink-0">
            <div class="w-16 h-16 rounded-full bg-[#F6F6F6] hover:bg-[#EEEEEE] flex items-center justify-center text-xl text-black border border-[#E8E8E8]">
              <i class="fa-solid fa-glass-water"></i>
            </div>
            <span class="text-xs font-bold text-black">Boissons & Extras</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Main Food Store Cards Grid (Uber Eats Card UI - NO EMOJIS) -->
    <section class="py-12 bg-white">
      <div class="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        
        <div class="flex items-center justify-between mb-8">
          <h2 class="text-2xl sm:text-3xl font-black text-black tracking-tight">
            Menu Disponibles pour Demain (12h00)
          </h2>

          <a routerLink="/menu" class="text-xs font-bold text-[#06C167] hover:underline flex items-center gap-1">
            Voir le catalogue complet <i class="fa-solid fa-arrow-right text-[10px]"></i>
          </a>
        </div>

        <div *ngIf="loading" class="text-center py-16">
          <i class="fa-solid fa-circle-notch fa-spin text-3xl text-black"></i>
          <p class="text-xs font-semibold text-gray-500 mt-3">Chargement des plats en cuisine...</p>
        </div>

        <div *ngIf="!loading && plats.length === 0" class="bg-[#F6F6F6] p-12 rounded-3xl text-center border border-[#E8E8E8] max-w-md mx-auto">
          <i class="fa-solid fa-utensils text-4xl text-gray-400 mb-3"></i>
          <p class="text-black font-bold">Aucun plat disponible pour le moment.</p>
        </div>

        <!-- Uber Eats Card Grid -->
        <div *ngIf="!loading && plats.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <div *ngFor="let plat of plats" class="group cursor-pointer uber-card bg-white rounded-2xl overflow-hidden border border-[#EEEEEE] flex flex-col justify-between">
            <div>
              <!-- Image with Badges & Favorite Heart -->
              <div class="relative h-52 bg-[#F6F6F6] overflow-hidden">
                <img *ngIf="plat.image" [src]="plat.image" [alt]="plat.name" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300">
                <div *ngIf="!plat.image" class="w-full h-full flex items-center justify-center text-gray-400">
                  <i class="fa-solid fa-bowl-food text-5xl"></i>
                </div>

                <!-- Favorite Heart Button -->
                <button class="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 text-black flex items-center justify-center hover:bg-white shadow transition-transform active:scale-90">
                  <i class="fa-regular fa-heart text-sm"></i>
                </button>

                <!-- Portion Counter Badge -->
                <div class="absolute bottom-3 left-3 bg-[#06C167] text-white text-[11px] font-black px-3 py-1 rounded-full shadow flex items-center gap-1.5">
                  <i class="fa-solid fa-fire text-amber-300"></i> {{ plat.commandes_demain_count }} commandés
                </div>
              </div>

              <!-- Card Content -->
              <div class="p-5 space-y-2">
                <div class="flex justify-between items-start">
                  <h3 class="font-black text-lg text-black group-hover:text-[#06C167] transition-colors leading-tight">{{ plat.name }}</h3>
                  <span class="font-black text-base text-black shrink-0 ml-2">{{ plat.price }} FCFA</span>
                </div>
                
                <p class="text-xs text-gray-500 line-clamp-2">Préparé par la cuisinière du campus IAI-Cameroun. Ingrédients frais du jour.</p>
                
                <div class="flex items-center gap-3 text-[11px] font-bold text-gray-600 pt-1">
                  <span><i class="fa-solid fa-star text-amber-400"></i> 4.8</span>
                  <span>•</span>
                  <span><i class="fa-solid fa-clock text-gray-400"></i> Demain 12h00</span>
                </div>
              </div>
            </div>

            <!-- Quick Add Button -->
            <div class="px-5 pb-5 pt-0">
              <button (click)="addToCart(plat)" class="w-full bg-[#000000] hover:bg-[#222222] text-white font-bold py-3 rounded-full text-xs transition-transform active:scale-95 flex items-center justify-center gap-2 shadow-sm">
                <i class="fa-solid fa-plus text-xs"></i> Ajouter au panier
              </button>
            </div>
          </div>
        </div>

      </div>
    </section>
  `
})
export class VitrineComponent implements OnInit {
  plats: PlatCompteur[] = [];
  loading = true;

  constructor(
    private platService: PlatService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.platService.getCompteurs().subscribe({
      next: (data) => {
        this.plats = data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  filterCat(cat: string): void {
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
  }
}
