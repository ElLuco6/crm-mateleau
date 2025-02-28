import { Component } from '@angular/core';
import { AuthService } from '../../core/service/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent  {

  constructor(public AuthService: AuthService,
              private router: Router
  ) { }

  logout() {
    this.AuthService.logout().subscribe(() => {
      this.router.navigate(['/login']);
    });
  }

}
