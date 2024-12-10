import { Component } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  username: string = '';
  password: string = '';

  constructor() {}

  login() {
    // Simula la verificación de login
    if (this.username === 'admin' && this.password === 'admin123') {
      alert('Login successful');
    } else {
      alert('Invalid credentials');
    }
  }
}
