import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { CartService } from '../services/cart.service';
import { User } from '../models/user.model';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <!-- Top Navigation Header Fixed on ALL resolutions (Mobile & Desktop) -->
    <header class="fixed top-0 left-0 right-0 w-full bg-white border-b border-[#EEEEEE] z-50 shadow-sm">
      <div class="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        
        <!-- Left: Logo & Campus Location Selector -->
        <div class="flex items-center gap-4 sm:gap-6">
          <a routerLink="/" class="flex items-center gap-2 text-2xl font-black tracking-tighter text-black hover:opacity-90 transition-opacity">
            <span>Ctrl<span class="text-[#06C167]">+</span>Eat</span>
          </a>

          <!-- Location & Schedule Selector Pill -->
          <div class="hidden lg:flex items-center bg-[#F6F6F6] hover:bg-[#EEEEEE] px-4 py-2.5 rounded-full cursor-pointer transition-colors text-xs font-bold text-black border border-[#E8E8E8]">
            <i class="fa-solid fa-location-dot text-sm text-[#06C167] mr-2.5"></i>
            <span>Campus IAI-Cameroun</span>
            <span class="mx-2 text-gray-400">•</span>
            <i class="fa-solid fa-clock text-xs text-gray-600 mr-1.5"></i>
            <span>Demain à 12h00</span>
            <i class="fa-solid fa-chevron-down text-[10px] text-gray-500 ml-2.5"></i>
          </div>
        </div>

        <!-- Navigation Links (Middle Desktop) -->
        <nav class="hidden md:flex items-center gap-6 text-sm font-semibold text-black">
          <a routerLink="/" routerLinkActive="text-[#06C167]" [routerLinkActiveOptions]="{exact: true}" class="hover:text-[#06C167] transition-colors">
            Accueil
          </a>
          <a routerLink="/menu" routerLinkActive="text-[#06C167]" class="hover:text-[#06C167] transition-colors">
            Menu du Campus
          </a>
          <a *ngIf="isLoggedIn" routerLink="/mes-commandes" routerLinkActive="text-[#06C167]" class="hover:text-[#06C167] transition-colors">
            Mes Commandes
          </a>
          
          <!-- Backoffice Button for Staff -->
          <a *ngIf="isCook" routerLink="/backoffice/cuisiniere" class="bg-[#FFF8E6] text-[#B45309] border border-[#FDE68A] px-3.5 py-1.5 rounded-full text-xs font-bold hover:bg-[#FEF0C7] transition-colors">
            <i class="fa-solid fa-kitchen-set mr-1"></i> Cuisine
          </a>
          <a *ngIf="isAdmin" routerLink="/backoffice/admin" class="bg-[#000000] text-white px-3.5 py-1.5 rounded-full text-xs font-bold hover:bg-[#222222] transition-colors">
            <i class="fa-solid fa-user-shield mr-1"></i> Back-office
          </a>
        </nav>

        <!-- Right Side: Cart Button & Auth -->
        <div class="flex items-center gap-3">
          
          <!-- Cart Button Pill -->
          <a routerLink="/panier" class="bg-[#000000] hover:bg-[#222222] text-white px-4 sm:px-5 py-2.5 rounded-full text-xs font-bold flex items-center gap-2 shadow-sm transition-transform active:scale-95">
            <i class="fa-solid fa-basket-shopping text-sm"></i>
            <span class="hidden sm:inline">Panier</span>
            <span class="bg-[#06C167] text-white text-[11px] font-black px-2 py-0.5 rounded-full ml-0.5">
              {{ cartCount }}
            </span>
          </a>

          <!-- Auth Actions -->
          <ng-container *ngIf="isLoggedIn; else loginBtn">
            <div class="flex items-center gap-2">
              <div class="hidden sm:flex flex-col text-right">
                <span class="text-xs font-bold text-black">{{ currentUser?.name || currentUser?.username }}</span>
                <span class="text-[10px] text-gray-500 uppercase font-bold">{{ currentUser?.role || 'Etudiant' }}</span>
              </div>
              <button (click)="logout()" title="Déconnexion" class="w-9 h-9 rounded-full bg-[#F6F6F6] hover:bg-[#EEEEEE] text-black flex items-center justify-center transition-colors border border-[#E8E8E8]">
                <i class="fa-solid fa-right-from-bracket text-xs"></i>
              </button>
            </div>
          </ng-container>

          <ng-template #loginBtn>
            <a routerLink="/login" class="bg-[#F6F6F6] hover:bg-[#EEEEEE] text-black font-bold px-4 py-2.5 rounded-full text-xs transition-colors border border-[#E8E8E8]">
              Connexion
            </a>
            <a routerLink="/register" class="hidden sm:inline-block bg-[#06C167] hover:bg-[#05A357] text-white font-bold px-4 py-2.5 rounded-full text-xs transition-colors shadow-sm">
              S'inscrire
            </a>
          </ng-template>
        </div>
      </div>
    </header>

    <!-- Mobile Bottom Navigation Bar (Uber Eats Style) -->
    <div class="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-[#EEEEEE] z-50 px-4 py-2.5 shadow-lg">
      <div class="flex items-center justify-around text-center text-gray-500">
        <a routerLink="/" routerLinkActive="text-black font-bold" [routerLinkActiveOptions]="{exact: true}" class="flex flex-col items-center gap-1 text-[11px]">
          <i class="fa-solid fa-house text-lg"></i>
          <span>Accueil</span>
        </a>
        <a routerLink="/menu" routerLinkActive="text-black font-bold" class="flex flex-col items-center gap-1 text-[11px]">
          <i class="fa-solid fa-magnifying-glass text-lg"></i>
          <span>Menu</span>
        </a>
        <a routerLink="/panier" routerLinkActive="text-black font-bold" class="flex flex-col items-center gap-1 text-[11px] relative">
          <i class="fa-solid fa-basket-shopping text-lg"></i>
          <span>Panier</span>
          <span *ngIf="cartCount > 0" class="absolute -top-1 -right-1 bg-[#06C167] text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center">
            {{ cartCount }}
          </span>
        </a>
        <a *ngIf="isLoggedIn" routerLink="/mes-commandes" routerLinkActive="text-black font-bold" class="flex flex-col items-center gap-1 text-[11px]">
          <i class="fa-solid fa-receipt text-lg"></i>
          <span>Commandes</span>
        </a>
        <a *ngIf="isCook" routerLink="/backoffice/cuisiniere" class="flex flex-col items-center gap-1 text-[11px] text-[#B45309]">
          <i class="fa-solid fa-kitchen-set text-lg"></i>
          <span>Cuisine</span>
        </a>
        <a *ngIf="isAdmin" routerLink="/backoffice/admin" class="flex flex-col items-center gap-1 text-[11px] text-black">
          <i class="fa-solid fa-user-shield text-lg"></i>
          <span>Admin</span>
        </a>
      </div>
    </div>
  `
})
export class NavbarComponent implements OnInit {
  currentUser: User | null = null;
  cartCount = 0;

  constructor(
    private authService: AuthService,
    private cartService: CartService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
    this.cartService.items$.subscribe(() => {
      this.cartCount = this.cartService.getTotalCount();
    });
  }

  get isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  get isAdmin(): boolean {
    return this.authService.isAdmin();
  }

  get isCook(): boolean {
    return this.authService.isCook();
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
