import { Component } from '@angular/core';

import { SelectItem } from 'primeng/api';
import { DataView } from 'primeng/dataview';
import { Product } from 'src/app/demo/api/product';
import { ProductService } from 'src/app/demo/service/product.service';
import { DataViewModule } from 'primeng/dataview'; 
import { PickListModule } from 'primeng/picklist';
import { OrderListModule } from 'primeng/orderlist';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ DataViewModule, PickListModule,OrderListModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
  
})
export class HomeComponent {



  constructor(private productService: ProductService) { }

  ngOnInit() {
     
  }



 
  

}


