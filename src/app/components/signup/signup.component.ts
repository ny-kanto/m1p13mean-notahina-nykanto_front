import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  signupForm!: FormGroup;

  message: string = '';

  constructor(private fb: FormBuilder, private http: HttpClient) {}

  ngOnInit(): void {
    this.signupForm = this.fb.group({
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit() {
    if (this.signupForm.invalid) {
      this.message = 'Veuillez remplir correctement tous les champs';
      return;
    }

    const payload = this.signupForm.value;

    this.http.post('http://localhost:3000/auth/signup', payload)
      .subscribe({
        next: (res: any) => {
          this.message = res.message || 'Compte créé';
        },
        error: (err) => {
          this.message = err.error?.message || 'Erreur lors de la création';
        }
      });
  }


}