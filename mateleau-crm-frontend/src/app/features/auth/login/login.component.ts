import { Component } from '@angular/core';
import { AuthService } from '../../../core/service/auth.service';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms'
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-login',
  imports: [FormsModule, RouterModule,MatFormFieldModule, MatInputModule, MatButtonModule,CommonModule ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  email: string = '';
  password: string = '';

  
  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    this.authService.login(this.email, this.password).subscribe(
      () => {
        this.router.navigate(['/']); // Redirigez vers la page de tableau de bord après la connexion réussie
      },
      (error) => {
        console.error('Login failed', error);
        // Gérez les erreurs de connexion ici
      }
    );
  }

}
