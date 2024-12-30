import { Component, Inject } from '@angular/core';
import * as Papa from 'papaparse';
import { SupabaseClient } from '@supabase/supabase-js';
import { Router } from '@angular/router';
import { LayoutService } from 'src/app/layout/service/app.layout.service';

@Component({
  selector: 'app-csv-uploader',
  templateUrl: './prueba.component.html',
})
export class PruebaComponent {
  csvData: any[] = []; // Datos procesados del CSV
  processedData: any[] = []; // Datos validados y listos para insertar

  constructor(
    public layoutService: LayoutService,
    private router: Router,
    @Inject('SUPABASE_CLIENT') private supabase: SupabaseClient
  ) {}

  // Método para procesar el archivo CSV seleccionado
  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      Papa.parse(file, {
        header: true, // Usar encabezados para mapear las columnas
        skipEmptyLines: true, // Ignorar líneas vacías
        complete: (result) => {
          this.csvData = result.data;
          console.log('Datos procesados del CSV:', this.csvData);

          // Validar y transformar los datos
          this.processedData = this.csvData.map((row: any) => ({
            name: row.name || '', // Validar campo requerido
            description: row.description || '',
            imagen: row.imagen || '',
            price: parseFloat(row.price) || 0, // Asegurar que sea numérico
            stock: parseInt(row.stock) || 0, // Asegurar que sea entero
            created_at: row.created_at || new Date().toISOString(), // Fecha actual si no está presente
            updated_at: row.updated_at || new Date().toISOString(),
            active: row.active === 'true' || row.active === true, // Convertir a booleano
            id_subcategories: parseInt(row.id_subcategories) || null, // Manejar como número o nulo
          }));

          console.log('Datos validados y procesados:', this.processedData);
        },
      });
    }
  }

  // Método para enviar los datos validados a Supabase
  async onSubmit(event: Event): Promise<void> {
    event.preventDefault();

    // Validar que haya datos procesados antes de enviarlos
    if (this.processedData.length === 0) {
      console.error('No hay datos válidos para subir.');
      return;
    }

    try {
      const { data, error } = await this.supabase
        .from('products')
        .insert(this.processedData);

      if (error) {
        console.error('Error al subir productos:', error);
      } else {
        console.log('Productos subidos exitosamente:', data);
      }
    } catch (error) {
      console.error('Error al procesar el archivo:', error);
    }
  }
}
