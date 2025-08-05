import { TestBed } from '@angular/core/testing';
import { SpotService } from './spot.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Spot } from '../../models/Spot';
import { environment } from '../../../environments/environment';

describe('SpotService', () => {
  let service: SpotService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [SpotService],
    });

    service = TestBed.inject(SpotService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  function createMockSpot(id: string): Spot {
    return {
      _id: id,
      name: 'Calanque Bleue',
      coordinates: {
        lat: 43.2,
        lng: 5.4
      }
    };
  }

  it('should fetch all spots', () => {
    const mockSpots: Spot[] = [createMockSpot('s1')];

    service.getAll().subscribe(res => {
      expect(res).toEqual(mockSpots);
    });

    const req = httpMock.expectOne(`${environment.apiSpots}`);
    expect(req.request.method).toBe('GET');
    expect(req.request.withCredentials).toBeTrue();
    req.flush(mockSpots);
  });

  it('should fetch a spot by id', () => {
    const mockSpot = createMockSpot('s2');

    service.getById('s2').subscribe(res => {
      expect(res).toEqual(mockSpot);
    });

    const req = httpMock.expectOne(`${environment.apiSpots}/s2`);
    expect(req.request.method).toBe('GET');
    expect(req.request.withCredentials).toBeTrue();
    req.flush(mockSpot);
  });

  it('should create a spot', () => {
    const newSpot = createMockSpot('s3');

    service.create(newSpot).subscribe(res => {
      expect(res).toEqual(newSpot);
    });

    const req = httpMock.expectOne(`${environment.apiSpots}`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newSpot);
    expect(req.request.withCredentials).toBeTrue();
    req.flush(newSpot);
  });

  it('should update a spot', () => {
    const updatedSpot: Partial<Spot> = {
      name: 'Spot Modifié',
      coordinates: { lat: 43.3, lng: 5.5 }
    };

    const id = 's4';

    service.update(id, updatedSpot).subscribe(res => {
      expect(res).toEqual(jasmine.objectContaining(updatedSpot));
    });

    const req = httpMock.expectOne(`${environment.apiSpots}/${id}`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(updatedSpot);
    expect(req.request.withCredentials).toBeTrue();
    req.flush({ ...updatedSpot, _id: id });
  });

  it('should delete a spot by id', () => {
    const id = 's5';

    service.delete(id).subscribe(res => {
      expect(res).toBeTruthy();
    });

    const req = httpMock.expectOne(`${environment.apiSpots}/${id}`);
    expect(req.request.method).toBe('DELETE');
    expect(req.request.withCredentials).toBeTrue();
    req.flush({ success: true });
  });
});
