import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../service/auth.service';
import { Router } from '@angular/router';
import { TrpcService } from '../../service/trpc.service';

@Component({
  selector: 'app-navbar',
  imports: [],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent  implements OnInit {
  message = '';

  constructor(public AuthService: AuthService,
              private router: Router,
              private trpcService: TrpcService
  ) { }

  logout() {
    this.AuthService.logout().subscribe(() => {
      this.router.navigate(['/login']);
    });
  }

  ngOnInit() {
    this.trpcService.getHello('World').then((response:any) => {
      this.message = response.message;
    });
  }

}
