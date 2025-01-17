import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SupabaseService } from 'src/app/services/supabase.service';
import { Router } from '@angular/router';
import { NavBarComponent } from '../nav-bar/nav-bar.component'; 
import { CommonModule } from '@angular/common'; // Módulo común de Angular
@Component({
  standalone: true,
  selector: 'app-list-products',
  templateUrl: './list-products.component.html',
  styleUrls: ['./list-products.component.scss'],
  
  imports: [NavBarComponent,CommonModule ],
  
  
})
export class ListProductsComponent implements OnInit {
  products: any[] = [];
  pagedProducts: any[] = []; // Productos paginados
  isLoading = true;
  sortOptions = [
    { label: 'Precio: Bajo a Alto', value: 'lowToHigh' },
    { label: 'Precio: Alto a Bajo', value: 'highToLow' },
  ];
  constructor(private router: Router, private supabaseService: SupabaseService) {
    const navigation = this.router.getCurrentNavigation();
    this.products = navigation?.extras?.state?.['products'] || [];
  }

  ngOnInit(): void {
    // Recuperamos el término de búsqueda pasado desde el componente contenedor
    const navigation = this.router.getCurrentNavigation();
    const searchTerm = navigation?.extras?.state?.['searchTerm'];

    if (searchTerm) {
      this.searchProducts(searchTerm); // Hacemos la búsqueda si hay un término
    } else {
      this.isLoading = false; // Si no hay término, mostramos todos los productos
    }
  }

  // Método para cambiar el orden de los productos
  onSortChange(event: any): void {
    const value = event.value;
    if (value === 'lowToHigh') {
      this.pagedProducts.sort((a, b) => a.price - b.price);
    } else if (value === 'highToLow') {
      this.pagedProducts.sort((a, b) => b.price - a.price);
    }
  }
  // Escuchar el término de búsqueda desde el navbar
  onSearch(searchTerm: string): void {
    if (searchTerm) {
      this.searchProducts(searchTerm); // Filtrar los productos con el término de búsqueda
    } else {
      this.pagedProducts = [...this.products]; // Si no hay término de búsqueda, mostrar todos los productos
    }
  }

  // Función para realizar la búsqueda en Supabase
  async searchProducts(query: string): Promise<void> {
    const { data, error } = await this.supabaseService.searchProducts(query);
    if (error) {
      console.error('Error al realizar la búsqueda:', error);
    } else {
      this.pagedProducts = data; // Filtrar los productos y asignarlos
      this.isLoading = false; // Detener el estado de carga
    }
  }
  
  
}
