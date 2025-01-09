import { Component, OnInit } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { Product } from '../../models/product';

@Component({
    selector: 'app-cart',
    templateUrl: './cart.component.html',
    styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {
    cart: Product[] = [];

    constructor(private cartService: CartService) {}

    ngOnInit() {
        this.cartService.getCart().subscribe(cart => {
            this.cart = cart;
        });
    }

    removeFromCart(productId: number) {
        this.cartService.removeFromCart(productId);
    }

    clearCart() {
        this.cartService.clearCart();
    }
}
