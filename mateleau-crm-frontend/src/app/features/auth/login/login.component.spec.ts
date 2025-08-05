import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { AuthService } from '../../../core/service/auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        LoginComponent,
        RouterTestingModule.withRoutes([]) // ✅ mock complet et compatible routerLinkActive
      ],
      providers: [
        {
          provide: AuthService,
          useValue: jasmine.createSpyObj('AuthService', ['login'])
        }
      ]
    });

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;

    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router);
    spyOn(router, 'navigate'); // ✅ spy ici sans override complet
  });

  it('should call authService.login with email and password on submit', () => {
    component.email = 'test@example.com';
    component.password = 'password123';

    authServiceSpy.login.and.returnValue(of({ token: 'abc123' }));

    component.onSubmit();

    expect(authServiceSpy.login).toHaveBeenCalledOnceWith('test@example.com', 'password123');
    expect(router.navigate).toHaveBeenCalledWith(['/']);
  });

  it('should handle login error', () => {
    spyOn(console, 'error');
    component.email = 'wrong@example.com';
    component.password = 'badpass';

    authServiceSpy.login.and.returnValue(throwError(() => new Error('Unauthorized')));

    component.onSubmit();

    expect(authServiceSpy.login).toHaveBeenCalled();
    expect(console.error).toHaveBeenCalledWith('Login failed', jasmine.any(Error));
    expect(router.navigate).not.toHaveBeenCalled();
  });
});
