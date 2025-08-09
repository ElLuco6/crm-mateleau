import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AssignEquipmentComponent } from './assign-equipment.component';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { of } from 'rxjs';

// Tokens réels
import { AvailibilityService } from '../../../core/service/availibility.service';
import { DiveWizardService } from '../dive-wizard.service';

// --- Stubs ---
class AvailibilityServiceStub {
  getAvailableEquipment(_: any, __: any) { return of([]); }
}
class DiveWizardServiceStub {
  private payload: any = {
    teams: [],                   // important pour éviter les .map sur undefined
    date: new Date().toISOString(),
    duration: 60,
  };
  onPayloadReady() { return of(this.payload); }
  getPayload() { return this.payload; }
  setPayload(p: any) { this.payload = { ...this.payload, ...p }; }
}

describe('AssignEquipmentComponent', () => {
  let fixture: ComponentFixture<AssignEquipmentComponent>;
  let component: AssignEquipmentComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        AssignEquipmentComponent,  // standalone (importe CommonModule + ReactiveFormsModule)
        ReactiveFormsModule,       // ceinture + bretelles pour FormBuilder
      ],
      providers: [
        { provide: AvailibilityService, useClass: AvailibilityServiceStub },
        { provide: DiveWizardService, useClass: DiveWizardServiceStub },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AssignEquipmentComponent);
    component = fixture.componentInstance;

    // ⚙️ Initialise les @Input() avant detectChanges
    const fb = TestBed.inject(FormBuilder);
    component.formGroup = fb.group({
      equipmentAssignments: fb.group({}) // requis par le composant
    });
    component.dataForm = fb.group({});
    component.modeEdit = false; // le chemin le plus simple (utilise onPayloadReady + getAvailableEquipment)

    fixture.detectChanges(); // déclenche ngAfterViewInit
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
