import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { SelectScheduleComponent } from './select-schedule.component';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { BoatService } from '../../../core/service/boat.service';
import { of } from 'rxjs';
import { By } from '@angular/platform-browser';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('SelectScheduleComponent', () => {
  let component: SelectScheduleComponent;
  let fixture: ComponentFixture<SelectScheduleComponent>;
  let boatServiceSpy: jasmine.SpyObj<BoatService>;

  // petit helper pour un form parent minimal valide
  function buildParentForm(fb: FormBuilder): FormGroup {
    return fb.group({
      startDate: [new Date(), Validators.required],
      startTime: ['09:00', Validators.required],
      location: ['Spot A', Validators.required],
      duration: [60, Validators.required],
      maxDepth: [20, Validators.required],
      boat: [null] // sélectionné plus tard
    });
  }                          

beforeEach(async () => {
  boatServiceSpy = jasmine.createSpyObj('BoatService', ['create']);

  await TestBed.configureTestingModule({
    imports: [
      SelectScheduleComponent,       // standalone
      ReactiveFormsModule,
      NoopAnimationsModule,
      HttpClientTestingModule,       // mock HttpClient (au cas où)
    ],
    schemas: [NO_ERRORS_SCHEMA],     // ignore ngx-mat-timepicker & co si pas importés
  }).compileComponents();

  // ✅ Ecrase TOUTES les résolutions de BoatService (root + component)
  TestBed.overrideProvider(BoatService, { useValue: boatServiceSpy });

  // (Optionnel) si le composant DÉCLARE providers:[BoatService], on peut aussi le doubler :
  TestBed.overrideComponent(SelectScheduleComponent, {
    add: {
      providers: [{ provide: BoatService, useValue: boatServiceSpy }],
    },
  });

  fixture = TestBed.createComponent(SelectScheduleComponent);
  component = fixture.componentInstance;

  const fb = TestBed.inject(FormBuilder);
  component.formGroup = fb.group({
    startDate: [new Date(), Validators.required],
    startTime: ['09:00', Validators.required],
    location: ['Spot A', Validators.required],
    duration: [60, Validators.required],
    maxDepth: [20, Validators.required],
    boat: [null],
  });

  component.boats = [
    { _id: 'b1', name: 'Blue Whale', numberMaxPlaces: 10, revisionDate: new Date() },
    { _id: 'b2', name: 'Sea Fox', numberMaxPlaces: 8, revisionDate: new Date() },
  ];
  component.location = [{ _id: 's1', name: 'Spot A', coordinates: { lat: 0, lng: 0 } } as any];

  fixture.detectChanges();
});

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should keep add-boat button disabled when newBoatForm is invalid', () => {
    // par défaut, newBoatForm: name '', numberMaxPlaces null → invalide
    expect(component.newBoatForm.invalid).toBeTrue();

    // on vérifie l’état du bouton dans le DOM
    component.boatForm = true;
    fixture.detectChanges();

    const btn = fixture.debugElement.query(By.css('button[color="primary"]'))?.nativeElement as HTMLButtonElement;
    expect(btn).toBeTruthy();
    expect(btn.disabled).toBeTrue();
  });

  it('should show boat form when showBoatForm() is called', () => {
    expect(component.boatForm).toBeFalse();
    component.showBoatForm();
    expect(component.boatForm).toBeTrue();
  });

/*   it('should call BoatService.create and reset/close form when addNewBoat() with valid form', fakeAsync(() => {
  // ouvrir le sous-formulaire
  component.showBoatForm();
  fixture.detectChanges();

  // remplir le sous-formulaire pour qu'il soit valide
  component.newBoatForm.patchValue({
    name: 'New Boat',
    numberMaxPlaces: 12,
    revisionDate: new Date(),
  });
  expect(component.newBoatForm.valid).toBeTrue();

  // mock retour service
  const createdBoat = {
    _id: 'nb1',
    name: 'New Boat',
    numberMaxPlaces: 12,
    revisionDate: new Date(),
  };
  boatServiceSpy.create.and.returnValue(of(createdBoat as any));

  // call
  component.addNewBoat();
  tick();

  // assertions
  expect(boatServiceSpy.create).toHaveBeenCalledWith(jasmine.objectContaining({
    name: 'New Boat',
    numberMaxPlaces: 12,
  }));

  // form fermé
  expect(component.boatForm).toBeFalse();

  // reset fait
  expect(component.newBoatForm.pristine).toBeTrue();

  // facultatif : vérifier que le form est vide
  const v = component.newBoatForm.value;
  expect(v.name).toBe('');          // ici '' grâce au reset({ name: '' })
  expect(v.numberMaxPlaces).toBeNull();
  expect(v.revisionDate).toBeNull();
})); */
});
