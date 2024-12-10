import { Component } from '@angular/core';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot_password.component.html',
  styleUrls: ['./forgot_password.component.scss']
})
export class ForgotPasswordComponent {
  email: string = '';

  constructor() {}

  onSubmit(): void {
    if (this.email) {
      console.log('Correo electrónico ingresado:', this.email);
      alert('Correo enviado para recuperar contraseña.');
      // Aquí puedes agregar la lógica para enviar el correo
    } else {
      alert('Por favor ingresa un correo válido.');
    }
  }
}
