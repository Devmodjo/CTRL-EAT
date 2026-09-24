import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="min-h-[85vh] flex items-center justify-center px-4 py-12 bg-slate-100">
      <div class="max-w-md w-full bg-white rounded-3xl p-8 shadow-xl border border-slate-200">
        
        <div class="text-center mb-8">
          <div class="w-12 h-12 rounded-2xl bg-orange-600 text-white font-bold text-xl flex items-center justify-center mx-auto mb-3 shadow-md">
            <i class="fa-solid fa-utensils"></i>
          </div>
          <h2 class="text-2xl font-black text-slate-900">Connexion Étudiant</h2>
          <p class="text-xs text-slate-500 mt-1">Connectez-vous pour passer vos précommandes de repas</p>
        </div>

        <div *ngIf="errorMessage" class="mb-4 bg-red-50 border border-red-200 text-red-700 text-xs p-3 rounded-xl flex items-center gap-2">
          <i class="fa-solid fa-triangle-exclamation text-base"></i>
          <span>{{ errorMessage }}</span>
        </div>

        <form (ngSubmit)="onSubmit()" class="space-y-4">
          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1">Nom d'utilisateur ou Email</label>
            <input type="text" [(ngModel)]="username" name="username" required
              class="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              placeholder="ex: jodelle">
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1">Mot de passe</label>
            <input type="password" [(ngModel)]="password" name="password" required
              class="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              placeholder="••••••••">
          </div>

          <button type="submit" [disabled]="loading"
            class="w-full bg-orange-600 hover:bg-orange-500 text-white font-bold py-3 rounded-xl shadow-md transition-all text-sm flex items-center justify-center gap-2">
            <i *ngIf="loading" class="fa-solid fa-circle-notch fa-spin"></i>
            <span>{{ loading ? 'Connexion...' : 'Se connecter' }}</span>
          </button>
        </form>

        <div class="mt-6 pt-4 border-t border-slate-100 flex flex-col items-center gap-2 text-xs text-slate-500">
          <div>
            Pas encore de compte ? 
            <a routerLink="/register" class="font-bold text-orange-600 hover:underline">S'inscrire ici</a>
          </div>

          <div class="mt-2">
            <a routerLink="/backoffice/login" class="text-slate-400 hover:text-slate-600 font-medium">
              <i class="fa-solid fa-lock text-[10px] mr-1"></i> Personnel du Back-Office ? Connexion ici
            </a>
          </div>
        </div>
      </div>
    </div>
  `
})
export class LoginComponent {
  username = '';
  password = '';
  loading = false;
  errorMessage = '';

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit(): void {
    if (!this.username || !this.password) {
      this.errorMessage = 'Veuillez saisir vos identifiants.';
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    this.authService.login({ username: this.username, password: this.password }).subscribe({
      next: (res) => {
        this.loading = false;
        if (res.user.role === 'ADMINISTRATEUR' || res.user.is_staff) {
          this.router.navigate(['/backoffice/admin']);
        } else if (res.user.role === 'CUISINIERE') {
          this.router.navigate(['/backoffice/cuisiniere']);
        } else {
          this.router.navigate(['/menu']);
        }
      },
      error: () => {
        this.loading = false;
        this.errorMessage = 'Nom d\'utilisateur ou mot de passe incorrect.';
      }
    });
  }
}
