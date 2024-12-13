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

@Component({
  selector: 'app-forgot-password',
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
  templateUrl: './forgot_password.component.html',
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
    `,
  ],
})
export class ForgotPasswordComponent {
    valCheck: string[] = ['remember'];
    password!: string;

    msgs: Message[] = [];

    constructor(
        public layoutService: LayoutService, private MessageService: MessageService, private router: Router
      ) { }

    formData = {
        email: '',
    };

    registerUser() {
        const userData = {
            email: this.formData.email,
        };

        console.log('Datos del usuario:', userData);

        // this.http.post('URL_API', userData).subscribe(...); bla bla bla

        this.MessageService.add({ key: 'tst', severity: 'warn', summary: 'Revise su correo', detail: 'Asegúrate de usar el correo registrado en tu cuenta.' });

    }

    navigateToForgotPassword() {
        this.router.navigate(['/forgot_password']);
      }
}
