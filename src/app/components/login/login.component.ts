import { Component, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { AvatarModule } from 'primeng/avatar';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { createClient, SupabaseClient } from '@supabase/supabase-js';



@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule, // Importa FormsModule para habilitar [(ngModel)]
    ButtonModule,
    CheckboxModule,
    InputTextModule,
    PasswordModule, // Para p-password
    AvatarModule, // Para p-avatar
    ToastModule, // Para p-toast
  ],
  providers: [LayoutService, MessageService],
  templateUrl: './login.component.html',
  styles: [
   `
      :host ::ng-deep .pi-eye,
      :host ::ng-deep .pi-eye-slash {
        transform: scale(1.6);
        margin-right: 1rem;
        color: var(--primary-color) !important;
      }
      .rounded-image {
        border-radius: 90%;
        width: 130px;
        height: 130px;
        object-fit: cover;
      }
    `,
  ],
})
export class LoginComponent {
  formData = {
    email: '',
    password: '',
  };



  storeUserData: {
        id: any;
        name: any;
        email: any;
        lastname: any;
        roles: { name: any }[];
    }


    rol: any;
    uuid: any;

  constructor(
    public layoutService: LayoutService,
    private MessageService: MessageService,
    private router: Router,
    @Inject('SUPABASE_CLIENT') private supabase: SupabaseClient
  ) {}


  async loginUser() {
    const userData = {
      email: this.formData.email,
      password: this.formData.password,
    };

    try {
      const { data, error } = await this.supabase.auth.signInWithPassword({
        email: userData.email,
        password: userData.password,
      });

        if (error) {
        console.error('Error al iniciar sesión:', error.message);
        this.MessageService.add({
          key: 'tst',
          severity: 'error',
          summary: 'Error',
          detail: error.message,
        });
        return;
      }

      if (data.session) {

        this.uuid = data.user.id

        try {
            const { data, error } = await this.supabase
                .from('users')
                .select(
                    `
                    id,
                    name,
                    email,
                    lastname,
                    roles (name)
                `
                )
                .eq('auth_id', this.uuid)
                .single();

            if (error) {
                console.error('Error al obtener datos del usuario:', error);
                return;
            }

            this.storeUserData = data || null;

            this.rol = data.roles

            localStorage.clear();

            if (this.storeUserData) {
                localStorage.setItem('userName', this.storeUserData.name || '');
                localStorage.setItem('userLastname', this.storeUserData.lastname || '');
                localStorage.setItem('userId', this.storeUserData.id || '');
                localStorage.setItem('userEmail', this.storeUserData.email || '');
                localStorage.setItem('userRol',this.rol.name || '');
            }
        } catch (err) {
            console.error('Error inesperado:', err);
        }

        this.MessageService.add({
          key: 'tst',
          severity: 'success',
          summary: 'Éxito',
          detail: 'Inicio de sesión exitoso. Redirigiendo...',
        });

        setTimeout(() => {
            if (this.rol.name === 'Admin') {
                this.router.navigate(['/admin/home']);
            } else if (this.rol.name === 'Cliente') {
                this.router.navigate(['/home']);
            } else {
                console.error('Rol desconocido:', this.rol);
                this.router.navigate(['/login']);
            }
        }, 1500);
        
      }
    } catch (err) {
      console.error('Error inesperado:', err);
      this.MessageService.add({
        key: 'tst',
        severity: 'error',
        summary: 'Error inesperado',
        detail: 'Ocurrió un problema al iniciar sesión.',
      });
    }
  }


  navigateToForgotPassword() {
    this.router.navigate(['/forgot_password']);
  }

  navigateToCreateUser() {
    this.router.navigate(['/create_user']);
  }
}
