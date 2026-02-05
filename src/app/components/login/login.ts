import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class LoginComponent {

  loginForm!: FormGroup;

  message: string = '';

  constructor(private fb: FormBuilder, private authService: AuthService) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      this.message = 'Veuillez remplir correctement tous les champs';
      return;
    }

    const payload = this.loginForm.value;

    this.authService.login(payload)
    .subscribe({
      next: (res: any) => {
          console.log('Login successful:', res);
          this.message = res.message || 'Connexion réussie';
        },
        error: (err) => {
          this.message = err.error?.message || 'Erreur lors de la connexion';
        }
    });
  }

}
