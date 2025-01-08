import { Component } from '@angular/core';
import { Product } from '../../models/product';
import { CartService } from '../../services/cart.service';

@Component({
    selector: 'app-product-list',
    templateUrl: './product-list.component.html',
    styleUrls: ['./product-list.component.css']
})
export class ProductListComponent {
    products: Product[] = [
        { id: 1, name: 'Product 1', price: 100, quantity: 1 },
        { id: 2, name: 'Product 2', price: 200, quantity: 1 },
        { id: 3, name: 'Product 3', price: 300, quantity: 1 },
    ];

    constructor(private cartService: CartService) {}

    addToCart(product: Product) {
        this.cartService.addToCart(product);
    }
}
