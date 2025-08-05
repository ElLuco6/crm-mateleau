import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NavbarComponent } from './navbar.component';
import { AuthService } from '../../core/service/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['logout']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [NavbarComponent], // Standalone
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: {} }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call logout and navigate to /login', () => {
    authServiceSpy.logout.and.returnValue(of({}));
    component.login();
    expect(authServiceSpy.logout).toHaveBeenCalled();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
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
