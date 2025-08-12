// assign-equipment.component.spec.ts
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';

import { AssignEquipmentComponent } from './assign-equipment.component';
import { AvailibilityService } from '../../../core/service/availibility.service';
import { DiveWizardService } from '../dive-wizard.service';

import { User } from '../../../models/User';
import { Diver } from '../../../models/Diver';
import { Equipment } from '../../../models/Equipment';

// ---------- factories ----------
const makeUser = (id: string, extra: Partial<User> = {}): User => ({
  _id: id,
  name: id,
  email: `${id}@test.local`,
  password: '',
  role: 'Moniteur' as any,
  divingLvl: 0 as 0,
  ...extra,
});

const makeDiver = (
  id: string,
  lvl?: Diver['divingLvl'],
  extra: Partial<Diver> = {}
): Diver => ({
  _id: id,
  firstName: id,
  lastName: 'X',
  divingLvl: (lvl ?? 0) as Diver['divingLvl'],
  age: 0,
  phone: '',
  email: `${id}@diver.local`,
  additionalInfo: '',
  ...extra,
});

const makeEq = (
  id: string,
  nature: Equipment['nature'],
  size: string = '',
  ref = id,
  extra: Partial<Equipment> = {}
): Equipment => {
  const eq = new Equipment(id, nature, ref, new Date(), size);
  Object.assign(eq, extra);
  return eq;
};

