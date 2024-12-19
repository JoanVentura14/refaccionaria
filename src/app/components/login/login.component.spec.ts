import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';  // Importa FormsModule para usar ngModel
import { LoginComponent } from './login.component';
import { By } from '@angular/platform-browser'; // Para seleccionar elementos en el DOM

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [FormsModule],  // Importa FormsModule para usar ngModel
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the login component', () => {
    expect(component).toBeTruthy();  // Verifica que el componente se crea correctamente
  });

  it('should have username and password fields', () => {
    const usernameInput = fixture.debugElement.query(By.css('#username'));
    const passwordInput = fixture.debugElement.query(By.css('#password'));
    
    expect(usernameInput).toBeTruthy();  // Verifica que el campo de usuario exista
    expect(passwordInput).toBeTruthy();  // Verifica que el campo de contraseña exista
  });
});
