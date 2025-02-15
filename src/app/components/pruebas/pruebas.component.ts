import { Component, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { SupabaseClient } from '@supabase/supabase-js';
import { SupabaseService } from 'src/app/services/supabase.service';

@Component({
  selector: 'app-pruebas',
  templateUrl: './pruebas.component.html',
  styleUrl: './pruebas.component.scss'
})
export class PruebasComponent {
  products: any[] = []; // Array donde se almacenarán los productos
  filteredProducts: any[] = []; // Array de productos filtrados
  sortOptions: any[] = []; // Opciones de ordenación
  searchQuery: string = ''; // Variable para el texto de búsqueda
  isLoading = true; // Indicador de carga
  currentPage = 1;
  rowsPerPage = 9;
  constructor(@Inject('SUPABASE_CLIENT') private supabase: SupabaseClient,private supabaseService: SupabaseService,private router: Router) {}
  ngOnInit(): void {
    // Definición de las opciones de ordenación
    this.sortOptions = [
      { label: 'Mayor precio', value: 'price' },
      { label: 'Menor precio', value: '!price' }
    ];

    // Obtener productos desde Supabase
    this.fetchProducts();
  }

  async fetchProducts() {
    try {
      const { data, error } = await this.supabase
        .from('products')
        .select('id, name, description, imagen, price, stock, active');

      if (error) {
        console.error('Error fetching products:', error.message);
        return;
      }

      // Filtra los productos activos
      this.products = data.filter(product => product.active);
      console.log('Products fetched:', this.products); // Para ver los productos en consola
      this.isLoading = false; // Deja de cargar una vez que los productos han sido recibidos
    } catch (error) {
      console.error('Unexpected error:', error);
      this.isLoading = false;
    }
  }

  onSortChange(event: any) {
    const value = event.value; // Obtiene el valor de la opción seleccionada
    const field = value.startsWith('!') ? value.substring(1) : value; // Extrae el campo para ordenar

    // Ordena los productos según el campo y el orden (ascendente o descendente)
    this.products.sort((a, b) => {
      if (value.startsWith('!')) {
        return a[field] < b[field] ? 1 : -1; // Orden descendente
      } else {
        return a[field] > b[field] ? 1 : -1; // Orden ascendente
      }
    });
  }

  get pagedProducts() {
    const startIndex = (this.currentPage - 1) * this.rowsPerPage;
    const endIndex = this.currentPage * this.rowsPerPage;
    return this.products.slice(startIndex, endIndex);
  }

  changePage(direction: number) {
    this.currentPage += direction;
  }
  onSearch() {
    if (this.searchQuery.trim() === '') {
      this.filteredProducts = [...this.products]; // Si la búsqueda está vacía, muestra todos los productos
    } else {
      // Filtra los productos según el nombre o descripción
      this.filteredProducts = this.products.filter(product =>
        product.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    }
  }
  

}
