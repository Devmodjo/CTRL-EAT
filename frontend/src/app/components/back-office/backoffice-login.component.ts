import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-backoffice-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="min-h-[85vh] flex items-center justify-center px-4 py-12 bg-slate-950 text-white">
      <div class="max-w-md w-full bg-slate-900 rounded-3xl p-8 shadow-2xl border border-slate-800 space-y-6">
        
        <!-- Header -->
        <div class="text-center">
          <div class="w-14 h-14 rounded-2xl bg-orange-600/20 border border-orange-500/40 text-orange-400 text-2xl font-bold flex items-center justify-center mx-auto mb-3 shadow-inner">
            <i class="fa-solid fa-user-shield"></i>
          </div>
          <span class="bg-slate-800 text-orange-400 border border-slate-700 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">
            Portail Personnel Sécurisé
          </span>
          <h2 class="text-2xl font-black text-white mt-3">Espace Back-Office</h2>
          <p class="text-xs text-slate-400 mt-1">Accès réservé aux Administrateurs et Cuisinières Ctrl+Eat</p>
        </div>

        <!-- Onglets Connexion / Inscription Personnel -->
        <div class="flex bg-slate-800 p-1 rounded-2xl border border-slate-700 text-xs font-bold">
          <button (click)="isRegistering = false" [class]="!isRegistering ? 'bg-orange-600 text-white shadow-md' : 'text-slate-400 hover:text-white'" class="flex-1 py-2 rounded-xl transition-all">
            Connexion Personnel
          </button>
          <button (click)="isRegistering = true" [class]="isRegistering ? 'bg-orange-600 text-white shadow-md' : 'text-slate-400 hover:text-white'" class="flex-1 py-2 rounded-xl transition-all">
            + Inscription Staff
          </button>
        </div>

        <!-- ENCADRÉ IDENTIFIANTS DE TEST DÉMO (1-Click Fill) -->
        <div class="bg-slate-800/80 border border-slate-700/80 p-4 rounded-2xl space-y-2 text-xs">
          <div class="flex items-center justify-between">
            <span class="font-bold text-orange-400 uppercase text-[10px] tracking-wider">
              <i class="fa-solid fa-key mr-1"></i> Identifiants de Test Démo
            </span>
            <span class="text-[10px] text-slate-400">Cliquez pour remplir</span>
          </div>

          <div class="grid grid-cols-2 gap-2 pt-1">
            <button type="button" (click)="fillCredentials('admin', 'admin')" class="bg-slate-900 hover:bg-slate-950 border border-slate-700 p-2 rounded-xl text-left transition-colors">
              <span class="font-bold text-white block text-xs">Administrateur</span>
              <span class="text-[10px] text-slate-400 font-mono">admin / admin</span>
            </button>

            <button type="button" (click)="fillCredentials('cuisiniere', 'cuisiniere')" class="bg-slate-900 hover:bg-slate-950 border border-slate-700 p-2 rounded-xl text-left transition-colors">
              <span class="font-bold text-amber-400 block text-xs">Cuisinière</span>
              <span class="text-[10px] text-slate-400 font-mono">cuisiniere / cuisiniere</span>
            </button>
          </div>
        </div>

        <!-- Messages d'erreur ou de succès -->
        <div *ngIf="errorMessage" class="bg-red-950/80 border border-red-700/60 text-red-200 text-xs p-3.5 rounded-xl flex items-center gap-2">
          <i class="fa-solid fa-shield-halved text-base text-red-400"></i>
          <span>{{ errorMessage }}</span>
        </div>

        <!-- FORMULAIRE 1: CONNEXION -->
        <form *ngIf="!isRegistering" (ngSubmit)="onLogin()" class="space-y-4">
          <div>
            <label class="block text-xs font-bold text-slate-300 mb-1">Identifiant Personnel</label>
            <input type="text" [(ngModel)]="username" name="username" required
              class="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-orange-500"
              placeholder="ex: admin ou cuisiniere">
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-300 mb-1">Mot de passe</label>
            <input type="password" [(ngModel)]="password" name="password" required
              class="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-orange-500"
              placeholder="••••••••">
          </div>

          <button type="submit" [disabled]="loading"
            class="w-full bg-orange-600 hover:bg-orange-500 text-white font-bold py-3 rounded-xl shadow-lg transition-all text-sm flex items-center justify-center gap-2">
            <i *ngIf="loading" class="fa-solid fa-circle-notch fa-spin"></i>
            <span>{{ loading ? 'Vérification...' : 'Se connecter au Back-Office' }}</span>
          </button>
        </form>

        <!-- FORMULAIRE 2: INSCRIPTION STAFF BACKOFFICE -->
        <form *ngIf="isRegistering" (ngSubmit)="onRegisterStaff()" class="space-y-3">
          <div>
            <label class="block text-xs font-bold text-slate-300 mb-1">Identifiant Staff</label>
            <input type="text" [(ngModel)]="regUsername" name="regUsername" required
              class="w-full px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:border-orange-500" placeholder="ex: chef_jodelle">
          </div>

          <div class="grid grid-cols-2 gap-2">
            <div>
              <label class="block text-xs font-bold text-slate-300 mb-1">Nom</label>
              <input type="text" [(ngModel)]="regName" name="regName" required
                class="w-full px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs">
            </div>
            <div>
              <label class="block text-xs font-bold text-slate-300 mb-1">Téléphone</label>
              <input type="text" [(ngModel)]="regPhone" name="regPhone" required
                class="w-full px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs" placeholder="699000000">
            </div>
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-300 mb-1">Rôle Back-Office</label>
            <select [(ngModel)]="regRole" name="regRole" class="w-full px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs">
              <option value="ADMINISTRATEUR">Administrateur (Gestion & Validation)</option>
              <option value="CUISINIERE">Cuisinière (Fiche de Production)</option>
            </select>
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-300 mb-1">Mot de passe</label>
            <input type="password" [(ngModel)]="regPassword" name="regPassword" required
              class="w-full px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs">
          </div>

          <button type="submit" [disabled]="loading"
            class="w-full bg-orange-600 hover:bg-orange-500 text-white font-bold py-2.5 rounded-xl text-xs mt-2 flex items-center justify-center gap-2">
            <i *ngIf="loading" class="fa-solid fa-circle-notch fa-spin"></i>
            <span>{{ loading ? 'Création...' : 'Créer le Compte Staff' }}</span>
          </button>
        </form>

        <div class="text-center pt-2 border-t border-slate-800">
          <a routerLink="/" class="text-xs text-slate-400 hover:text-slate-200 font-semibold">
            ← Retour au site public étudiant
          </a>
        </div>
      </div>
    </div>
  `
})
export class BackofficeLoginComponent {
  isRegistering = false;

  // Login Form
  username = '';
  password = '';

  // Staff Register Form
  regUsername = '';
  regName = '';
  regPhone = '699000000';
  regRole: 'ADMINISTRATEUR' | 'CUISINIERE' = 'ADMINISTRATEUR';
  regPassword = '';

  loading = false;
  errorMessage = '';

  constructor(private authService: AuthService, private router: Router) {}

  fillCredentials(u: string, p: string): void {
    this.isRegistering = false;
    this.username = u;
    this.password = p;
  }

  onLogin(): void {
    if (!this.username || !this.password) {
      this.errorMessage = 'Veuillez renseigner vos identifiants.';
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    this.authService.login({ username: this.username, password: this.password }).subscribe({
      next: (res) => {
        this.loading = false;
        const role = res.user.role;

        if (role === 'ADMINISTRATEUR' || res.user.is_staff || res.user.is_superuser) {
          this.router.navigate(['/backoffice/admin']);
        } else if (role === 'CUISINIERE') {
          this.router.navigate(['/backoffice/cuisiniere']);
        } else {
          this.authService.logout();
          this.errorMessage = 'Accès refusé : Ce portail est réservé au personnel du back-office.';
        }
      },
      error: () => {
        this.loading = false;
        this.errorMessage = 'Identifiants du personnel incorrects.';
      }
    });
  }

  onRegisterStaff(): void {
    if (!this.regUsername || !this.regPassword) {
      this.errorMessage = 'Veuillez remplir les champs obligatoires.';
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    this.authService.backofficeRegister({
      username: this.regUsername,
      password: this.regPassword,
      name: this.regName,
      phone: this.regPhone,
      role: this.regRole
    }).subscribe({
      next: (res) => {
        this.loading = false;
        if (res.user.role === 'ADMINISTRATEUR') {
          this.router.navigate(['/backoffice/admin']);
        } else {
          this.router.navigate(['/backoffice/cuisiniere']);
        }
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err.error?.detail || 'Erreur lors de la création du compte personnel.';
      }
    });
  }
}
