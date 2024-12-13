import { Component } from '@angular/core';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

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
    selector: 'app-create-user',
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
    templateUrl: './create-user.component.html',
    styles: [
        `
            :host ::ng-deep .pi-eye,
            :host ::ng-deep .pi-eye-slash {
                transform: scale(1.6);
                margin-right: 1rem;
                color: var(--primary-color) !important;
            }
        `,
    ],
})
export class CreateUserComponent {
    valCheck: string[] = ['remember'];
    password!: string;

    msgs: Message[] = [];

    constructor(
        public layoutService: LayoutService, private MessageService: MessageService
      ) { }

    formData = {
        name: '',
        lastname: '',
        email: '',
        password: '',
        role_id: 1 //dejar el id del rol en usuario normal
    };

    registerUser() {
        const userData = {
            name: this.formData.name,
            lastname: this.formData.lastname,
            email: this.formData.email,
            password: this.formData.password,
        };

        console.log('Datos del usuario:', userData);

        // this.http.post('URL_API', userData).subscribe(...);

        this.MessageService.add({ key: 'tst', severity: 'success', summary: 'Mensaje de éxito', detail: 'Usuario creado' });
        this.MessageService.add({ key: 'tst', severity: 'warn', summary: 'Mensaje de advertencia', detail: 'Revise sus datos' });
        this.MessageService.add({ key: 'tst', severity: 'error', summary: 'Mensaje de error', detail: 'Algo falló' });

    }
}

