import { TestBed } from '@angular/core/testing';
import { DivingService } from './diving.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { environment } from '../../../environments/environment';
import { Dive } from '../../models/Dive';
import { Boat } from '../../models/Boat';
import { User } from '../../models/User';

describe('DivingService', () => {
  let service: DivingService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [DivingService]
    });

    service = TestBed.inject(DivingService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  function createMockDive(id: string): Dive {
    return new Dive(
      id,
      'Plongée Matinale',
      'Nice',
      new Date(),
      90,
      30,
      [],
      new Boat('b1', 'Boat', 10, new Date()),
      new User('u1', 'Alice', 'password','a@a.com', 'admin', 5)
    );
  }

  it('should get all dives', () => {
    const mockDives: Dive[] = [createMockDive('d1')];

    service.getAllDiving().subscribe(res => {
      expect(res).toEqual(mockDives);
    });

    const req = httpMock.expectOne(`${environment.apiDives}`);
    expect(req.request.method).toBe('GET');
    expect(req.request.withCredentials).toBeTrue();
    req.flush(mockDives);
  });

  it('should get a dive by id', () => {
    const mockDive = createMockDive('d2');

    service.getDiveById('d2').subscribe(res => {
      expect(res).toEqual(mockDive);
    });

    const req = httpMock.expectOne(`${environment.apiDives}/d2`);
    expect(req.request.method).toBe('GET');
    expect(req.request.withCredentials).toBeTrue();
    req.flush(mockDive);
  });

  it('should create a diving group', () => {
    const payload = { name: 'Group A', divers: ['diver1', 'diver2'] };

    service.createDivingGroup(payload).subscribe(res => {
      expect(res).toEqual({ success: true });
    });

    const req = httpMock.expectOne(`${environment.apiDivingGroup}`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(payload);
    expect(req.request.withCredentials).toBeTrue();
    req.flush({ success: true });
  });

  it('should update a dive', () => {
    const updatedDive = createMockDive('d3');
    updatedDive.name = 'Plongée Modifiée';

    service.updateDive('d3', updatedDive).subscribe(res => {
      expect(res).toEqual(updatedDive);
    });

    const req = httpMock.expectOne(`${environment.apiDives}/d3`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(updatedDive);
    expect(req.request.withCredentials).toBeTrue();
    req.flush(updatedDive);
  });

  it('should delete a dive', () => {
    const id = 'd4';

    service.delete(id).subscribe(res => {
      expect(res).toBeTruthy();
    });

    const req = httpMock.expectOne(`${environment.apiDives}/${id}`);
    expect(req.request.method).toBe('DELETE');
    expect(req.request.withCredentials).toBeTrue();
    req.flush({ success: true });
  });
});
