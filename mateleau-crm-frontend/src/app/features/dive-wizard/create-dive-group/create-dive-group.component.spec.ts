// create-dive-group.component.spec.ts
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormControl, ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';

import { CreateDiveGroupComponent } from './create-dive-group.component';
import { AvailibilityService } from '../../../core/service/availibility.service';
import { DiveWizardService } from '../dive-wizard.service';

import { User } from '../../../models/User';
import { Diver } from '../../../models/Diver';

// ---------- factories typées ----------
const makeUser = (id: string, extra: Partial<User> = {}): User => ({
  _id: id,
  name: id,
  email: `${id}@test.local`,
  password: '',             // adapte si ton modèle impose autre chose
  role: 'Moniteur' as any,  // ajuste selon ton type (enum/union)
  divingLvl: 0,
  ...extra,
});

// Diver: fournis tous les champs REQUIRED avec des valeurs par défaut
const makeDiver = (
  id: string,
  lvl?: Diver['divingLvl'],
  extra: Partial<Diver> = {}
): Diver => ({
  _id: id,
  firstName: id,
  lastName: 'X',
  divingLvl: (lvl ?? 0) as Diver['divingLvl'], // 0|1|2|3|4|5
  age: 0,                     
  phone: '',                  
  email: `${id}@diver.local`, 
  additionalInfo: '',         
  
  ...extra,
});

