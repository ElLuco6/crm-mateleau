import { TestBed } from '@angular/core/testing';
import { DiveWizardService } from './dive-wizard.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { environment } from '../../../environments/environment';
import { of } from 'rxjs';

describe('DiveWizardService', () => {
  let service: DiveWizardService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [DiveWizardService]
    });

    service = TestBed.inject(DiveWizardService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should set and get payload correctly', () => {
    const mockPayload = { name: 'Dive A', duration: 90 };

    service.setPayload(mockPayload);
    const result = service.getPayload();

    expect(result).toEqual(mockPayload);
  });

  it('should warn and return empty object if payload is not set', () => {
    spyOn(console, 'warn');
    const result = service.getPayload();

    expect(console.warn).toHaveBeenCalledWith('🟠 Payload vide ou non initialisé');
    expect(result).toEqual({});
  });

  it('should emit payload through onPayloadReady', (done) => {
    const mockPayload = { location: 'Nice' };

    service.onPayloadReady().subscribe((p) => {
      expect(p).toEqual(mockPayload);
      done();
    });

    service.setPayload(mockPayload);
  });

  it('should send final reservation via POST', () => {
    const payload = { name: 'Final Dive' };

    service.sendFinalReservation(payload).subscribe(res => {
      expect(res).toEqual({ success: true });
    });

    const req = httpMock.expectOne(`${environment.apiDives}`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(payload);
    expect(req.request.withCredentials).toBeTrue();
    req.flush({ success: true });
  });

  it('should call sendFinalReservation inside submitWizard', () => {
    const payload = { name: 'Wizard Dive' };

    // Spy sur la méthode HTTP directe
    const spy = spyOn(service, 'sendFinalReservation').and.returnValue(of({ success: true }));


    service.submitWizard(payload);

    expect(spy).toHaveBeenCalledOnceWith(payload);
  });
});
