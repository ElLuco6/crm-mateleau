import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateDiveGroupComponent } from './create-dive-group.component';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { of } from 'rxjs';

// Tokens réels
import { AvailibilityService } from '../../../core/service/availibility.service';
import { DiveWizardService } from '../dive-wizard.service';

// ---- Stubs ----
class AvailibilityServiceStub {
  getAvailableUsers(_: any, __: any)  { return of([]); }
  getAvailableDivers(_: any, __: any) { return of([]); }
}

class DiveWizardServiceStub {
  private payload: any = {
    date: new Date().toISOString(),
    duration: 60,
    formValue1: { maxDepth: 20, boat: { numberMaxPlaces: 10 } },
  };
  getPayload() { return this.payload; }
  onPayloadReady() { return of(this.payload); }
  setPayload(p: any) { this.payload = { ...this.payload, ...p }; }
}

describe('CreateDiveGroupComponent (should create)', () => {
  let fixture: ComponentFixture<CreateDiveGroupComponent>;
  let component: CreateDiveGroupComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        CreateDiveGroupComponent, // standalone (importe Forms/Reactive/Common)
        ReactiveFormsModule,      // ceinture+bretelles pour FormBuilder
      ],
      providers: [
        { provide: AvailibilityService, useClass: AvailibilityServiceStub },
        { provide: DiveWizardService,   useClass: DiveWizardServiceStub },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateDiveGroupComponent);
    component = fixture.componentInstance;

    // ---- Initialiser les @Input() AVANT detectChanges ----
    const fb = TestBed.inject(FormBuilder);

    // dataForm1: contient le contrôle 'boat' (null pour éviter fetch dans ngOnChanges)
    component.dataForm1 = fb.group({
      boat: [null],
    });

    // formGroup: contient au minimum 'groups' (utilisé dans le composant)
    component.formGroup = fb.group({
      groups: [[]],   // valeur par défaut = teams initiale vide
      // driver sera ajouté par init() en prod; ici on ne l’appelle pas
    });

    component.modeEdit = false; // chemin “création” (le plus simple)

    // IMPORTANT: ne pas appeler component.init() pour ce test “should create”
    // Ainsi, pas d’appels à dispo tant que dataForm1.boat est null.

    fixture.detectChanges(); // déclenche ngOnChanges (safe car boat === null)
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
