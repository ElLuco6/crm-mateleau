import { ComponentFixture, TestBed, fakeAsync, flushMicrotasks, tick } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { NoopAnimationsModule, provideNoopAnimations } from '@angular/platform-browser/animations';


import { DiveWizardComponent } from './dive-wizard.component';

// Services
import { DiveWizardService } from './dive-wizard.service';
import { AvailibilityService } from '../../core/service/availibility.service';
import { DivingService } from '../../core/service/diving.service';
import { SpotService } from '../../core/service/spot.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

// --- helpers simples (pas besoin d’être exhaustifs) ---
const u1 = { _id: 'u1', name: 'U1', email: 'u1@test', password: '', role: 'Moniteur', divingLvl: 0 } as any;
const makeUser = (id: string) => ({ _id: id, name: id });
const makeDiver = (id: string) => ({ _id: id, firstName: id, lastName: 'X' });
const makeBoat  = (id: string) => ({ _id: id, name: id, numberMaxPlaces: 10 , revisionDate: new Date() });
const makeTeam  = (idGuide: string, diverIds: string[]) => ({
  moniteur: makeUser(idGuide),
  members: diverIds.map(makeDiver),
});


describe('DiveWizardComponent', () => {
  let fixture: ComponentFixture<DiveWizardComponent>;
  let component: DiveWizardComponent;

  let fb: FormBuilder;

  // Spies
  let wizard: jasmine.SpyObj<DiveWizardService>;
  let avail: jasmine.SpyObj<AvailibilityService>;
  let diving: jasmine.SpyObj<DivingService>;
  let spots: jasmine.SpyObj<SpotService>;
  let router: jasmine.SpyObj<Router>;
  let snack: jasmine.SpyObj<MatSnackBar>;
  let snackSpy: jasmine.SpyObj<MatSnackBar>;


  beforeEach(async () => {
      snackSpy = jasmine.createSpyObj<MatSnackBar>('MatSnackBar', ['open']);
    fb = new FormBuilder();
    let httpMock: HttpTestingController;
    wizard = jasmine.createSpyObj<DiveWizardService>(
      'DiveWizardService',
      ['getPayload', 'setPayload', 'onPayloadReady', 'sendFinalReservation']
    );

    avail = jasmine.createSpyObj<AvailibilityService>(
      'AvailibilityService',
      ['getAvailableBoat']
    );

    diving = jasmine.createSpyObj<DivingService>(
      'DivingService',
      ['createDivingGroup']
    );

    spots = jasmine.createSpyObj<SpotService>(
      'SpotService',
      ['getAll']
    );

    router = jasmine.createSpyObj<Router>('Router', ['navigate']);
    snack  = jasmine.createSpyObj<MatSnackBar>('MatSnackBar', ['open']);

    // Valeurs par défaut pour éviter les surprises
    wizard.getPayload.and.returnValue({});
    wizard.onPayloadReady.and.returnValue(of({}));
    spots.getAll.and.returnValue(of([]));
    avail.getAvailableBoat.and.returnValue(of([]));

    await TestBed.configureTestingModule({
      imports: [DiveWizardComponent, ReactiveFormsModule,HttpClientTestingModule,NoopAnimationsModule,RouterTestingModule],
      providers: [
         provideNoopAnimations(),
        { provide: FormBuilder,        useValue: fb },
        { provide: MatSnackBar, useValue: snackSpy }, 
        { provide: DiveWizardService,  useValue: wizard },
        { provide: AvailibilityService,useValue: avail },
        { provide: DivingService,      useValue: diving },
        { provide: SpotService,        useValue: spots },
        { provide: Router,             useValue: router },
        { provide: MatSnackBar,        useValue: snack },
        { provide: ActivatedRoute, useValue: { snapshot: { queryParams: { date: '2025-03-10T10:00:00.000Z' } } } },

        
      ],
      // On ignore le template matériel/enfants (shallow)
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
    httpMock = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(DiveWizardComponent);
    component = fixture.componentInstance;
  });

  // Petit util: initialise ngOnInit sans trigger la vue
  const init = () => {
    component.ngOnInit();
  };

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('ngOnInit: construit les 3 forms et charge les spots', () => {
    init();
    expect(component.scheduleForm).toBeTruthy();
    expect(component.step2FormGroup).toBeTruthy();
    expect(component.step3FormGroup).toBeTruthy();
    expect(spots.getAll).toHaveBeenCalled();
  });

  it('validTeamsValidator: invalide si vide, valide si chaque team a moniteur + 1..3 membres', () => {
    init();
    const c = { value: [] } as any;
    expect(component.validTeamsValidator(c)).toEqual({ noTeams: true });

    const bad = { value: [ { moniteur: null, members: [] } ] } as any;
    expect(component.validTeamsValidator(bad)).toEqual({ invalidTeams: true });

    const okTeams = { value: [ makeTeam('u1', ['d1']), makeTeam('u2', ['d2','d3']) ] } as any;
    expect(component.validTeamsValidator(okTeams)).toBeNull();

    const tooMany = { value: [ makeTeam('u1', ['d1','d2','d3','d4']) ] } as any;
    expect(component.validTeamsValidator(tooMany)).toEqual({ invalidTeams: true });
  });

  it('fetchAvailableBoats: envoie date/heure/duration vers le service et remplit availableBoats', fakeAsync(() => {
    init();

    // on rend le formulaire valide pour déclencher la recherche
    component.scheduleForm.patchValue({
      startDate: new Date('2025-03-10T00:00:00.000Z'),
      startTime: '10:00',
      duration: 60,
      maxDepth: 20,
      location: 'NICE',
    });

    // la combineLatest dans ngOnInit a un debounceTime(300)
    avail.getAvailableBoat.and.returnValue(of([makeBoat('b1'), makeBoat('b2')]));

    // On déclenche manuellement la recherche (normalement faite via valueChanges)
    component.fetchAvailableBoats();

    expect(avail.getAvailableBoat).toHaveBeenCalled();
    expect(component.availableBoats.length).toBe(2);
  }));

 /*  it('onNextStep: met à jour le payload (étape 1 -> 2) et appelle init() du createGroup si step=1', () => {
    init();

    // mock du @ViewChild CreateDiveGroupComponent
    component.createGroupComponent = {
      init: jasmine.createSpy('init'),
    } as any;

    component.currentStep = 1; // on simule passage de l’étape 1 à 2

    // remplir les forms avec des valeurs plausibles
    component.scheduleForm.patchValue({
      startDate: new Date('2025-03-10T00:00:00.000Z'),
      startTime: '10:00',
      duration: 60,
      maxDepth: 20,
      location: 'SPOT',
      boat: makeBoat('b1'),
    });
    component.step2FormGroup.patchValue({
      groups: [ makeTeam('u1', ['d1']) ],
      driver: makeUser('driver1'),
    });

    // payload courant
    wizard.getPayload.and.returnValue({ foo: 'bar' });

    component.onNextStep();

    expect(component.createGroupComponent.init).toHaveBeenCalled();
    expect(wizard.setPayload).toHaveBeenCalled();

    const arg = wizard.setPayload.calls.mostRecent().args[0];
    expect(arg.formValue1.location).toBe('SPOT');
    expect(arg.teams.length).toBe(1);
    expect(arg.driver._id).toBe('driver1');
  });
 */
  it('onNextStep: inclut les equipmentAssignments si step=2 et appelle ngAfterViewInit() du composant enfant', () => {
    init();

    // mock AssignEquipmentComponent
    const fakeAssign = {
      ngAfterViewInit: jasmine.createSpy('ngAfterViewInit'),
      getAssignedEquipmentMap: () => ({
        d1: ['e1', { _id: 'e2' }],
      }),
    } as any;
    component.assignEquipmentComponent = fakeAssign;

    component.currentStep = 2; // on simule passage étape 2 -> 3

    component.scheduleForm.patchValue({
      startDate: new Date('2025-03-10T00:00:00.000Z'),
      startTime: '10:00',
      duration: 60,
      maxDepth: 20,
      location: 'SPOT',
      boat: makeBoat('b1'),
    });
    component.step2FormGroup.patchValue({
      groups: [ makeTeam('u1', ['d1']) ],
      driver: makeUser('driver1'),
    });

    wizard.getPayload.and.returnValue({ foo: 'bar' });

    component.onNextStep();

    expect(fakeAssign.ngAfterViewInit).toHaveBeenCalled();
    expect(wizard.setPayload).toHaveBeenCalled();
    const payload = wizard.setPayload.calls.mostRecent().args[0];
    expect(payload.equipmentAssignments.d1.length).toBe(2);
  });

/* it('submitWizard (succès): crée les groupes, envoie la réservation finale, snackbar + navigate', fakeAsync(() => {
  init(); // si tu as un helper qui fait les spies + detectChanges

  const teams = [
    makeTeam('u1', ['d1','d2']),
    makeTeam('u2', ['d3']),
  ];

  const payload = {
    date: '2025-03-10T10:00:00.000Z',
    duration: 90,
    formValue1: {
      boat: makeBoat('boat1'),
      maxDepth: 30,
      location: 'SPOT-OK',
    },
    driver: makeUser('driver1'),
    teams,
    equipmentAssignments: {
      d1: [{ _id: 'eq1' }],
      d2: ['eq2'],
      d3: [],
    },
  };

  wizard.getPayload.and.returnValue(payload);

  diving.createDivingGroup.and.callFake(() =>
    of({ _id: 'g' + (diving.createDivingGroup.calls.count() + 1) } as any)
  );

  wizard.sendFinalReservation.and.returnValue(of({ ok: true }));
    fixture.detectChanges();

  component.submitWizard();

  // 1) résout les Promises créées par firstValueFrom(...)
  flushMicrotasks();
  // 2) si tu préfères, un tick(0) en plus ne fait pas de mal
  tick();

  // assertions
  expect(diving.createDivingGroup).toHaveBeenCalledTimes(2);
  expect(wizard.sendFinalReservation).toHaveBeenCalledTimes(1);

  // snackbar & navigate
  expect(snackSpy.open).toHaveBeenCalled();             // <-- OK maintenant
  expect(TestBed.inject(Router).navigate).toHaveBeenCalledWith(['/dashboard']);
})); */

  it('submitWizard (erreur groupe): stoppe le process et n’envoie pas la réservation finale', fakeAsync(() => {
    init();

    const teams = [ makeTeam('u1', ['d1']), makeTeam('u2', ['d2']) ];

    wizard.getPayload.and.returnValue({
      date: '2025-03-10T10:00:00.000Z',
      duration: 60,
      formValue1: { boat: makeBoat('b1'), maxDepth: 20, location: 'SPOT' },
      driver: makeUser('driver1'),
      teams,
      equipmentAssignments: {},
    });

    diving.createDivingGroup.and.returnValue(throwError(() => new Error('fail group')));

    component.submitWizard();
    tick();

    expect(diving.createDivingGroup).toHaveBeenCalledTimes(1); // stop après 1er échec
    expect(wizard.sendFinalReservation).not.toHaveBeenCalled();
    // snackbar d’erreur est déclenché seulement dans la phase finale; ici c’est un console.error
  }));

  it('fetchAvailableBoats: gère heure invalide (ne crash pas)', () => {
    init();
    component.scheduleForm.patchValue({
      startDate: new Date(),
      startTime: 'bad-time',
      duration: 60,
      maxDepth: 20,
      location: 'SPOT',
    });

    // ne doit pas appeler le service si heure invalide
    component.fetchAvailableBoats();
    expect(avail.getAvailableBoat).not.toHaveBeenCalled();
  });
});
