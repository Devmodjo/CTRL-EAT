import { Routes } from '@angular/router';
import { VitrineComponent } from './components/vitrine/vitrine.component';
import { LoginComponent } from './components/auth/login.component';
import { RegisterComponent } from './components/auth/register.component';
import { CatalogComponent } from './components/client/catalog.component';
import { PanierComponent } from './components/client/panier.component';
import { MesCommandesComponent } from './components/client/mes-commandes.component';

import { BackofficeLoginComponent } from './components/back-office/backoffice-login.component';
import { AdminDashboardComponent } from './components/back-office/admin-dashboard.component';
import { ValidationPaiementComponent } from './components/back-office/validation-paiement.component';
import { CuisiniereDashboardComponent } from './components/back-office/cuisiniere-dashboard.component';

import { authGuard } from './guards/auth.guard';
import { adminGuard } from './guards/admin.guard';
import { cookGuard } from './guards/cook.guard';

export const routes: Routes = [
  // Espace Public & Étudiant
  { path: '', component: VitrineComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'menu', component: CatalogComponent },
  { path: 'panier', component: PanierComponent },
  { path: 'mes-commandes', component: MesCommandesComponent, canActivate: [authGuard] },
  
  // Espace Sécurisé Personnel Backoffice
  { path: 'backoffice/login', component: BackofficeLoginComponent },
  { path: 'backoffice/admin', component: AdminDashboardComponent, canActivate: [adminGuard] },
  { path: 'backoffice/validation-paiement', component: ValidationPaiementComponent, canActivate: [adminGuard] },
  { path: 'backoffice/cuisiniere', component: CuisiniereDashboardComponent, canActivate: [cookGuard] },
  
  { path: '**', redirectTo: '' }
];
