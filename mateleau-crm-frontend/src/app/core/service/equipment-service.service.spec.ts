import { TestBed } from '@angular/core/testing';
import { EquipmentServiceService } from './equipment-service.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Equipment } from '../../models/Equipment';
import { environment } from '../../../environments/environment';

describe('EquipmentServiceService', () => {
  let service: EquipmentServiceService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [EquipmentServiceService]
    });

    service = TestBed.inject(EquipmentServiceService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  function createMockEquipment(id: string): Equipment {
    return new Equipment(
      id,
      'bouteille',  // doit correspondre à ton union `nature`
      'REF-1234',
      new Date(),
      'L'
    );
  }

  it('should fetch all equipment', () => {
    const mockEquipment: Equipment[] = [createMockEquipment('e1')];

    service.getAll().subscribe(res => {
      expect(res).toEqual(mockEquipment);
    });

    const req = httpMock.expectOne(`${environment.apiEquipment}`);
    expect(req.request.method).toBe('GET');
    expect(req.request.withCredentials).toBeTrue();
    req.flush(mockEquipment);
  });

  it('should create equipment', () => {
    const newEquip = createMockEquipment('e2');

    service.create(newEquip).subscribe(res => {
      expect(res).toEqual(newEquip);
    });

    const req = httpMock.expectOne(`${environment.apiEquipment}`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newEquip);
    expect(req.request.withCredentials).toBeTrue();
    req.flush(newEquip);
  });

  it('should update equipment', () => {
    const updatedEquip = createMockEquipment('e3');
    updatedEquip.size = 'XL';

    service.update(updatedEquip).subscribe(res => {
      expect(res).toEqual(updatedEquip);
    });

    const req = httpMock.expectOne(`${environment.apiEquipment}/e3`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(updatedEquip);
    expect(req.request.withCredentials).toBeTrue();
    req.flush(updatedEquip);
  });

  it('should delete equipment', () => {
    const id = 'e4';

    service.delete(id).subscribe(res => {
      expect(res).toBeTruthy();
    });

    const req = httpMock.expectOne(`${environment.apiEquipment}/${id}`);
    expect(req.request.method).toBe('DELETE');
    expect(req.request.withCredentials).toBeTrue();
    req.flush({ success: true });
  });
});
