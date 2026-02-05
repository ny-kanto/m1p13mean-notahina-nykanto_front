import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

//   private API_URL = 'http://localhost:3000/auth';
  private API_URL = 'https://m1p13mean-notahina-nykanto-back.onrender.com/signup';

  constructor(private http: HttpClient) {}

  register(data: any): Observable<any> {
    return this.http.post(`${this.API_URL}/signup`, data);
  }

  login(data: any): Observable<any> {
    return this.http.post(`${this.API_URL}/login`, data);
  }
}
