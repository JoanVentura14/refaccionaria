import { Component, EventEmitter, Output } from '@angular/core';
import { MenuModule } from 'primeng/menu';
import { MenubarModule } from 'primeng/menubar';
import { ToolbarModule } from 'primeng/toolbar';
import {MenuItem} from 'primeng/api';
import 'flowbite';
import { SupabaseService } from 'src/app/services/supabase.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.scss',
  standalone: true,
 imports: [ToolbarModule,MenubarModule,MenuModule,CommonModule]
})
export class NavBarComponent {
    categories: any[] = [];
    isDropdownVisible = false;
  
    constructor(private supabaseService: SupabaseService) {}
    @Output() searchTerm = new EventEmitter<string>();

  // Emitir el valor de búsqueda cuando presione enter
  onSearch(event: any): void {
    const query = event.target.value.trim();
    this.searchTerm.emit(query); // Emitir el término de búsqueda
  }
  
    async toggleDropdown() {
      this.isDropdownVisible = !this.isDropdownVisible;
      if (this.isDropdownVisible && this.categories.length === 0) {
        this.categories = await this.supabaseService.getCategories();
      }
    }

}
