import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { CommandeService } from '../../services/commande.service';
import { AuthService } from '../../services/auth.service';
import { CartItem } from '../../models/cart.model';

@Component({
  selector: 'app-panier',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mb-20">
      
      <div class="flex items-center justify-between mb-8 pb-4 border-b border-[#EEEEEE]">
        <h1 class="text-3xl font-black text-black tracking-tight flex items-center gap-3">
          <i class="fa-solid fa-basket-shopping text-[#06C167]"></i> Mon Panier & Commande
        </h1>

        <a routerLink="/menu" class="text-xs font-bold text-black hover:text-[#06C167] underline">
          + Ajouter d'autres plats
        </a>
      </div>

      <!-- Error alert -->
      <div *ngIf="errorMessage" class="mb-6 bg-red-50 border border-red-200 text-red-700 text-xs p-4 rounded-2xl flex items-center gap-3">
        <i class="fa-solid fa-circle-exclamation text-lg"></i>
        <span>{{ errorMessage }}</span>
      </div>

      <!-- Panier vide -->
      <div *ngIf="items.length === 0 && !createdCommande" class="bg-[#F6F6F6] rounded-3xl p-12 text-center border border-[#E8E8E8]">
        <i class="fa-solid fa-cart-shopping text-5xl text-gray-400 mb-4"></i>
        <h2 class="text-xl font-bold text-black">Votre panier est vide</h2>
        <p class="text-gray-500 text-xs mt-1 mb-6">Ajoutez des portions au panier depuis le menu du campus.</p>
        <a routerLink="/menu" class="bg-black hover:bg-[#222222] text-white font-bold px-6 py-3 rounded-full text-xs transition-colors inline-block shadow-md">
          Consulter le Menu
        </a>
      </div>

      <!-- Items & Checkout Box -->
      <div *ngIf="items.length > 0 && !createdCommande" class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <!-- Articles dans le panier -->
        <div class="lg:col-span-2 space-y-4">
          <div *ngFor="let item of items" class="bg-white p-5 rounded-2xl border border-[#EEEEEE] flex items-center justify-between gap-4 uber-card">
            
            <div class="flex items-center gap-4">
              <div class="w-16 h-16 rounded-xl bg-[#F6F6F6] overflow-hidden shrink-0">
                <img *ngIf="item.plat.image" [src]="item.plat.image" [alt]="item.plat.name" class="w-full h-full object-cover">
                <div *ngIf="!item.plat.image" class="w-full h-full flex items-center justify-center text-gray-400">
                  <i class="fa-solid fa-utensils text-2xl"></i>
                </div>
              </div>
              <div>
                <h3 class="font-bold text-black text-base leading-tight">{{ item.plat.name }}</h3>
                <p class="text-black font-black text-xs mt-0.5">{{ item.plat.price }} FCFA / portion</p>
              </div>
            </div>

            <!-- Stepper -->
            <div class="flex items-center gap-3">
              <div class="flex items-center bg-[#F6F6F6] rounded-full p-1 border border-[#E8E8E8]">
                <button (click)="updateQuantity(item.plat.id, item.quantity - 1)" class="w-7 h-7 flex items-center justify-center rounded-full text-black hover:bg-white text-xs font-bold transition-colors">
                  -
                </button>
                <span class="w-7 text-center text-xs font-black text-black">{{ item.quantity }}</span>
                <button (click)="updateQuantity(item.plat.id, item.quantity + 1)" class="w-7 h-7 flex items-center justify-center rounded-full text-black hover:bg-white text-xs font-bold transition-colors">
                  +
                </button>
              </div>

              <button (click)="removeItem(item.plat.id)" class="text-gray-400 hover:text-red-600 p-2 text-xs">
                <i class="fa-solid fa-trash-can"></i>
              </button>
            </div>
          </div>

          <div class="bg-white p-5 rounded-2xl border border-[#EEEEEE] space-y-2">
            <label class="block text-xs font-bold text-black">Instructions pour la livraison campus (Optionnel)</label>
            <textarea [(ngModel)]="notes" rows="2" placeholder="ex: Livrer au bloc génie logiciel..." class="w-full p-3 rounded-xl bg-[#F6F6F6] border border-[#E8E8E8] text-xs focus:outline-none focus:bg-white focus:border-black font-semibold text-black"></textarea>
          </div>
        </div>

        <!-- Order Summary Box -->
        <div class="bg-black text-white p-6 rounded-3xl shadow-xl h-fit space-y-6">
          <h2 class="text-lg font-black border-b border-gray-800 pb-3">Récapitulatif de commande</h2>

          <div class="space-y-3 text-xs text-gray-300">
            <div class="flex justify-between">
              <span>Sous-total ({{ totalCount }} repas)</span>
              <span class="font-bold text-white">{{ totalPrice }} FCFA</span>
            </div>
            <div class="flex justify-between">
              <span>Livraison (Cour Principale)</span>
              <span class="text-[#06C167] font-bold">Gratuite</span>
            </div>
            <div class="flex justify-between border-t border-gray-800 pt-3 text-sm">
              <span class="font-bold text-white">Total</span>
              <span class="font-black text-[#06C167] text-xl">{{ totalPrice }} FCFA</span>
            </div>
          </div>

          <div class="bg-gray-900 p-4 rounded-2xl text-[11px] text-gray-300 space-y-1 border border-gray-800">
            <p class="font-bold text-[#06C167]"><i class="fa-solid fa-clock mr-1"></i> Règle des 22h00</p>
            <p>Commande passée avant 22h00 = Livraison garantie demain à 12h00.</p>
          </div>

          <button (click)="validerPanier()" [disabled]="submitting"
            class="w-full bg-[#06C167] hover:bg-[#05A357] text-white font-bold py-4 rounded-full text-xs shadow-lg transition-transform active:scale-95 flex items-center justify-center gap-2">
            <i *ngIf="submitting" class="fa-solid fa-circle-notch fa-spin"></i>
            <span>{{ submitting ? 'Validation...' : 'Valider ma commande' }}</span>
          </button>
        </div>
      </div>

      <!-- ÉTAPE PAIEMENT MOBILE MONEY & REÇU -->
      <div *ngIf="createdCommande" class="bg-white rounded-3xl p-6 sm:p-8 border border-[#EEEEEE] shadow-xl space-y-6 fade-in">
        
        <div class="bg-[#E6F8F0] border border-[#A7F3D0] text-[#06C167] p-5 rounded-2xl flex items-center gap-3">
          <i class="fa-solid fa-circle-check text-3xl shrink-0"></i>
          <div>
            <h3 class="font-black text-base text-black">Commande #{{ createdCommande.id.substring(0,8) }} créée avec succès !</h3>
            <p class="text-xs text-gray-600 mt-0.5">{{ createdCommande.note_limite_heure || createdCommande.message_livraison }}</p>
          </div>
        </div>

        <div class="bg-black text-white p-6 rounded-3xl space-y-4">
          <div class="flex items-center justify-between">
            <h3 class="font-black text-lg text-[#06C167] flex items-center gap-2">
              <i class="fa-solid fa-mobile-screen-button"></i> Transfert Mobile Money
            </h3>
            <span class="text-xs font-black text-white bg-[#06C167] px-3.5 py-1 rounded-full">
              {{ createdCommande.total_price }} FCFA
            </span>
          </div>

          <p class="text-xs text-gray-300">
            Transférez le montant exact de <strong class="text-white">{{ createdCommande.total_price }} FCFA</strong> vers l'un des numéros ci-dessous puis joignez votre capture d'écran.
          </p>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <!-- Orange Money -->
            <div class="bg-gray-900 border border-gray-800 p-4 rounded-2xl flex items-center gap-3">
              <div class="w-10 h-10 rounded-full bg-[#FF6600] text-white font-black flex items-center justify-center text-xs shrink-0">
                OM
              </div>
              <div>
                <p class="text-[10px] text-gray-400 font-bold uppercase">Orange Money</p>
                <p class="text-base font-black text-white">699 00 00 00</p>
                <p class="text-[10px] text-gray-400">Ctrl+Eat / Jodelle</p>
              </div>
            </div>

            <!-- MTN MOMO -->
            <div class="bg-gray-900 border border-gray-800 p-4 rounded-2xl flex items-center gap-3">
              <div class="w-10 h-10 rounded-full bg-[#FFCC00] text-black font-black flex items-center justify-center text-xs shrink-0">
                MOMO
              </div>
              <div>
                <p class="text-[10px] text-gray-400 font-bold uppercase">MTN Mobile Money</p>
                <p class="text-base font-black text-white">677 00 00 00</p>
                <p class="text-[10px] text-gray-400">Ctrl+Eat / Jodelle</p>
              </div>
            </div>
          </div>
        </div>

        <!-- File Upload Box -->
        <div class="bg-[#F6F6F6] border-2 border-dashed border-gray-300 p-8 rounded-3xl text-center space-y-3">
          <i class="fa-solid fa-cloud-arrow-up text-4xl text-black"></i>
          <div>
            <p class="text-sm font-black text-black">Téléverser la capture d'écran du reçu</p>
            <p class="text-xs text-gray-500">PNG, JPG, JPEG</p>
          </div>

          <input type="file" (change)="onFileSelected($event)" accept="image/*" class="block w-full text-xs text-gray-500 file:mr-4 file:py-2.5 file:px-5 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-black file:text-white hover:file:bg-[#222222] cursor-pointer">

          <div *ngIf="selectedFile" class="text-xs font-bold text-[#06C167] bg-[#E6F8F0] py-2 px-4 rounded-full inline-block">
            Reçu sélectionné : {{ selectedFile.name }}
          </div>
        </div>

        <div class="flex flex-col sm:flex-row gap-4 pt-2">
          <button (click)="uploadProof()" [disabled]="!selectedFile || uploading"
            class="flex-1 bg-[#06C167] hover:bg-[#05A357] text-white font-bold py-4 rounded-full text-xs shadow-lg transition-transform active:scale-95 flex items-center justify-center gap-2">
            <i *ngIf="uploading" class="fa-solid fa-circle-notch fa-spin"></i>
            <span>{{ uploading ? 'Envoi...' : 'Envoyer la preuve de paiement' }}</span>
          </button>
          
          <a routerLink="/mes-commandes" class="bg-[#F6F6F6] hover:bg-[#EEEEEE] text-black font-bold py-4 px-6 rounded-full text-xs text-center">
            Voir mes commandes
          </a>
        </div>
      </div>

    </div>
  `
})
export class PanierComponent implements OnInit {
  items: CartItem[] = [];
  notes = '';
  submitting = false;
  createdCommande: any = null;
  errorMessage = '';

  selectedFile: File | null = null;
  uploading = false;

  constructor(
    private cartService: CartService,
    private commandeService: CommandeService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cartService.items$.subscribe(items => {
      this.items = items;
    });
  }

  get totalPrice(): number {
    return this.cartService.getTotalPrice();
  }

  get totalCount(): number {
    return this.cartService.getTotalCount();
  }

  updateQuantity(platId: string, qty: number): void {
    this.cartService.updateQuantity(platId, qty);
  }

  removeItem(platId: string): void {
    this.cartService.removeFromCart(platId);
  }

  validerPanier(): void {
    if (this.items.length === 0) return;

    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }

    this.submitting = true;
    this.errorMessage = '';

    const payload = {
      items_input: this.items.map(item => ({
        plat_id: item.plat.id,
        quantity: item.quantity
      })),
      notes: this.notes
    };

    this.commandeService.createCommande(payload).subscribe({
      next: (commande) => {
        this.submitting = false;
        this.createdCommande = commande;
        this.cartService.clearCart();
      },
      error: (err) => {
        this.submitting = false;
        this.errorMessage = err.error?.detail || 'Erreur lors de la création de la commande. Veuillez réinstaller la base ou vous reconnecter.';
      }
    });
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  uploadProof(): void {
    if (!this.createdCommande || !this.selectedFile) return;

    this.uploading = true;
    this.commandeService.uploadPaymentProof(this.createdCommande.id, this.selectedFile).subscribe({
      next: () => {
        this.uploading = false;
        this.router.navigate(['/mes-commandes']);
      },
      error: () => {
        this.uploading = false;
      }
    });
  }
}
