import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CartItem } from '../models/cart.model';
import { Plat } from '../models/plat.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private itemsSubject = new BehaviorSubject<CartItem[]>([]);
  public items$ = this.itemsSubject.asObservable();

  constructor() {
    this.loadCart();
  }

  private loadCart(): void {
    if (typeof window !== 'undefined' && localStorage) {
      const saved = localStorage.getItem('ctrl_eat_cart');
      if (saved) {
        try {
          this.itemsSubject.next(JSON.parse(saved));
        } catch {
          this.itemsSubject.next([]);
        }
      }
    }
  }

  private saveCart(items: CartItem[]): void {
    if (typeof window !== 'undefined' && localStorage) {
      localStorage.setItem('ctrl_eat_cart', JSON.stringify(items));
    }
    this.itemsSubject.next(items);
  }

  addToCart(plat: Plat, quantity: number = 1): void {
    const current = this.itemsSubject.value;
    const existingIndex = current.findIndex(item => item.plat.id === plat.id);
    let updated: CartItem[];

    if (existingIndex > -1) {
      updated = [...current];
      updated[existingIndex].quantity += quantity;
    } else {
      updated = [...current, { plat, quantity }];
    }
    this.saveCart(updated);
  }

  updateQuantity(platId: string, quantity: number): void {
    let current = this.itemsSubject.value;
    if (quantity <= 0) {
      current = current.filter(item => item.plat.id !== platId);
    } else {
      const index = current.findIndex(item => item.plat.id === platId);
      if (index > -1) {
        current[index].quantity = quantity;
      }
    }
    this.saveCart([...current]);
  }

  removeFromCart(platId: string): void {
    const updated = this.itemsSubject.value.filter(item => item.plat.id !== platId);
    this.saveCart(updated);
  }

  clearCart(): void {
    this.saveCart([]);
  }

  getItems(): CartItem[] {
    return this.itemsSubject.value;
  }

  getTotalCount(): number {
    return this.itemsSubject.value.reduce((total, item) => total + item.quantity, 0);
  }

  getTotalPrice(): number {
    return this.itemsSubject.value.reduce((total, item) => total + (item.plat.price * item.quantity), 0);
  }
}
