import { TestBed } from '@angular/core/testing';
import { DiverServiceService } from './diver-service.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { environment } from '../../../environments/environment';
import { Diver } from '../../models/Diver';

describe('DiverServiceService', () => {
  let service: DiverServiceService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [DiverServiceService]
    });

    service = TestBed.inject(DiverServiceService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should fetch all divers', () => {
    const mockDivers: Diver[] = [
      new Diver('d1',  'Bob',  'Marley',  5,  30,  '123-456-7890', 'aa@a.fr',"like cool diving", [])
    ];

    service.getAll().subscribe(res => {
      expect(res).toEqual(mockDivers);
    });

    const req = httpMock.expectOne(`${environment.apiDiver}`);
    expect(req.request.method).toBe('GET');
    expect(req.request.withCredentials).toBeTrue();
    req.flush(mockDivers);
  });

  it('should create a diver', () => {
    const newDiver = new Diver( 'd1',  'Bob',  'Marley',  5,  30,  '123-456-7890' ,'aa@a.fr',"like cool diving", [] );

    service.create(newDiver).subscribe(res => {
      expect(res).toEqual(newDiver);
    });

    const req = httpMock.expectOne(`${environment.apiDiver}`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newDiver);
    req.flush(newDiver);
  });

  it('should update a diver', () => {
    const updatedDiver = new Diver('d1',  'Bob',  'Marley',  5,  30,  '123-456-7890' ,'aa@a.fr',"like cool diving", [] );

    service.update(updatedDiver).subscribe(res => {
      expect(res).toEqual(updatedDiver);
    });

    const req = httpMock.expectOne(`${environment.apiDiver}/d1`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(updatedDiver);
    req.flush(updatedDiver);
  });

  it('should delete a diver by ID', () => {
    const diverId = 'd4';

    service.delete(diverId).subscribe(res => {
      expect(res).toBeTruthy();
    });

    const req = httpMock.expectOne(`${environment.apiDiver}/${diverId}`);
    expect(req.request.method).toBe('DELETE');
    req.flush({ success: true });
  });
});
