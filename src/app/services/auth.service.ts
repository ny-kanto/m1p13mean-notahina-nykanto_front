// services/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

type LoginResponse = { token: string; user?: any };

@Injectable({ providedIn: 'root' })
export class AuthService {
  private API_URL = 'https://m1p13mean-notahina-nykanto-back.onrender.com/auth';
//   private API_URL = 'http://localhost:3000/auth';

  constructor(private http: HttpClient) {}

  register(data: any): Observable<any> {
    return this.http.post(`${this.API_URL}/signup`, data);
  }

  login(data: any): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.API_URL}/login`, data).pipe(
      tap((res) => {
        if (res?.token) localStorage.setItem('token', res.token);

        if (res?.user) {
          localStorage.setItem('user', JSON.stringify(res.user));
        }
      }),
    );
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  getUser(): any | null {
    const raw = localStorage.getItem('user');
    return raw ? JSON.parse(raw) : null;
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }
}
