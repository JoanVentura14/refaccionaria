import { NgModule } from '@angular/core';
import { HashLocationStrategy, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AppLayoutModule } from './layout/app.layout.module';
import { NotfoundComponent } from './demo/components/notfound/notfound.component';
import { ProductService } from './demo/service/product.service';
import { CountryService } from './demo/service/country.service';
import { CustomerService } from './demo/service/customer.service';
import { EventService } from './demo/service/event.service';
import { IconService } from './demo/service/icon.service';
import { NodeService } from './demo/service/node.service';
import { PhotoService } from './demo/service/photo.service';
import { LoginComponent } from './components/login/login.component';
import { ForgotPasswordComponent } from './components/forgot_password/forgot_password.component';
import { FormsModule } from '@angular/forms'; // <-- Importa FormsModule
import { HttpClient } from '@angular/common/http';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
@NgModule({
    declarations: [AppComponent, NotfoundComponent  ],
    imports: [AppRoutingModule, AppLayoutModule, FormsModule],
    providers: [
        {
            provide: 'SUPABASE_CLIENT',
            useFactory: (): SupabaseClient => {
              return createClient('https://ssluczzvmdastrnvdvsz.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNzbHVjenp2bWRhc3RybnZkdnN6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzMxNjg2NjIsImV4cCI6MjA0ODc0NDY2Mn0.R8CcdXwP3RevK8M4SkTRG8WVTItwASu_GFXM3CYFIes');
           }
         },
        
        { provide: LocationStrategy, useClass: PathLocationStrategy },
        CountryService, CustomerService, EventService, IconService, NodeService,
        PhotoService, ProductService
    ],
    bootstrap: [AppComponent],
})
export class AppModule {

}
