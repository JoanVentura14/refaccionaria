import { AfterViewInit, Component, ElementRef, inject, Inject, Renderer2, ViewChild } from '@angular/core';
import * as Papa from 'papaparse';
import { SupabaseClient } from '@supabase/supabase-js';
import { Router } from '@angular/router';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { CommonModule } from '@angular/common'; 
import { NgModule } from '@angular/core'; 



@Component({
 
  selector: 'app-csv-uploader',
  templateUrl: './admin-add-product.component.html',
  styleUrls: ['./admin-add-product.component.scss'] ,
  
  
})
export class AdminAddProductComponent implements AfterViewInit{



  csvData: any[] = []; // Datos procesados del CSV
  processedData: any[] = []; // Datos validados y listos para insertar
  selectedFileName: string | null = null; 
  dragOver = false;


  constructor(
    public layoutService: LayoutService,
    private router: Router,
    @Inject('SUPABASE_CLIENT') private supabase: SupabaseClient
  ) {}

  // Método para procesar el archivo CSV seleccionado
  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {

      this.selectedFileName = file.name;

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
          this.renderer2.setStyle(this.dropArea.nativeElement, 'border', '2px solid #7CFC00');
          console.log('Datos validados y procesados:', this.processedData);
        },
      });
    }else{
      console.log('No se pudieron procesar los datos', this.processedData);
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

  @ViewChild('fileElement') inputFileElement !: ElementRef
  @ViewChild('dropArea') dropArea !: ElementRef
  private renderer2 = inject(Renderer2);

  
ngAfterViewInit(): void {
  this.ListenDragOver();
  this.ListenDragLeave();
  this.ListenDrop();
}

  
  openSelectFileDialog(){
    this.inputFileElement.nativeElement.value = null;
    this.inputFileElement.nativeElement.click();
 

  }


  ListenDragOver(){
    this.renderer2.listen(
      this.dropArea.nativeElement, 'dragover', (event: DragEvent) =>{
        event.preventDefault();
        event.stopPropagation();
        this.dragOver = true;
        this.renderer2.setStyle(this.dropArea.nativeElement, 'border', '2px dashed #000');
      }
    )
  }


  ListenDragLeave(){
    this.renderer2.listen(
      this.dropArea.nativeElement, 'dragleave', (event: DragEvent) =>{
        event.preventDefault();
        event.stopPropagation();
        this.dragOver = false;
        this.renderer2.setStyle(this.dropArea.nativeElement, 'border', '2px solid #2196F3');
      }
    )
  }

  ListenDrop(){
    this.renderer2.listen(
      this.dropArea.nativeElement, 'drop', (event: DragEvent) =>{
        event.preventDefault();
        event.stopPropagation();

        this.dragOver = true;

        this.renderer2.setStyle(this.dropArea.nativeElement, 'border', '2px solid #7CFC00');

        const files = event.dataTransfer?.files;
        if (files && files.length > 0) {
          const file = files[0];  // Tomamos el primer archivo (puedes manejar más si es necesario)
          this.selectedFileName = file.name;  // Asignar el nombre del archivo a la variable
          console.log('Archivo cargado:', this.selectedFileName);  // Mostrar el nombre del archivo en la consola
        }
        console.log('El archivo se cargo bien');
      }
    )
  }

}





