import { Component, OnInit } from '@angular/core';
import { CartService } from '../../services/cart-2.service';
import { NavBarComponent } from '../nav-bar/nav-bar.component'; 
import { TruncatePipe } from 'src/app/truncate.pipe';
import { CommonModule } from '@angular/common';
@Component({
  standalone: true,
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
  imports: [NavBarComponent,TruncatePipe,CommonModule ],
})
export class CartComponent implements OnInit {
  cartItems: any[] = [];
  originalPrice: number = 0;
  savings: number = 0;
  tax: number = 0;
  total: number = 0;

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    this.cartService.cart$.subscribe((items) => {
      this.cartItems = items;
      this.updateOrderSummary();
    });
    
  }
  updateOrderSummary(): void {
    this.originalPrice = this.cartService.getTotalPrice();
    this.savings = this.cartService.getSavings();
    this.tax = this.cartService.getTax();
    this.total = this.originalPrice - this.savings + this.tax;
  }

  // Incrementar cantidad
  incrementQuantity(item: any): void {
    this.cartService.updateQuantity(item.id, 1);
  }

  // Decrementar cantidad
  decrementQuantity(item: any): void {
    this.cartService.updateQuantity(item.id, -1);
  }

  // Eliminar un artículo
  removeItem(productId: number): void {
    this.cartService.removeFromCart(productId);
  }
  
}