describe('CreateDiveGroupComponent (aligné à la logique actuelle)', () => {
  let fixture: ComponentFixture<CreateDiveGroupComponent>;
  let component: CreateDiveGroupComponent;

  let avail: jasmine.SpyObj<AvailibilityService>;
  let wizard: jasmine.SpyObj<DiveWizardService>;
  let fb: FormBuilder;

  const payloadBase = {
    date: '2025-08-12T10:00:00.000Z',
    duration: 60,
    formValue1: { maxDepth: 30, boat: { numberMaxPlaces: 12 } },
  };

  beforeEach(async () => {
    fb = new FormBuilder();
    avail = jasmine.createSpyObj<AvailibilityService>('AvailibilityService', ['getAvailableUsers', 'getAvailableDivers']);
    wizard = jasmine.createSpyObj<DiveWizardService>('DiveWizardService', ['getPayload', 'onPayloadReady', 'setPayload']);

    await TestBed.configureTestingModule({
      imports: [CreateDiveGroupComponent, ReactiveFormsModule],
      providers: [
        { provide: AvailibilityService, useValue: avail },
        { provide: DiveWizardService, useValue: wizard },
        { provide: FormBuilder, useValue: fb },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateDiveGroupComponent);
    component = fixture.componentInstance;

    // Inputs requis (init écrit dans 'teams', le reste utilise 'groups')
    component.dataForm1 = fb.group({ boat: new FormControl(null) });
    component.formGroup = fb.group({
      teams: [[]],   // utilisé dans init()
      groups: [[]],  // utilisé ailleurs
    });

    wizard.getPayload.and.returnValue(payloadBase);
    wizard.onPayloadReady.and.returnValue(of(payloadBase));

    // depth = 30 → seuls les divers niveau >= 2 (40m) passent
    avail.getAvailableUsers.and.returnValue(of([makeUser('u1'), makeUser('u2')]));
    avail.getAvailableDivers.and.returnValue(of([makeDiver('dv0', 0), makeDiver('dv1', 1), makeDiver('dv2', 2)]));
  });

  it('init(): récupère moniteurs/divers (filtrés), définit boatLimit et prépare form', () => {
    component.dataForm1.patchValue({ boat: { numberMaxPlaces: 15 } });

    component.init();

    expect(avail.getAvailableUsers).toHaveBeenCalled();
    expect(avail.getAvailableDivers).toHaveBeenCalled();

    expect(component.moniteurs.map(m => m._id)).toEqual(['u1', 'u2']);
    expect(component.initialMoniteurs.length).toBe(2);

    expect(component.divers.map(x => x._id)).toEqual(['dv2']);
    expect(component.initialDivers.length).toBe(1);

    expect(component.boatLimit).toBe(15);
    expect(component.formGroup.get('teams')?.value.length).toBe(1);
    expect(component.formGroup.get('driver')).toBeTruthy();
  });

  it('ngOnChanges(): met à jour boatLimit et déclenche fetch', () => {
    const spyFetch = spyOn(component, 'fetchDiversAndMoniteurs').and.callThrough();
    component.dataForm1.patchValue({ boat: { numberMaxPlaces: 20 } });

    component.ngOnChanges();

    expect(component.boatLimit).toBe(20);
    expect(spyFetch).toHaveBeenCalled();
  });

  it('getAvailableDrivers(): exclut driver sélectionné et moniteurs déjà assignés', () => {
    component.initialMoniteurs = [makeUser('u1'), makeUser('u2'), makeUser('u3')];
    component.selectedDriver = makeUser('u2');
    component.teams = [{ moniteur: makeUser('u1'), members: [] }];

    const res = component.getAvailableDrivers();
    expect(res.map(x => x._id)).toEqual(['u3']);
  });

  it('onSelectDriver(): met driver (id), retire des moniteurs et nettoie les teams', () => {
    component.formGroup.setControl('driver', new FormControl(null));
    component.initialMoniteurs = [makeUser('u1'), makeUser('u2')];
    component.moniteurs = [makeUser('u1'), makeUser('u2')];
    component.selectedDriver = makeUser('u1'); // ancien driver
    component.teams = [{ moniteur: makeUser('u2'), members: [] }];

    component.onSelectDriver(makeUser('u2'));

    expect(component.selectedDriver?._id).toBe('u2');
    expect(component.formGroup.get('driver')?.value).toBe('u2'); // id
    expect(component.moniteurs.some(m => m._id === 'u2')).toBeFalse();
    expect(component.teams[0].moniteur).toBeUndefined();
  });

  it('selectDriver(): en mode selectingDriver, met driver (objet), retire des moniteurs et des teams', () => {
    component.formGroup.setControl('driver', new FormControl(null));
    component.selectingDriver = true;

    component.moniteurs = [makeUser('u1'), makeUser('u2')];
    component.teams = [{ moniteur: makeUser('u1'), members: [] }];

    component.selectDriver(makeUser('u1'));

    expect(component.selectedDriver?._id).toBe('u1');
    expect(component.selectingDriver).toBeFalse();
    expect(component.formGroup.get('driver')?.value._id).toBe('u1'); // objet
    expect(component.moniteurs.some(m => m._id === 'u1')).toBeFalse();
    expect(component.teams[0].moniteur).toBeUndefined();
  });

  it('setDriver(): met driver (objet), purge des teams et filtre moniteurs initiaux', () => {
    component.formGroup.setControl('driver', new FormControl(null));
    component.initialMoniteurs = [makeUser('u1'), makeUser('u2'), makeUser('u3')];
    component.moniteurs = [makeUser('u1'), makeUser('u2'), makeUser('u3')];
    component.teams = [{ moniteur: makeUser('u1'), members: [] }, { moniteur: makeUser('u2'), members: [] }];

    component.setDriver(makeUser('u1'));

    expect(component.selectedDriver?._id).toBe('u1');
    expect(component.formGroup.get('driver')?.value._id).toBe('u1'); // objet
    expect(component.teams[0].moniteur).toBeUndefined();
    expect(component.teams[1].moniteur?._id).toBe('u2');
    expect(component.moniteurs.map(m => m._id)).toEqual(['u2', 'u3']);
  });

  it('addTeam(): pousse une équipe et écrit dans groups', () => {
    const spySet = spyOn(component.formGroup.get('groups')!, 'setValue').and.callThrough();
    const before = component.teams.length;

    component.addTeam();

    expect(component.teams.length).toBe(before + 1);
    expect(spySet).toHaveBeenCalledWith(component.teams);
  });

  it('selectTeam(): change l’index sélectionné', () => {
    component.selectTeam(1);
    expect(component.selectedTeam).toBe(1);
  });

  it('AddOnSelectedTeam(): ajoute des plongeurs (limite 3, pas de doublon) et met à jour groups', () => {
    component.formGroup.setControl('groups', new FormControl([]));
    component.boatLimit = 10;
    component.teams = [{ moniteur: undefined, members: [] }];
    component.selectedTeam = 0;
    component.divers = [makeDiver('a'), makeDiver('b'), makeDiver('c'), makeDiver('d')];

    const spySet = spyOn(component.formGroup.get('groups')!, 'setValue').and.callThrough();

    component.AddOnSelectedTeam(makeDiver('a'));
    component.AddOnSelectedTeam(makeDiver('b'));
    component.AddOnSelectedTeam(makeDiver('c'));
    component.AddOnSelectedTeam(makeDiver('d')); // rejet (4e)
    component.AddOnSelectedTeam(makeDiver('a')); // rejet (doublon)

    expect(component.teams[0].members.map(x => x._id)).toEqual(['a', 'b', 'c']);
    expect(spySet).toHaveBeenCalledTimes(3);
  });

  it('AddOnSelectedTeam(): respecte la capacité bateau', () => {
    component.boatLimit = 1;
    component.selectedDriver = makeUser('drv'); // compte pour 1
    component.teams = [{ moniteur: undefined, members: [] }];
    component.selectedTeam = 0;
    component.divers = [makeDiver('a')];

    component.AddOnSelectedTeam(makeDiver('a')); // bloqué
    expect(component.teams[0].members.length).toBe(0);
  });

  it('AddOnSelectedTeam(): ajoute/remplace le moniteur (pas si driver) et met à jour moniteurs', () => {
    component.formGroup.setControl('groups', new FormControl([]));
    component.boatLimit = 10;
    component.selectedDriver = makeUser('drv');
    component.initialMoniteurs = [makeUser('m1'), makeUser('m2'), makeUser('drv')];
    component.moniteurs = [makeUser('m1'), makeUser('m2')];
    component.teams = [{ moniteur: makeUser('m1'), members: [] }];
    component.selectedTeam = 0;

    const spySet = spyOn(component.formGroup.get('groups')!, 'setValue').and.callThrough();

    component.AddOnSelectedTeam(undefined, makeUser('drv')); // ignoré (driver)
    expect(component.teams[0].moniteur?._id).toBe('m1');

    component.AddOnSelectedTeam(undefined, makeUser('m1')); // déjà présent → ignoré
    expect(component.teams[0].moniteur?._id).toBe('m1');

    component.AddOnSelectedTeam(undefined, makeUser('m2')); // remplace m1 -> m2
    expect(component.teams[0].moniteur?._id).toBe('m2');
    expect(component.moniteurs.some(m => m._id === 'm1')).toBeTrue();
    expect(component.moniteurs.some(m => m._id === 'm2')).toBeFalse();
    expect(spySet).toHaveBeenCalledTimes(1);
  });

  it('removeFromSelectedTeam(): retire plongeur et moniteur (≠ driver)', () => {
    component.divers = [];
    component.moniteurs = [];
    component.selectedDriver = makeUser('drv');
    component.teams = [{ moniteur: makeUser('m1'), members: [makeDiver('a'), makeDiver('b')] }];
    component.selectedTeam = 0;

    component.removeFromSelectedTeam(makeDiver('a'));
    expect(component.divers.map(x => x._id)).toEqual(['a']);
    expect(component.teams[0].members.map(x => x._id)).toEqual(['b']);

    component.removeFromSelectedTeam(undefined, makeUser('m1'));
    expect(component.teams[0].moniteur).toBeUndefined();
    expect(component.moniteurs.some(m => m._id === 'm1')).toBeTrue();
  });

  it('removeTeam(): rend membres/moniteur aux listes et met à jour groups', () => {
    const spySet = spyOn(component.formGroup.get('groups')!, 'setValue').and.callThrough();

    component.selectedDriver = makeUser('udrv');
    component.divers = [];
    component.moniteurs = [makeUser('u2')];
    component.teams = [
      { moniteur: makeUser('u1'), members: [makeDiver('d1'), makeDiver('d2')] },
      { moniteur: makeUser('u2'), members: [makeDiver('d3')] },
    ];
    component.selectedTeam = 1;

    component.removeTeam(0);

    expect(component.divers.map(x => x._id)).toEqual(['d1', 'd2']);
    expect(component.moniteurs.some(m => m._id === 'u1')).toBeTrue();
    expect(component.teams.length).toBe(1);
    expect(component.selectedTeam).toBe(0);
    expect(spySet).toHaveBeenCalledWith(component.teams);
  });

  it('fetchDiversAndMoniteurs(): recharge listes et exclut driver', () => {
    component.selectedDriver = makeUser('u2');
    wizard.getPayload.and.returnValue(payloadBase);
    avail.getAvailableUsers.and.returnValue(of([makeUser('u1'), makeUser('u2'), makeUser('u3')]));
    avail.getAvailableDivers.and.returnValue(of([makeDiver('a', 2), makeDiver('b', 1)]));

    component.fetchDiversAndMoniteurs();

    expect(component.initialMoniteurs.length).toBe(3);
    expect(component.moniteurs.map(x => x._id)).toEqual(['u1', 'u3']);
    expect(component.divers.map(x => x._id)).toEqual(['a', 'b']);
    expect(component.initialDivers.length).toBe(2);
  });

  it('filterDiversBylvl(): règles de profondeur', () => {
    expect(component.filterDiversBylvl(makeDiver('x', 0), 5)).toBeTrue();
    expect(component.filterDiversBylvl(makeDiver('x', 0), 15)).toBeFalse();
    expect(component.filterDiversBylvl(makeDiver('x', 1), 20)).toBeTrue();
    expect(component.filterDiversBylvl(makeDiver('x', 1), 25)).toBeFalse();
    expect(component.filterDiversBylvl(makeDiver('x', 2), 40)).toBeTrue();
    expect(component.filterDiversBylvl(makeDiver('x', 2), 45)).toBeFalse();
    expect(component.filterDiversBylvl(makeDiver('x', undefined as any), 5)).toBeTrue();
    expect(component.filterDiversBylvl(makeDiver('x', undefined as any), 15)).toBeFalse();
  });

  it('getCurrentTeamSize(): compte driver + moniteurs + divers', () => {
    component.selectedDriver = makeUser('drv');
    component.teams = [
      { moniteur: makeUser('m1'), members: [makeDiver('a'), makeDiver('b')] },
      { moniteur: undefined, members: [makeDiver('c')] },
    ];
    expect(component.getCurrentTeamSize()).toBe(1 + 1 + 2 + 0 + 1);
  });
});
