import { NgModule } from '@angular/core';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { InputMaskModule } from 'primeng/inputmask';
import { ToolbarModule } from 'primeng/toolbar';
import { MenuModule } from 'primeng/menu';

import { CardModule } from 'primeng/card';

@NgModule({
  imports: [
    DropdownModule,
    InputTextModule,
    ButtonModule,
    InputMaskModule,
    ToolbarModule,
    MenuModule,
    
    CardModule
  ],
  exports: [
    DropdownModule,
    InputTextModule,
    ButtonModule,
    InputMaskModule,
    ToolbarModule,
    MenuModule,
    
    CardModule
  ]
})
export class PrimeNGModule {}