describe('AssignEquipmentComponent', () => {
  let fixture: ComponentFixture<AssignEquipmentComponent>;
  let component: AssignEquipmentComponent;

  let avail: jasmine.SpyObj<AvailibilityService>;
  let wizard: jasmine.SpyObj<DiveWizardService>;
  let fb: FormBuilder;

  const payloadBase = {
    date: '2025-08-12T10:00:00.000Z',
    duration: 60,
    teams: [
      { moniteur: makeUser('u1'), members: [makeDiver('d1', 1), makeDiver('d2', 2)] },
      { moniteur: undefined,      members: [makeDiver('d3', 0)] },
    ],
  };

  const eqs = [
    makeEq('eq1', 'combinaison', 'M'),
    makeEq('eq2', 'combinaison', 'L'),
    makeEq('eq3', 'detendeur',   ''),
  ];

  // helper pour initialiser la vue avec les emissions async (delay(0))
  const initView = () => {
    fixture.detectChanges(); // 1er CD : valeurs pré-seed stables
    tick();                  // flush setTimeout(0) + delay(0)
    fixture.detectChanges(); // 2e CD après init réelle
  };

  beforeEach(async () => {
    fb = new FormBuilder();
    avail = jasmine.createSpyObj<AvailibilityService>('AvailibilityService', ['getAvailableEquipment']);
    wizard = jasmine.createSpyObj<DiveWizardService>('DiveWizardService', ['getPayload', 'onPayloadReady']);

    await TestBed.configureTestingModule({
      imports: [AssignEquipmentComponent, ReactiveFormsModule],
      providers: [
        { provide: AvailibilityService, useValue: avail },
        { provide: DiveWizardService,   useValue: wizard },
        { provide: FormBuilder,         useValue: fb },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AssignEquipmentComponent);
    component = fixture.componentInstance;

    // Inputs
    component.formGroup = fb.group({
      equipmentAssignments: fb.group({}),
    });
    component.dataForm = fb.group({});
    component.modeEdit = false;

    // Emissions ASYNC pour éviter NG0100
    wizard.getPayload.and.returnValue({ date: payloadBase.date, duration: payloadBase.duration } as any);
    wizard.onPayloadReady.and.returnValue(of(payloadBase).pipe(delay(0)));
    avail.getAvailableEquipment.and.returnValue(of(eqs).pipe(delay(0)));

    // Pré-seed pour que le 1er CD voie des valeurs stables
    component.teams = payloadBase.teams.slice();
    component.equipmentList = eqs.slice();
    component.groupedEquipment = eqs.reduce((acc, e) => {
      (acc[e.nature] ||= []).push(e);
      return acc;
    }, {} as Record<string, Equipment[]>);

    // crée un contrôle par user (clé = _id) avant 1er CD
    const assignGroup = component.formGroup.get('equipmentAssignments') as FormGroup;
    for (const team of component.teams) {
      if (team.moniteur && !assignGroup.get(team.moniteur._id)) {
        assignGroup.addControl(team.moniteur._id, new FormControl<string[]>([]));
      }
      for (const diver of team.members) {
        if (!assignGroup.get(diver._id)) {
          assignGroup.addControl(diver._id, new FormControl<string[]>([]));
        }
      }
    }
  });

  it('should create', fakeAsync(() => {
    initView();
    expect(component).toBeTruthy();
  }));

  it('ngAfterViewInit: crée un contrôle par utilisateur et groupe le matériel', fakeAsync(() => {
    initView();

    const assignGroup = component.equipmentAssignmentsForm;
    expect(Object.keys(assignGroup.controls).sort()).toEqual(['d1', 'd2', 'd3', 'u1']);

    expect(component.equipmentList.length).toBe(3);
    expect(Object.keys(component.groupedEquipment).sort()).toEqual(['combinaison', 'detendeur']);
    expect(component.groupedEquipment['combinaison'].map(e => e._id).sort()).toEqual(['eq1', 'eq2']);
    expect(component.groupedEquipment['detendeur'].map(e => e._id)).toEqual(['eq3']);
  }));

  it('fetchEquipment(): alimente equipmentList/groupedEquipment (idempotent)', fakeAsync(() => {
    initView();
    component.fetchEquipment(); // second appel
    expect(Object.keys(component.groupedEquipment).sort()).toEqual(['combinaison', 'detendeur']);
  }));

 it('assignEquipmentTo: toggle pour le même user et refuse si déjà assigné ailleurs', fakeAsync(() => {
  initView();
  const assignGroup = component.equipmentAssignmentsForm;

  const userId1 = 'd1';
  const userId2 = 'u1';
  const eq = eqs[0]; // eq1

  // 1) assigner à d1 → ajout
  component.assignEquipmentTo(userId1, eq);
  const v1 = (assignGroup.get(userId1) as any).value ?? [];
  const ids1 = v1.map((x: any) => typeof x === 'string' ? x : x._id);
  expect(ids1).toEqual(['eq1']);
  expect(component.equipmentOwnership['eq1']).toBe(userId1);

  // 2) re-toggle pour d1 → suppression
  component.assignEquipmentTo(userId1, eq);
  const v2 = (assignGroup.get(userId1) as any).value ?? [];
  expect(v2.length).toBe(0);
  expect(component.equipmentOwnership['eq1']).toBeUndefined();

  // 3) d1 prend eq1, puis u1 tente → refus pour u1
  component.assignEquipmentTo(userId1, eq);
  component.assignEquipmentTo(userId2, eq);
  const v3 = (assignGroup.get(userId2) as any).value ?? [];
  const ids3 = v3.map((x: any) => typeof x === 'string' ? x : x._id);
  expect(ids3).toEqual([]);
  expect(component.equipmentOwnership['eq1']).toBe(userId1);
}));

  it('assignEquipmentToSelected: set exclusif (string id) sur selectedUserId', fakeAsync(() => {
    initView();
    const assignGroup = component.equipmentAssignmentsForm;

    component.selectedUserId = 'd2';
    (assignGroup.get('d2') as FormControl<string[]>).setValue(['foo']);
    component.assignEquipmentToSelected('eq3');

    expect((assignGroup.get('d2') as FormControl<string[]>).value).toEqual(['eq3']);
  }));

  it('isAlreadyAssigned: détecte si un équipement id est déjà pris par un user', fakeAsync(() => {
    initView();
    const assignGroup = component.equipmentAssignmentsForm;

    (assignGroup.get('d1') as FormControl<string[]>).setValue(['eq1']);
    (assignGroup.get('u1') as FormControl<string[]>).setValue(['eq3']);

    expect(component.isAlreadyAssigned('eq1')).toBeTrue();
    expect(component.isAlreadyAssigned('eq2')).toBeFalse();
    expect(component.isAlreadyAssigned('eq3')).toBeTrue();
  }));

  it('getAssignedEquipment: projette les ids du form en objets Equipment', fakeAsync(() => {
    initView();
    const assignGroup = component.equipmentAssignmentsForm;

    (assignGroup.get('d3') as FormControl<string[]>).setValue(['eq1', 'eq3']);
    const list = component.getAssignedEquipment('d3');

    expect(list.map(e => e._id).sort()).toEqual(['eq1', 'eq3']);
  }));

  it('getAllUsers / getUserById / getShortName', fakeAsync(() => {
    initView();

    const all = component.getAllUsers().map(u => u._id).sort();
    expect(all).toEqual(['d1', 'd2', 'd3', 'u1']);

    expect(component.getUserById('d2')?._id).toBe('d2');
    expect(component.getUserById('zz')).toBeUndefined();

    expect(component.getShortName('d1')).toBe('d1 X'); // Diver
    expect(component.getShortName('u1')).toBe('u1');   // User
    expect(component.getShortName('??')).toBe('???');  // inconnu
  }));
});
