import { Component, Inject, OnInit } from '@angular/core';
import { SupabaseClient } from '@supabase/supabase-js'; // Importa el cliente de Supabase
import { DataViewModule } from 'primeng/dataview'; // Módulo de PrimeNG para la vista de datos
import { PickListModule } from 'primeng/picklist'; // Módulo de PrimeNG para listas seleccionables
import { OrderListModule } from 'primeng/orderlist'; // Módulo de PrimeNG para listas ordenables
import { CommonModule } from '@angular/common'; // Módulo común de Angular
import { NavBarComponent } from '../nav-bar/nav-bar.component'; 
import { SupabaseService } from 'src/app/services/supabase.service';
import { Router } from '@angular/router';
import { TruncatePipe } from 'src/app/truncate.pipe';
import { CartService } from '../../services/cart-2.service'; 
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [DataViewModule, PickListModule, OrderListModule, CommonModule,NavBarComponent, TruncatePipe ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  vehicles: any[] = [];
  brands: any[] = [];
  models: string[] = [];
  motors: string[] = [];
  isDropdownVisible = false;
  isDropdownVisibleB = false;
  isDropdownVisibleM = false;
  isDropdownVisibleMO = false;
  isDropdownVisibleA = false;
  products: any[] = []; // Array donde se almacenarán los productos
  filteredProducts: any[] = []; // Array de productos filtrados
  sortOptions: any[] = []; // Opciones de ordenación
  searchQuery: string = ''; // Variable para el texto de búsqueda
  isLoading = true; // Indicador de carga
  currentPage = 1;
  rowsPerPage = 9;
  selectedVehicleYear: string | null = null;
  selectedVehicleBrand: string | null = null;
  selectedVehicleModel: string | null = null;
  selectedVehicleMotor: string | null = null;
  selectedVehicleAutopart: string | null = null;
  constructor(@Inject('SUPABASE_CLIENT') private supabase: SupabaseClient,private supabaseService: SupabaseService,private router: Router,private cartService: CartService) {}

  
  navigateToListProducts() {
    this.router.navigate(['/list-products'], {
      queryParams: {
        year: this.selectedVehicleYear,
        brand: this.selectedVehicleBrand,
        model: this.selectedVehicleModel,
        motor: this.selectedVehicleMotor,
      },
    });
  }
  async goToListProducts() {
    const products = await this.supabaseService.getProductsByCompatibility(
      this.selectedVehicleYear,
      this.selectedVehicleBrand,
      this.selectedVehicleModel,
      this.selectedVehicleMotor
    );
  
    if (products.length) {
      console.log('Productos encontrados:', products);
      // Aquí rediriges al componente de productos con los datos obtenidos
      this.router.navigate(['/list-products'], { state: { products } });
    } else {
      console.warn('No se encontraron productos compatibles.');
    }
  }
  
  async toggleDropdown() {
    this.isDropdownVisible = !this.isDropdownVisible;
    if (this.isDropdownVisible && this.vehicles.length === 0) {
      this.vehicles = await this.supabaseService.getVehicles();
    }
  }
  async selectVehicle(year: string) {
    this.selectedVehicleYear = year; // Guarda el año seleccionado
    this.isDropdownVisible = false; // Cierra el dropdown (opcional)
    console.log('Año seleccionado:', this.selectedVehicleYear); // Depuración
    this.brands = await this.supabaseService.getBrandsByYear(year);
    this.selectedVehicleModel = null;
  this.models = [];
  }
  toggleDropdownB() {
    this.isDropdownVisibleB = !this.isDropdownVisibleB;
    }
  
  
  async selectBrand(brand: string) {
    this.selectedVehicleBrand = brand; // Guarda el año seleccionado
    this.isDropdownVisibleB = false; // Cierra el dropdown (opcional)
    console.log('Marca seleccionada:', this.selectedVehicleBrand); // Depuración
    this.models = await this.supabaseService.getModelsByYearAndBrand(this.selectedVehicleYear, brand);
  }
  async toggleDropdownM() {
    this.isDropdownVisibleM = !this.isDropdownVisibleM;
    if (this.isDropdownVisibleM && this.vehicles.length === 0) {
      this.vehicles = await this.supabaseService.getVehicles();
    }
  }
  
  async selectModel(model: string) {
    this.selectedVehicleModel = model; // Guarda el año seleccionado
    this.isDropdownVisibleM = false; // Cierra el dropdown (opcional)
    console.log('Marca seleccionada:', this.selectedVehicleModel); // Depuración
    
  }
  async toggleDropdownMO() {
    this.isDropdownVisibleMO = !this.isDropdownVisibleMO;
    if (this.isDropdownVisibleMO ) {
      this.motors = await this.supabaseService.getMotorByYearAndBrand(this.selectedVehicleYear,this.selectedVehicleBrand, this.selectedVehicleModel);
    }
  }
  
  selectMotor(motor: string) {
    this.selectedVehicleMotor = motor; // Guarda el año seleccionado
    this.isDropdownVisibleMO = false; // Cierra el dropdown (opcional)
    console.log('Marca seleccionada:', this.selectedVehicleMotor); // Depuración
  }
  async toggleDropdownA() {
    this.isDropdownVisibleA = !this.isDropdownVisibleA;
    if (this.isDropdownVisibleA && this.vehicles.length === 0) {
      this.vehicles = await this.supabaseService.getVehicles();
    }
  }
  
  selectAutopart(autopart: string) {
    this.selectedVehicleAutopart = autopart // Guarda el año seleccionado
    this.isDropdownVisibleA = false; // Cierra el dropdown (opcional)
    console.log('Marca seleccionada:', this.selectedVehicleAutopart); // Depuración
  }
  

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
  onSearch(event: any): void {
    const searchTerm = event.target.value.trim();
    if (searchTerm) {
      this.router.navigate(['/list-products'], { state: { searchTerm } });
    }
  }


  addToCart(product: any): void {
    this.cartService.addToCart(product);
    console.log('Producto agregado:', product);
  }

  
}

