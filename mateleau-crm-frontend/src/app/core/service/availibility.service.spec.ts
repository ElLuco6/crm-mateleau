import { TestBed } from '@angular/core/testing';

import { AvailibilityService } from './availibility.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { environment } from '../../../environments/environment';
import { Boat } from '../../models/Boat';
import { User } from '../../models/User';
import { Diver } from '../../models/Diver';
import { Dive } from '../../models/Dive';
import { Equipment } from '../../models/Equipment';


describe('AvailibilityService', () => {
  let service: AvailibilityService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AvailibilityService],
    });

    service = TestBed.inject(AvailibilityService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should fetch available boats', () => {
    const mockBoats: Boat[] = [{ _id: '1', name: 'Titanic', numberMaxPlaces: 100, revisionDate: new Date() }] as Boat[];
    const date = '2025-08-05';
    const duration = 2;

    service.getAvailableBoat(date, duration).subscribe(res => {
      expect(res).toEqual(mockBoats);
    });

    const req = httpMock.expectOne(`${environment.apiAviability}/boats?date=${date}&duration=${duration}`);
    expect(req.request.method).toBe('GET');
    expect(req.request.withCredentials).toBeTrue();
    req.flush(mockBoats);
  });

  it('should fetch available users', () => {
    const mockUsers: User[] = [{ _id: 'u1', email: 'a@a.com', name: 'Alice', divingLvl: 5, password: 'password', role: 'admin' }] as User[];
    const date = new Date();
    const duration = 1;

    service.getAvailableUsers(date, duration).subscribe(res => {
      expect(res).toEqual(mockUsers);
    });

    const req = httpMock.expectOne(`${environment.apiAviability}/users?date=${date}&duration=${duration}`);
    expect(req.request.method).toBe('GET');
    expect(req.request.withCredentials).toBeTrue();
    req.flush(mockUsers);
  });

  it('should fetch available divers', () => {
    const mockDivers: Diver[] = [{ _id: 'd1', firstName: 'Bob', lastName: 'Marley', divingLvl: 5, age: 30, phone: '123-456-7890',email: 'aa@a.fr',additionalInfo:"like cool diving" }] as Diver[];
    const date = new Date();
    const duration = 1;

    service.getAvailableDivers(date, duration).subscribe(res => {
      expect(res).toEqual(mockDivers);
    });

    const req = httpMock.expectOne(`${environment.apiAviability}/divers?date=${date}&duration=${duration}`);
    expect(req.request.method).toBe('GET');
    expect(req.request.withCredentials).toBeTrue();
    req.flush(mockDivers);
  });

  it('should fetch dive month data', () => {
    const mockDive = new Dive(
  'd1',
  'Morning Dive',
  'Nice Bay',
  new Date(),
  2,
  30,
  [],
  new Boat('b1', 'Diving Boat', 10, new Date()),
  new User('u1', 'Alice', 'password','a@a.com', 'admin', 5)
);
const mockDives: Dive[] = [mockDive];
    const date = new Date();

    service.getDiveMonth(date).subscribe(res => {
      expect(res).toEqual(mockDives);
    });

    const req = httpMock.expectOne(`${environment.apiAviability}/dive/month?date=${date}`);
    expect(req.request.method).toBe('GET');
    expect(req.request.withCredentials).toBeTrue();
    req.flush(mockDives);
  });

  it('should fetch available equipment', () => {
    const mockEquip = new Equipment(
  'e1',
  'bouteille', // doit être une des valeurs du type `nature`
  'REF123',
  new Date(),
  'Large'
);
const mockEquipment: Equipment[] = [mockEquip];
    const date = new Date();
    const duration = 2;

    service.getAvailableEquipment(date, duration).subscribe(res => {
      expect(res).toEqual(mockEquipment);
    });

    const req = httpMock.expectOne(`${environment.apiAviability}/equipment?date=${date}&duration=${duration}`);
    expect(req.request.method).toBe('GET');
    expect(req.request.withCredentials).toBeTrue();
    req.flush(mockEquipment);
  });
});