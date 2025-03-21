import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { User } from '../../models/User';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }



  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(`${environment.apiAuth}login`, { email, password }).pipe(
      tap(response => {
        // Stockez le token et d'autres informations d'authentification si nécessaire
        localStorage.setItem('token', response.token);
        localStorage.setItem('userId', response.userId);
        localStorage.setItem('role', response.role);
      })
    );
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('role');
 
    return this.http.post(`${environment.apiAuth}logout`, {});
  }

  register(user: User): Observable<User> {
    return this.http.post<User>(`${environment.apiUsers}`, user);
  }
}
