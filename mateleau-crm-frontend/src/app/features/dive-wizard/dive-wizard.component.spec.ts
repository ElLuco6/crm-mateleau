import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DiveWizardComponent } from './dive-wizard.component';
import { RouterTestingModule } from '@angular/router/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { DiveWizardService } from './dive-wizard.service';
import { AvailibilityService } from '../../core/service/availibility.service';
import { DivingService } from '../../core/service/diving.service';
import { SpotService } from '../../core/service/spot.service';
import { MatSnackBar } from '@angular/material/snack-bar';

class DiveWizardServiceStub {
  private payload: any = {};
  setPayload(p: any) { this.payload = { ...this.payload, ...p }; }
  getPayload() { return this.payload; }
  onPayloadReady() { return of(this.payload); }
  sendFinalReservation(_: any) { return of({ ok: true }); }
}
class AvailibilityServiceStub {
  getAvailableBoat(_: any, __: any) { return of([]); }
  getAvailableUsers(_: any, __: any) { return of([]); }
  getAvailableDivers(_: any, __: any) { return of([]); }
  getAvailableEquipment(_: any, __: any) { return of([]); }
}
class DivingServiceStub { createDivingGroup(_: any) { return of({ _id: 'g1' }); } }
class SpotServiceStub { getAll() { return of([]); } }

describe('DiveWizardComponent (should create only)', () => {
  let fixture: ComponentFixture<DiveWizardComponent>;
  let component: DiveWizardComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        DiveWizardComponent,       // standalone
        RouterTestingModule,
        HttpClientTestingModule,   // suffit si tu n’es pas en functional providers dans les tests
        NoopAnimationsModule,
      ],
      providers: [
        { provide: ActivatedRoute, useValue: { snapshot: { queryParams: {} } } },
        { provide: MatSnackBar, useValue: { open: () => {} } },
      ],
    });

    // 1) Neutralise le template pour ne PAS instancier les enfants lourds
    TestBed.overrideComponent(DiveWizardComponent, {
      set: { template: '<div>shell</div>', imports: [] }
    });

    // 2) *Au niveau composant*, injecte les stubs (ça battra providedIn:'root')
    TestBed.overrideComponent(DiveWizardComponent, {
      add: {
        providers: [
          { provide: DiveWizardService, useValue: new DiveWizardServiceStub() },
          { provide: AvailibilityService, useValue: new AvailibilityServiceStub() },
          { provide: DivingService, useValue: new DivingServiceStub() },
          { provide: SpotService, useValue: new SpotServiceStub() },
        ],
      },
    });

    await TestBed.compileComponents();

    fixture = TestBed.createComponent(DiveWizardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
