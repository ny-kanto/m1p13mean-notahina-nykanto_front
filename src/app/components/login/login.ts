import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  message: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  onSubmit() {
  if (this.loginForm.invalid) {
    this.message = 'Veuillez remplir correctement tous les champs';
    return;
  }

  const payload = this.loginForm.value;

  this.authService.login(payload).subscribe({
    next: (res) => {
      // 🔥 récupérer le rôle
      const role = res?.user?.role;

      // 🔥 priorité au redirect si présent
      const redirectUrl = this.route.snapshot.queryParamMap.get('redirect');

      if (redirectUrl) {
        this.router.navigateByUrl(redirectUrl);
        return;
      }

      if (role === 'boutique') {
        this.router.navigate(['/promotions']);
      }
      else {
        this.router.navigate(['/boutiques']);
      }
    },
    error: (err) => {
      this.message = err?.error?.message || 'Erreur de connexion';
    }
  });
}
}
