import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { PlatService } from '../../services/plat.service';
import { CommandeService } from '../../services/commande.service';
import { ClientService } from '../../services/client.service';
import { PlatCompteur } from '../../models/plat.model';
import { Commande, CommandeStatus } from '../../models/commande.model';
import { ClientProfile } from '../../models/user.model';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 mb-20">
      
      <!-- Uber Eats Executive Header -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 bg-black text-white p-6 sm:p-8 rounded-3xl shadow-xl">
        <div class="space-y-1">
          <div class="inline-flex items-center gap-2 bg-[#06C167]/20 border border-[#06C167]/40 px-3 py-1 rounded-full text-xs text-[#06C167] font-bold">
            <i class="fa-solid fa-shield-halved"></i> Espace Administrateur
          </div>
          <h1 class="text-2xl sm:text-3xl font-black tracking-tight">Tableau de Bord Ctrl+Eat</h1>
          <p class="text-gray-400 text-xs sm:text-sm">Supervision des menus, des commandes et de la gestion des utilisateurs</p>
        </div>

        <div class="flex items-center gap-3">
          <a routerLink="/backoffice/validation-paiement" class="bg-[#06C167] hover:bg-[#05A357] text-white font-bold px-5 py-3 rounded-full text-xs transition-all shadow-md flex items-center gap-2">
            <i class="fa-solid fa-file-invoice-dollar text-sm"></i> Valider les Paiements
          </a>
          <button (click)="openAddModal()" class="bg-white hover:bg-gray-100 text-black font-bold px-5 py-3 rounded-full text-xs transition-all shadow-md flex items-center gap-2">
            <i class="fa-solid fa-plus text-sm"></i> Ajouter un Plat
          </button>
        </div>
      </div>

      <!-- Quick KPI Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <div class="bg-[#F6F6F6] p-6 rounded-3xl border border-[#E8E8E8] flex items-center justify-between">
          <div>
            <span class="text-[10px] font-black text-gray-400 block uppercase tracking-wider">Plats au Menu</span>
            <span class="text-3xl font-black text-black">{{ plats.length }}</span>
          </div>
          <div class="w-12 h-12 rounded-2xl bg-white border border-[#E8E8E8] text-black flex items-center justify-center text-xl shadow-sm">
            <i class="fa-solid fa-utensils"></i>
          </div>
        </div>

        <div class="bg-[#F6F6F6] p-6 rounded-3xl border border-[#E8E8E8] flex items-center justify-between">
          <div>
            <span class="text-[10px] font-black text-gray-400 block uppercase tracking-wider">Commandes Totales</span>
            <span class="text-3xl font-black text-black">{{ commandes.length }}</span>
          </div>
          <div class="w-12 h-12 rounded-2xl bg-white border border-[#E8E8E8] text-[#06C167] flex items-center justify-center text-xl shadow-sm">
            <i class="fa-solid fa-bag-shopping"></i>
          </div>
        </div>

        <div class="bg-[#F6F6F6] p-6 rounded-3xl border border-[#E8E8E8] flex items-center justify-between">
          <div>
            <span class="text-[10px] font-black text-gray-400 block uppercase tracking-wider">Étudiants Inscrits</span>
            <span class="text-3xl font-black text-black">{{ clients.length }}</span>
          </div>
          <div class="w-12 h-12 rounded-2xl bg-white border border-[#E8E8E8] text-blue-600 flex items-center justify-center text-xl shadow-sm">
            <i class="fa-solid fa-users"></i>
          </div>
        </div>
      </div>

      <!-- Navigation Tabs -->
      <div class="flex gap-2 border-b border-[#EEEEEE] mb-8 overflow-x-auto pb-2">
        <button (click)="activeTab = 'plats'" [class]="activeTab === 'plats' ? tabActiveStyle : tabInactiveStyle">
          <i class="fa-solid fa-burger mr-1.5"></i> Plats au Menu ({{ plats.length }})
        </button>
        <button (click)="activeTab = 'commandes'" [class]="activeTab === 'commandes' ? tabActiveStyle : tabInactiveStyle">
          <i class="fa-solid fa-list-check mr-1.5"></i> Commandes ({{ commandes.length }})
        </button>
        <button (click)="activeTab = 'clients'" [class]="activeTab === 'clients' ? tabActiveStyle : tabInactiveStyle">
          <i class="fa-solid fa-users mr-1.5"></i> Étudiants ({{ clients.length }})
        </button>
      </div>

      <!-- TAB 1: GESTION DES PLATS -->
      <div *ngIf="activeTab === 'plats'" class="space-y-6">
        
        <div *ngIf="loadingPlats" class="text-center py-16">
          <i class="fa-solid fa-circle-notch fa-spin text-3xl text-black"></i>
          <p class="text-gray-500 text-xs font-semibold mt-3">Chargement des plats...</p>
        </div>

        <div *ngIf="!loadingPlats" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <div *ngFor="let plat of plats" class="bg-white rounded-2xl overflow-hidden border border-[#EEEEEE] uber-card flex flex-col justify-between">
            <div>
              <div class="relative h-48 bg-[#F6F6F6]">
                <img *ngIf="plat.image" [src]="plat.image" [alt]="plat.name" class="w-full h-full object-cover">
                <div *ngIf="!plat.image" class="w-full h-full flex items-center justify-center text-gray-400">
                  <i class="fa-solid fa-bowl-food text-4xl"></i>
                </div>

                <div class="absolute top-3 right-3 bg-black/90 text-white text-xs font-black px-3.5 py-1.5 rounded-full shadow">
                  {{ plat.price }} FCFA
                </div>

                <div class="absolute top-3 left-3">
                  <span [class]="plat.disponibility ? 'bg-[#06C167] text-white' : 'bg-red-600 text-white'" class="text-[10px] font-bold px-3 py-1 rounded-full uppercase shadow">
                    {{ plat.disponibility ? 'Disponible' : 'Indisponible' }}
                  </span>
                </div>
              </div>

              <div class="p-5">
                <h3 class="font-black text-black text-lg mb-2">{{ plat.name }}</h3>
                <div class="text-xs font-bold text-[#06C167] bg-[#E6F8F0] border border-[#A7F3D0] px-3.5 py-2 rounded-full w-fit flex items-center gap-2">
                  <i class="fa-solid fa-fire text-amber-500"></i>
                  <span>{{ plat.commandes_demain_count }} réservations pour demain</span>
                </div>
              </div>
            </div>

            <!-- Actions Edit & Delete -->
            <div class="p-5 pt-0 flex gap-3">
              <button (click)="openEditModal(plat)" class="flex-1 bg-[#F6F6F6] hover:bg-[#EEEEEE] text-black font-bold py-2.5 rounded-full text-xs transition-colors flex items-center justify-center gap-1.5">
                <i class="fa-solid fa-pen-to-square"></i> Modifier
              </button>
              <button (click)="deletePlat(plat.id)" class="bg-red-50 hover:bg-red-100 text-red-600 font-bold px-4 py-2.5 rounded-full text-xs transition-colors">
                <i class="fa-solid fa-trash-can"></i>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- TAB 2: SUPERVISION DES COMMANDES -->
      <div *ngIf="activeTab === 'commandes'" class="space-y-6">
        <div class="bg-white rounded-3xl border border-[#EEEEEE] shadow-sm overflow-hidden">
          <div class="p-6 border-b border-[#EEEEEE] flex flex-col sm:flex-row justify-between sm:items-center gap-4">
            <h3 class="font-black text-black text-lg">Supervision des Commandes</h3>
            
            <div class="flex items-center gap-2">
              <span class="text-xs font-bold text-gray-500">Statut :</span>
              <select [(ngModel)]="statusFilter" (change)="fetchCommandes()" class="bg-[#F6F6F6] border border-[#E8E8E8] text-xs font-bold rounded-full px-4 py-2 text-black">
                <option value="">Toutes les commandes</option>
                <option value="EN_ATTENTE">En attente de paiement</option>
                <option value="CONFIRMER">Confirmée / Payée</option>
                <option value="EN_PREPARATION">En préparation</option>
                <option value="PRETE">Prête à livrer</option>
                <option value="LIVREE">Livrée</option>
              </select>
            </div>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full text-left text-xs text-gray-600">
              <thead class="bg-[#F6F6F6] text-black font-bold uppercase tracking-wider border-b border-[#E8E8E8]">
                <tr>
                  <th class="p-4">Réf</th>
                  <th class="p-4">Étudiant</th>
                  <th class="p-4">Portions</th>
                  <th class="p-4">Montant</th>
                  <th class="p-4">Livraison</th>
                  <th class="p-4">Paiement</th>
                  <th class="p-4">Statut</th>
                  <th class="p-4 text-right">Action Statut</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-[#EEEEEE]">
                <tr *ngFor="let cmd of commandes" class="hover:bg-[#F6F6F6] transition-colors">
                  <td class="p-4 font-mono font-bold text-black">#{{ cmd.id.substring(0, 8) }}</td>
                  <td class="p-4">
                    <span class="font-bold text-black block text-sm">{{ cmd.client_detail?.name }} {{ cmd.client_detail?.surname }}</span>
                    <span class="text-[11px] text-gray-400 font-semibold">{{ cmd.client_detail?.phone }} • {{ cmd.client_detail?.classe }}</span>
                  </td>
                  <td class="p-4 font-bold text-black text-sm">{{ cmd.quantity }} portion(s)</td>
                  <td class="p-4 font-black text-black text-sm">{{ cmd.total_price }} FCFA</td>
                  <td class="p-4 font-semibold text-gray-700">{{ cmd.date_livraison | date:'dd/MM/yyyy' }} à 12h00</td>
                  <td class="p-4">
                    <span *ngIf="cmd.payment_verified" class="text-[#06C167] font-bold flex items-center gap-1">
                      <i class="fa-solid fa-circle-check"></i> Payé
                    </span>
                    <span *ngIf="!cmd.payment_verified" class="text-amber-600 font-bold flex items-center gap-1">
                      <i class="fa-solid fa-clock"></i> En attente
                    </span>
                  </td>
                  <td class="p-4">
                    <span class="status-pill status-{{ cmd.status }}">{{ cmd.status_display }}</span>
                  </td>
                  <td class="p-4 text-right">
                    <select [ngModel]="cmd.status" (ngModelChange)="updateStatus(cmd.id, $event)" class="bg-white border border-[#E8E8E8] rounded-full text-xs p-2 font-bold text-black shadow-sm">
                      <option value="EN_ATTENTE">En attente</option>
                      <option value="CONFIRMER">Confirmée</option>
                      <option value="EN_PREPARATION">En préparation</option>
                      <option value="PRETE">Prête</option>
                      <option value="LIVREE">Livrée</option>
                      <option value="ANNULEE">Annulée</option>
                    </select>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- TAB 3: ÉTUDIANTS / UTILISATEURS -->
      <div *ngIf="activeTab === 'clients'" class="space-y-6">
        <div class="bg-white rounded-3xl border border-[#EEEEEE] shadow-sm overflow-hidden p-6">
          <h3 class="font-black text-black text-lg mb-4">Comptes Étudiants Enregistrés</h3>
          
          <div *ngIf="loadingClients" class="text-center py-12">
            <i class="fa-solid fa-circle-notch fa-spin text-3xl text-black"></i>
          </div>

          <div *ngIf="!loadingClients" class="overflow-x-auto">
            <table class="w-full text-left text-xs text-gray-600">
              <thead class="bg-[#F6F6F6] text-black font-bold uppercase border-b border-[#E8E8E8]">
                <tr>
                  <th class="p-4">ID Client</th>
                  <th class="p-4">Nom & Prénom</th>
                  <th class="p-4">Username</th>
                  <th class="p-4">Classe / Filière</th>
                  <th class="p-4">Téléphone Mobile Money</th>
                  <th class="p-4">Rôle</th>
                  <th class="p-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-[#EEEEEE]">
                <tr *ngFor="let client of clients" class="hover:bg-[#F6F6F6]">
                  <td class="p-4 font-mono font-bold text-gray-800">{{ client.id.substring(0, 8) }}</td>
                  <td class="p-4 font-bold text-black text-sm">{{ client.name }} {{ client.surname }}</td>
                  <td class="p-4 font-semibold text-gray-600">{{ client.username }}</td>
                  <td class="p-4 font-semibold text-gray-700">{{ client.classe }}</td>
                  <td class="p-4 font-mono font-bold text-black">{{ client.phone }}</td>
                  <td class="p-4">
                    <span class="bg-[#F6F6F6] text-black border border-[#E8E8E8] px-3 py-1 rounded-full font-bold text-[11px]">
                      {{ client.role_display || client.role }}
                    </span>
                  </td>
                  <td class="p-4 text-right">
                    <button (click)="deleteClient(client.id)" class="text-red-600 hover:text-red-800 font-bold hover:underline">
                      <i class="fa-solid fa-trash-can mr-1"></i> Supprimer
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- MODAL PLAT NETTOYÉE (NO TECHNICAL LABELS) -->
      <div *ngIf="showModal" class="fixed inset-0 bg-black/70 modal-backdrop z-50 flex items-center justify-center p-4">
        <div class="bg-white rounded-3xl max-w-lg w-full p-8 shadow-2xl space-y-6 border border-[#EEEEEE] fade-in">
          
          <div class="flex justify-between items-center border-b border-[#EEEEEE] pb-4">
            <div>
              <h3 class="font-black text-xl text-black">{{ isEditing ? 'Modifier le Plat' : 'Nouveau Plat au Menu' }}</h3>
              <p class="text-xs text-gray-500 mt-0.5">Entrez les informations du repas pour le campus</p>
            </div>
            <button (click)="showModal = false" class="w-9 h-9 rounded-full bg-[#F6F6F6] hover:bg-[#EEEEEE] text-black flex items-center justify-center transition-colors">
              <i class="fa-solid fa-xmark text-lg"></i>
            </button>
          </div>

          <form (ngSubmit)="savePlat()" class="space-y-4">
            <div>
              <label class="block text-xs font-bold text-black mb-1">Nom du plat *</label>
              <input type="text" [(ngModel)]="platForm.name" name="name" required placeholder="ex: Riz Sauce Poulet DG" class="w-full px-4 py-3 rounded-full bg-[#F6F6F6] border border-[#E8E8E8] text-sm font-semibold text-black focus:outline-none focus:border-black">
            </div>

            <div>
              <label class="block text-xs font-bold text-black mb-1">Prix (FCFA) *</label>
              <input type="number" [(ngModel)]="platForm.price" name="price" required placeholder="ex: 1500" class="w-full px-4 py-3 rounded-full bg-[#F6F6F6] border border-[#E8E8E8] text-sm font-semibold text-black focus:outline-none focus:border-black">
            </div>

            <div>
              <label class="block text-xs font-bold text-black mb-1">Description / Ingrédients</label>
              <textarea [(ngModel)]="platForm.details" name="details" rows="2" placeholder="ex: Servie avec banane plantain frite..." class="w-full px-4 py-3 rounded-2xl bg-[#F6F6F6] border border-[#E8E8E8] text-xs font-semibold text-black focus:outline-none focus:border-black"></textarea>
            </div>

            <div>
              <label class="block text-xs font-bold text-black mb-1">Photo du plat</label>
              <input type="file" (change)="onImageSelected($event)" accept="image/*" class="block w-full text-xs text-gray-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-[#000000] file:text-white hover:file:bg-[#222222] cursor-pointer">
            </div>

            <div class="flex items-center gap-2 pt-2">
              <input type="checkbox" [(ngModel)]="platForm.disponibility" name="disponibility" id="disp" class="w-4 h-4 text-black rounded">
              <label for="disp" class="text-xs font-bold text-black">Disponible à la précommande</label>
            </div>

            <!-- Action Buttons -->
            <div class="flex gap-3 pt-4 border-t border-[#EEEEEE]">
              <button type="button" (click)="showModal = false" class="flex-1 bg-[#F6F6F6] hover:bg-[#EEEEEE] text-black font-bold py-3.5 rounded-full text-xs transition-colors">
                Annuler
              </button>
              <button type="submit" [disabled]="saving" class="flex-1 bg-[#06C167] hover:bg-[#05A357] text-white font-bold py-3.5 rounded-full text-xs shadow-lg transition-transform active:scale-95 flex items-center justify-center gap-2">
                <i *ngIf="saving" class="fa-solid fa-circle-notch fa-spin"></i>
                <span>{{ saving ? 'Enregistrement...' : 'Enregistrer le Plat' }}</span>
              </button>
            </div>
          </form>
        </div>
      </div>

    </div>
  `
})
export class AdminDashboardComponent implements OnInit {
  activeTab: 'plats' | 'commandes' | 'clients' = 'plats';
  tabActiveStyle = 'bg-black text-white font-bold px-5 py-2.5 rounded-full text-xs shadow-sm';
  tabInactiveStyle = 'bg-[#F6F6F6] text-black hover:bg-[#EEEEEE] font-bold px-5 py-2.5 rounded-full text-xs';

  plats: PlatCompteur[] = [];
  commandes: Commande[] = [];
  clients: ClientProfile[] = [];
  
  loadingPlats = true;
  loadingClients = true;
  statusFilter = '';

  // Modal State
  showModal = false;
  isEditing = false;
  editingPlatId: string | null = null;
  platForm = {
    name: '',
    price: 1500,
    details: '',
    disponibility: true
  };
  selectedImageFile: File | null = null;
  saving = false;

  constructor(
    private platService: PlatService,
    private commandeService: CommandeService,
    private clientService: ClientService
  ) {}

  ngOnInit(): void {
    this.fetchPlats();
    this.fetchCommandes();
    this.fetchClients();
  }

  fetchPlats(): void {
    this.platService.getCompteurs().subscribe({
      next: (data) => {
        this.plats = data;
        this.loadingPlats = false;
      },
      error: () => this.loadingPlats = false
    });
  }

  fetchCommandes(): void {
    this.commandeService.getCommandes(undefined, this.statusFilter as CommandeStatus).subscribe({
      next: (data) => this.commandes = data
    });
  }

  fetchClients(): void {
    this.clientService.getClients().subscribe({
      next: (data) => {
        this.clients = data;
        this.loadingClients = false;
      },
      error: () => this.loadingClients = false
    });
  }

  deleteClient(id: string): void {
    if (confirm('Supprimer cet utilisateur ?')) {
      this.clientService.deleteClient(id).subscribe({
        next: () => this.fetchClients()
      });
    }
  }

  openAddModal(): void {
    this.isEditing = false;
    this.editingPlatId = null;
    this.platForm = { name: '', price: 1500, details: '', disponibility: true };
    this.selectedImageFile = null;
    this.showModal = true;
  }

  openEditModal(plat: PlatCompteur): void {
    this.isEditing = true;
    this.editingPlatId = plat.id;
    this.platForm = {
      name: plat.name,
      price: plat.price,
      details: '',
      disponibility: plat.disponibility
    };
    this.selectedImageFile = null;
    this.showModal = true;
  }

  onImageSelected(event: any): void {
    const file = event.target.files[0];
    if (file) this.selectedImageFile = file;
  }

  savePlat(): void {
    if (!this.platForm.name || !this.platForm.price) return;

    this.saving = true;
    const formData = new FormData();
    formData.append('name', this.platForm.name);
    formData.append('price', this.platForm.price.toString());
    formData.append('details', this.platForm.details);
    formData.append('disponibility', this.platForm.disponibility.toString());
    if (this.selectedImageFile) {
      formData.append('image', this.selectedImageFile);
    }

    if (this.isEditing && this.editingPlatId) {
      this.platService.updatePlat(this.editingPlatId, formData).subscribe({
        next: () => {
          this.saving = false;
          this.showModal = false;
          this.fetchPlats();
        },
        error: () => this.saving = false
      });
    } else {
      this.platService.createPlat(formData).subscribe({
        next: () => {
          this.saving = false;
          this.showModal = false;
          this.fetchPlats();
        },
        error: () => this.saving = false
      });
    }
  }

  deletePlat(id: string): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce plat ?')) {
      this.platService.deletePlat(id).subscribe({
        next: () => this.fetchPlats()
      });
    }
  }

  updateStatus(commandeId: string, newStatus: CommandeStatus): void {
    this.commandeService.updateCommandeStatus(commandeId, newStatus).subscribe({
      next: () => this.fetchCommandes()
    });
  }
}
