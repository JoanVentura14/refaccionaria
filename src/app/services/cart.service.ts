import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Product } from '../models/product';

@Injectable({
    providedIn: 'root'
})
export class CartService {
    private cart: Product[] = [];
    private cartSubject = new BehaviorSubject<Product[]>([]);

    getCart() {
        return this.cartSubject.asObservable();
    }

    addToCart(product: Product) {
        const existingProduct = this.cart.find(p => p.id === product.id);
        if (existingProduct) {
            existingProduct.quantity += product.quantity;
        } else {
            this.cart.push({ ...product });
        }
        this.cartSubject.next(this.cart);
    }

    removeFromCart(productId: number) {
        this.cart = this.cart.filter(p => p.id !== productId);
        this.cartSubject.next(this.cart);
    }

    clearCart() {
        this.cart = [];
        this.cartSubject.next(this.cart);
    }
}
