import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="min-h-[85vh] flex items-center justify-center px-4 py-12 bg-slate-100">
      <div class="max-w-lg w-full bg-white rounded-3xl p-8 shadow-xl border border-slate-200">
        
        <div class="text-center mb-6">
          <div class="w-12 h-12 rounded-2xl bg-orange-600 text-white font-bold text-xl flex items-center justify-center mx-auto mb-3 shadow-md">
            <i class="fa-solid fa-graduation-cap"></i>
          </div>
          <h2 class="text-2xl font-black text-slate-900">Inscription Étudiant Ctrl+Eat</h2>
          <p class="text-xs text-slate-500 mt-1">Créez votre compte pour précommander vos repas sur le campus IAI</p>
        </div>

        <div *ngIf="errorMessage" class="mb-4 bg-red-50 border border-red-200 text-red-700 text-xs p-3 rounded-xl flex items-center gap-2">
          <i class="fa-solid fa-triangle-exclamation text-base"></i>
          <span>{{ errorMessage }}</span>
        </div>

        <form (ngSubmit)="onSubmit()" class="space-y-3">
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-bold text-slate-700 mb-1">Nom</label>
              <input type="text" [(ngModel)]="name" name="name" required
                class="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-orange-500" placeholder="ex: MBANGA">
            </div>
            <div>
              <label class="block text-xs font-bold text-slate-700 mb-1">Prénom</label>
              <input type="text" [(ngModel)]="surname" name="surname" required
                class="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-orange-500" placeholder="ex: Jodelle">
            </div>
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1">Nom d'utilisateur</label>
            <input type="text" [(ngModel)]="username" name="username" required
              class="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-orange-500" placeholder="ex: jodelle">
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-bold text-slate-700 mb-1">Classe / Filière</label>
              <input type="text" [(ngModel)]="classe" name="classe" required
                class="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-orange-500" placeholder="ex: L3 GL IAI">
            </div>
            <div>
              <label class="block text-xs font-bold text-slate-700 mb-1">Numéro Téléphone / Mobile Money</label>
              <input type="text" [(ngModel)]="phone" name="phone" required
                class="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-orange-500" placeholder="ex: 699000000">
            </div>
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1">Mot de passe</label>
            <input type="password" [(ngModel)]="password" name="password" required
              class="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-orange-500" placeholder="••••••••">
          </div>

          <button type="submit" [disabled]="loading"
            class="w-full bg-orange-600 hover:bg-orange-500 text-white font-bold py-3 rounded-xl shadow-md transition-all text-sm mt-2 flex items-center justify-center gap-2">
            <i *ngIf="loading" class="fa-solid fa-circle-notch fa-spin"></i>
            <span>{{ loading ? 'Création de votre compte...' : 'Créer mon compte Étudiant' }}</span>
          </button>
        </form>

        <div class="mt-5 text-center text-xs text-slate-500">
          Déjà inscrit ? 
          <a routerLink="/login" class="font-bold text-orange-600 hover:underline">Se connecter</a>
        </div>
      </div>
    </div>
  `
})
export class RegisterComponent {
  username = '';
  name = '';
  surname = '';
  classe = 'L3 GL IAI';
  phone = '';
  password = '';
  loading = false;
  errorMessage = '';

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit(): void {
    if (!this.username || !this.name || !this.password || !this.phone) {
      this.errorMessage = 'Veuillez remplir tous les champs obligatoires.';
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    const payload = {
      username: this.username,
      name: this.name,
      surname: this.surname,
      classe: this.classe,
      phone: this.phone,
      password: this.password
    };

    this.authService.register(payload).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/menu']);
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err.error?.detail || 'Erreur lors de l\'inscription. Nom d\'utilisateur déjà utilisé.';
      }
    });
  }
}
