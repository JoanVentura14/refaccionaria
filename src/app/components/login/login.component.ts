
import { Component } from '@angular/core';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router'

import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { FormsModule } from '@angular/forms';
import { PasswordModule } from 'primeng/password';
import { InputTextModule } from 'primeng/inputtext';

import { Message, MessageService } from 'primeng/api';
import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';
import { ToastModule } from 'primeng/toast';

import { AvatarModule } from 'primeng/avatar';

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
        ButtonModule,
        CheckboxModule,
        InputTextModule,
        FormsModule,
        PasswordModule,
        MessagesModule,
        MessageModule,
        ToastModule,
        AvatarModule
    ],
    providers: [
        LayoutService,
        MessageService
      ],
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
            //border: 1px solid black; /* Contorno negro, tamaño pequeño */
        }

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

    valCheck: string[] = ['remember'];
    password!: string;

    msgs: Message[] = [];

    constructor(
        public layoutService: LayoutService, private MessageService: MessageService, private router: Router
      ) { }

    formData = {
        email: '',
        password: '',
    };

    registerUser() {
        const userData = {
            email: this.formData.email,
            password: this.formData.password,
        };

        console.log('Datos del usuario:', userData);

        // this.http.post('URL_API', userData).subscribe(...); bla bla bla

        this.MessageService.add({ key: 'tst', severity: 'success', summary: 'Mensaje de éxito', detail: 'Bienvenido usuario X' });
        this.MessageService.add({ key: 'tst', severity: 'warn', summary: 'Mensaje de advertencia', detail: 'Revise sus datos' });
        this.MessageService.add({ key: 'tst', severity: 'error', summary: 'Mensaje de error', detail: 'Algo falló' });

    }

    navigateToForgotPassword() {
        this.router.navigate(['/forgot_password']);
      }

      navigateToCreateUser() {
        this.router.navigate(['/create_user']);
      }

  formData = {
    email: '',
    password: '',
  };

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
        this.MessageService.add({
          key: 'tst',
          severity: 'success',
          summary: 'Éxito',
          detail: 'Inicio de sesión exitoso. Redirigiendo...',
        });

        // Redirigir a la página de inicio o dashboard
        setTimeout(() => {
          this.router.navigate(['/dashboard']); // Cambia a la ruta correspondiente
        }, 2000);
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
