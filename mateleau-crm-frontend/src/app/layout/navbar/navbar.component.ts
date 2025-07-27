import { Component } from '@angular/core';
import { AuthService } from '../../core/service/auth.service';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [RouterModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent  {

  constructor(public AuthService: AuthService,
              private router: Router
  ) { }

  login() {
    this.AuthService.logout().subscribe(() => {
      this.router.navigate(['/login']);
    });
  }

  isLoggedIn(): boolean {
  return !!localStorage.getItem('token');
}

}
