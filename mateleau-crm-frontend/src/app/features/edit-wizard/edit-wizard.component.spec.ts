import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditWizardComponent } from './edit-wizard.component';
import { RouterTestingModule } from '@angular/router/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { of } from 'rxjs';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

// === IMPORT LES VRAIS TOKENS ===
import { DiveWizardService } from '../dive-wizard/dive-wizard.service';
import { DivingService } from '../../core/service/diving.service';
import { AvailibilityService } from '../../core/service/availibility.service';
import { SpotService } from '../../core/service/spot.service';
import { MatSnackBar } from '@angular/material/snack-bar';

// === STUBS ULTRA SIMPLES ===
class DiveWizardServiceStub {
  private payload: any = {};
  setPayload(p: any) { this.payload = { ...this.payload, ...p }; }
  getPayload() { return this.payload; }
}

class DivingServiceStub {
  getDiveById(_: string) {
    return of({
      _id: 'd1',
      date: new Date().toISOString(),
      duration: 60,
      maxDepth: 20,
      location: 'Spot A',
      boat: { _id: 'b1', name: 'Blue', numberMaxPlaces: 8 },
      driver: { _id: 'u1', firstName: 'John' },
      divingGroups: [{ guide: { _id: 'u2' }, divers: [], rentedEquipment: [] }],
    });
  }
  createDivingGroup(_: any) { return of({ _id: 'g1' }); }
  updateDive(_: string, __: any) { return of({ ok: true }); }
}

class AvailibilityServiceStub {
  getAvailableBoat(_: any, __: any) { return of([]); }
  getAvailableUsers(_: any, __: any) { return of([]); }  
  getAvailableDivers(_: any, __: any) { return of([]); } 
  getAvailableEquipment(_: any, __: any) { return of([]); }
}

class SpotServiceStub {
  getAll() { return of([]); }
}

describe('EditWizardComponent', () => {
  let fixture: ComponentFixture<EditWizardComponent>;
  let component: EditWizardComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        EditWizardComponent,      // standalone
        RouterTestingModule,
        HttpClientTestingModule,
        NoopAnimationsModule,
        ReactiveFormsModule,
      ],
      providers: [
        { provide: ActivatedRoute, useValue: { params: of({ id: 'd1' }) } },
        { provide: DiveWizardService, useClass: DiveWizardServiceStub },
        { provide: DivingService, useClass: DivingServiceStub },
        { provide: AvailibilityService, useClass: AvailibilityServiceStub },
        { provide: SpotService, useClass: SpotServiceStub },
        { provide: MatSnackBar, useValue: { open: () => {} } },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(EditWizardComponent);
    component = fixture.componentInstance;

    // ⚠️ Initialisation manuelle des FormGroup pour éviter NG01052
    const fb = TestBed.inject(FormBuilder);

    component.scheduleForm = fb.group({
      startDate: [new Date(), Validators.required],
      startTime: ['09:00', Validators.required],
      duration: [60, Validators.required],
      boat: [{ _id: 'b1', name: 'Blue' }, Validators.required],
      maxDepth: [20, Validators.required],
      location: ['Spot A', Validators.required],
    });

    component.step2FormGroup = fb.group({
      groups: [[], Validators.required],
      driver: ['u1', Validators.required],
    });

    component.step3FormGroup = fb.group({
      equipmentAssignments: fb.group({}),
    });

    // Variables utilisées dans le template
    (component as any).availableBoats = [];
    (component as any).location = [];

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
