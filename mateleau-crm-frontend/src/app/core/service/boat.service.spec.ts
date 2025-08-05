import { TestBed } from '@angular/core/testing';
import { BoatService } from './boat.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { environment } from '../../../environments/environment';
import { Boat } from '../../models/Boat';

describe('BoatService', () => {
  let service: BoatService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [BoatService]
    });

    service = TestBed.inject(BoatService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should fetch all boats', () => {
    const mockBoats: Boat[] = [
      new Boat('b1', 'Titanic', 100, new Date())
    ];

    service.getAll().subscribe(res => {
      expect(res).toEqual(mockBoats);
    });

    const req = httpMock.expectOne(`${environment.apiBoats}`);
    expect(req.request.method).toBe('GET');
    expect(req.request.withCredentials).toBeTrue();
    req.flush(mockBoats);
  });

  it('should create a boat', () => {
    const newBoat = new Boat('b2', 'Poseidon', 12, new Date());

    service.create(newBoat).subscribe(res => {
      expect(res).toEqual(newBoat);
    });

    const req = httpMock.expectOne(`${environment.apiBoats}`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newBoat);
    expect(req.request.withCredentials).toBeTrue();
    req.flush(newBoat);
  });

  it('should update a boat', () => {
    const updatedBoat = new Boat('b3', 'Nautilus', 20, new Date());

    service.update(updatedBoat).subscribe(res => {
      expect(res).toEqual(updatedBoat);
    });

    const req = httpMock.expectOne(`${environment.apiBoats}/b3`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(updatedBoat);
    expect(req.request.withCredentials).toBeTrue();
    req.flush(updatedBoat);
  });

  it('should delete a boat by id', () => {
    const boatId = 'b4';

    service.delete(boatId).subscribe(res => {
      expect(res).toBeTruthy();
    });

    const req = httpMock.expectOne(`${environment.apiBoats}/${boatId}`);
    expect(req.request.method).toBe('DELETE');
    expect(req.request.withCredentials).toBeTrue();
    req.flush({ success: true });
  });
});
