import { TestBed } from '@angular/core/testing';

import { AuthService } from './auth.service';
import { HttpClientTestingModule, HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { environment } from '../../../environments/environment';
import { User } from '../../models/User';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService],
    });

    httpMock = TestBed.inject(HttpTestingController);
    service = TestBed.inject(AuthService);
  });
   afterEach(() => {
    httpMock.verify();
    localStorage.clear(); // Nettoie le localStorage entre les tests
  });

  it('should login and store token, userId, and role in localStorage', () => {
    const mockResponse = {
      token: 'fake-token',
      userId: '123',
      role: 'admin'
    };

    service.login('test@example.com', 'password123').subscribe(response => {
      expect(response).toEqual(mockResponse);
      expect(localStorage.getItem('token')).toBe(mockResponse.token);
      expect(localStorage.getItem('userId')).toBe(mockResponse.userId);
      expect(localStorage.getItem('role')).toBe(mockResponse.role);
    });

    const req = httpMock.expectOne(`${environment.apiAuth}login`);
    expect(req.request.method).toBe('POST');
    expect(req.request.withCredentials).toBeTrue();
    req.flush(mockResponse);
  });

  it('should logout and clear localStorage', () => {
    localStorage.setItem('token', 'fake');
    localStorage.setItem('userId', 'fake');
    localStorage.setItem('role', 'fake');

    service.logout().subscribe();

    const req = httpMock.expectOne(`${environment.apiAuth}logout`);
    expect(req.request.method).toBe('POST');
    expect(localStorage.getItem('token')).toBeNull();
    expect(localStorage.getItem('userId')).toBeNull();
    expect(localStorage.getItem('role')).toBeNull();

    req.flush({}); // Réponse vide
  });

  it('should register a new user', () => {
    const mockUser: User = {
      _id: '1',
      email: 'new@example.com',
      name: 'New User',
      password: 'password',
      role: 'admin',
      divingLvl: 5

    };

    service.register(mockUser).subscribe(res => {
      expect(res).toEqual(mockUser);
    });

    const req = httpMock.expectOne(`${environment.apiUsers}`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockUser);
    req.flush(mockUser);
  });

});
