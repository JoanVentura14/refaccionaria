import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private cart: any[] = [];
  private cartSubject = new BehaviorSubject<any[]>(this.cart);

  // Observable para compartir datos del carrito
  cart$ = this.cartSubject.asObservable();

  constructor() {
    // Cargar carrito desde localStorage al inicializar
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      this.cart = JSON.parse(savedCart);
      this.cartSubject.next(this.cart); // Emitir el carrito cargado
    }
  }

  // Agregar un artículo al carrito
  addToCart(product: any): void {
    const existingItem = this.cart.find((item) => item.id === product.id);

    if (existingItem) {
      existingItem.quantity += 1; // Incrementar cantidad si ya existe
    } else {
      this.cart.push({ ...product, quantity: 1 });
    }

    this.updateCartState();
  }

  // Eliminar un artículo del carrito
  removeFromCart(productId: number): void {
    this.cart = this.cart.filter((item) => item.id !== productId);
    this.updateCartState();
  }

  // Actualizar cantidad de un producto
  updateQuantity(productId: number, change: number): void {
    const item = this.cart.find((item) => item.id === productId);
    if (item) {
      item.quantity += change;
      if (item.quantity <= 0) {
        this.removeFromCart(productId); // Si la cantidad es <= 0, eliminar el artículo
      } else {
        this.updateCartState(); // Actualizar el carrito si la cantidad es válida
      }
    }
  }

  // Obtener los artículos del carrito
  getCart(): any[] {
    return this.cart;
  }

  // Sincronizar el carrito con BehaviorSubject y localStorage
  private updateCartState(): void {
    this.cartSubject.next(this.cart);
    localStorage.setItem('cart', JSON.stringify(this.cart));
  }
  
  
  getTotalPrice(): number {
    return this.cart.reduce((total, item) => total + item.price * item.quantity, 0);
  }
  
  getTax(): number {
    const total = this.getTotalPrice();
    return total * 0.10; // Ejemplo: 10% de impuestos
  }
  
  getSavings(): number {
    // Supón que hay un descuento del 5%
    return this.getTotalPrice() * 0.05;
  }
  incrementQuantity(item: any): void {
    item.quantity += 1;
    this.updateCart();
  }

  // Decrementa la cantidad de un producto
  decrementQuantity(item: any): void {
    if (item.quantity > 1) {
      item.quantity -= 1;
      this.updateCart();
    }
  }
   // Actualiza el carrito y notifica a los observadores
   private updateCart(): void {
    this.cartSubject.next(this.cart);
  }
  
}
