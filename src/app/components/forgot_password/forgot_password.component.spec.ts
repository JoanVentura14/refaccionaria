import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { ForgotPasswordComponent } from './forgot_password.component';

describe('ForgotPasswordComponent', () => {
  let component: ForgotPasswordComponent;
  let fixture: ComponentFixture<ForgotPasswordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ForgotPasswordComponent],
      imports: [FormsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(ForgotPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should log email on submit', () => {
    component.email = 'test@example.com';
    spyOn(console, 'log');
    component.onSubmit();
    expect(console.log).toHaveBeenCalledWith('Correo electrónico ingresado:', 'test@example.com');
  });

  it('should alert user if email is empty', () => {
    spyOn(window, 'alert');
    component.onSubmit();
    expect(window.alert).toHaveBeenCalledWith('Por favor ingresa un correo válido.');
  });
});
