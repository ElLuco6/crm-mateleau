import { Component } from '@angular/core';
import { AuthService } from '../../../core/service/auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms'
@Component({
  selector: 'app-login',
  imports: [FormsModule],
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
        this.router.navigate(['/dashboard']); // Redirigez vers la page de tableau de bord après la connexion réussie
      },
      (error) => {
        console.error('Login failed', error);
        // Gérez les erreurs de connexion ici
      }
    );
  }

}
