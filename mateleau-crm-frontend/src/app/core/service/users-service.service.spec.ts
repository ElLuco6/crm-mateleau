import { TestBed } from '@angular/core/testing';
import { UsersServiceService } from './users-service.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { User } from '../../models/User';
import { environment } from '../../../environments/environment';

describe('UsersServiceService', () => {
  let service: UsersServiceService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UsersServiceService]
    });

    service = TestBed.inject(UsersServiceService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  function createMockUser(id: string): User {
    return new User(
      id,
      'Alice',
      'password',
      'a@a.com',
      'admin',
      5
    );
  }

  it('should fetch all users', () => {
    const mockUsers: User[] = [createMockUser('u1')];

    service.getAll().subscribe(res => {
      expect(res).toEqual(mockUsers);
    });

    const req = httpMock.expectOne(`${environment.apiUsers}`);
    expect(req.request.method).toBe('GET');
    expect(req.request.withCredentials).toBeTrue();
    req.flush(mockUsers);
  });

  it('should create a user', () => {
    const newUser = createMockUser('u2');

    service.create(newUser).subscribe(res => {
      expect(res).toEqual(newUser);
    });

    const req = httpMock.expectOne(`${environment.apiUsers}`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newUser);
    expect(req.request.withCredentials).toBeTrue();
    req.flush(newUser);
  });

  it('should update a user', () => {
    const updatedUser = createMockUser('u3');
    updatedUser.name = 'Jane Doe';

    service.update(updatedUser).subscribe(res => {
      expect(res).toEqual(updatedUser);
    });

    const req = httpMock.expectOne(`${environment.apiUsers}/u3`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(updatedUser);
    expect(req.request.withCredentials).toBeTrue();
    req.flush(updatedUser);
  });

  it('should delete a user', () => {
    const id = 'u4';

    service.delete(id).subscribe(res => {
      expect(res).toBeTruthy();
    });

    const req = httpMock.expectOne(`${environment.apiUsers}/${id}`);
    expect(req.request.method).toBe('DELETE');
    expect(req.request.withCredentials).toBeTrue();
    req.flush({ success: true });
  });
});
