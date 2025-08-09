import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NavbarComponent } from './navbar.component';
import { AuthService } from '../../core/service/auth.service';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let router: Router;

  beforeEach(async () => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['logout']);

    await TestBed.configureTestingModule({
      imports: [
        NavbarComponent,        // standalone
        RouterTestingModule,    // ✅ fournit Router, RouterLink, ActivatedRoute, etc.
      ],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call logout and navigate to /login', () => {
    const navSpy = spyOn(router, 'navigate');
    authServiceSpy.logout.and.returnValue(of({}));

    component.login();

    expect(authServiceSpy.logout).toHaveBeenCalled();
    expect(navSpy).toHaveBeenCalledWith(['/login']);
  });

  describe('isLoggedIn()', () => {
    afterEach(() => localStorage.clear());

    it('should return false if no token', () => {
      localStorage.removeItem('token');
      expect(component.isLoggedIn()).toBeFalse();
    });

    it('should return true if token exists', () => {
      localStorage.setItem('token', '123abc');
      expect(component.isLoggedIn()).toBeTrue();
    });
  });
});
