import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { SpotComponent } from './spot.component';
import { SpotService } from '../../core/service/spot.service';
import { NotificationService } from '../../core/service/notification.service';
import { of } from 'rxjs';
import * as L from 'leaflet';

class MockMap {
  // on stocke les handlers pour pouvoir simuler un clic si besoin
  private handlers: Record<string, Function[]> = {};
  on = jasmine.createSpy('on').and.callFake((type: string, cb: Function) => {
    this.handlers[type] ??= [];
    this.handlers[type].push(cb);
    return this;
  });
  trigger(type: string, event: any) {
    (this.handlers[type] || []).forEach(cb => cb(event));
  }

  addLayer = jasmine.createSpy('addLayer').and.returnValue(this);
  removeLayer = jasmine.createSpy('removeLayer').and.returnValue(this);
  eachLayer = jasmine.createSpy('eachLayer').and.callFake((cb: any) => {
    // simule un layer avec remove()
    cb({ remove: jasmine.createSpy('remove') });
  });
}

class MockMarker {
  addTo = jasmine.createSpy('addTo').and.returnValue(this);
  bindPopup = jasmine.createSpy('bindPopup').and.returnValue(this);
}

describe('SpotComponent', () => {
  let fixture: ComponentFixture<SpotComponent>;
  let component: SpotComponent;

  let spotService: jasmine.SpyObj<SpotService>;
  let notif: jasmine.SpyObj<NotificationService>;
  

  // spies Leaflet
  let mapSpy: jasmine.Spy<jasmine.Func>;
  let markerSpy: jasmine.Spy<jasmine.Func>;
  let tileSpy: jasmine.Spy<jasmine.Func>;
  let iconSpy: jasmine.Spy<jasmine.Func>;

  beforeEach(async () => {
    spotService = jasmine.createSpyObj('SpotService', [
      'getAll', 'create', 'update', 'delete',
    ]);
    notif = jasmine.createSpyObj('NotificationService', ['show']);

    // ⚠️ important: on mock Leaflet AVANT création du composant
    mapSpy = spyOn(L, 'map').and.returnValue(new MockMap() as any);
    markerSpy = spyOn(L, 'marker').and.returnValue(new MockMarker() as any);
    tileSpy = spyOn(L, 'tileLayer').and.returnValue({ addTo: () => {} } as any);
    iconSpy = spyOn(L, 'icon').and.returnValue({} as any);

    await TestBed.configureTestingModule({
      imports: [SpotComponent], // standalone
      providers: [
        { provide: SpotService, useValue: spotService },
        { provide: NotificationService, useValue: notif },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SpotComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    // reset des spies globaux pour éviter les fuites entre tests
    mapSpy.calls.reset();
    markerSpy.calls.reset();
    tileSpy.calls.reset();
    iconSpy.calls.reset();
    spotService.getAll.calls.reset();
    spotService.create.calls.reset();
    spotService.update.calls.reset();
    spotService.delete.calls.reset();
    notif.show.calls.reset();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('initMapSafely: initialise la carte et charge les spots', () => {
    spotService.getAll.and.returnValue(of([]));
    component.initMapSafely();
    expect(L.map).toHaveBeenCalled();       // init map
    expect(spotService.getAll).toHaveBeenCalled(); // loadSpots
  });

  it('loadSpots: remplit Spots et crée des markers', () => {
    const mockSpots = [
      { _id: '1', name: 'Spot 1', coordinates: { lat: 45, lng: 5 } },
      { _id: '2', name: 'Spot 2', coordinates: { lat: 44, lng: 4 } },
    ];
    spotService.getAll.and.returnValue(of(mockSpots));

    // simule une map déjà prête (on bypasse initMap)
    component.map = new MockMap() as any;

    component.loadSpots();

    expect(spotService.getAll).toHaveBeenCalled();
    expect(component.Spots.length).toBe(2);
    // un marker par spot
    expect(L.marker).toHaveBeenCalledTimes(2);
  });

  it('createSpot: crée un spot valide, notifie et pose un marker', () => {
  component.map = new MockMap() as any; // addTo() a besoin d’une map

  // ⚠️ on capture l’objet envoyé AVANT l’appel
  const sent = { name: 'Test Spot', coordinates: { lat: 10, lng: 10 } };
  component.newSpot = { ...sent };

  spotService.create.and.returnValue(
    of({ _id: '42', ...sent })
  );

  component.createSpot();

  // on vérifie l’argument exact envoyé, pas component.newSpot (qui a été reset)
  expect(spotService.create).toHaveBeenCalledWith(sent);
  expect(notif.show).toHaveBeenCalledWith('Spot ajouté avec succès', 'success');
  expect(L.marker).toHaveBeenCalledWith([10, 10]);
});


  it('startEditing: positionne editIndex et editingSpot (copie)', () => {
    component.Spots = [
      { _id: 's1', name: 'S1', coordinates: { lat: 1, lng: 2 } },
      { _id: 's2', name: 'S2', coordinates: { lat: 3, lng: 4 } },
    ];
    component.startEditing(1);
    expect(component.editIndex).toBe(1);
    expect(component.editingSpot).toEqual(component.Spots[1]);
    // s’assure que c’est une copie (pas la même référence)
    expect(component.editingSpot).not.toBe(component.Spots[1]);
  });

  it('updateSpot: met à jour le spot, reset l’édition, notifie et recharge', () => {
  component.Spots = [
    { _id: 's1', name: 'S1', coordinates: { lat: 1, lng: 2 } },
    { _id: 's2', name: 'S2', coordinates: { lat: 3, lng: 4 } },
  ];
  component.editIndex = 1;

  // ⚠️ on garde une référence à l’objet envoyé AVANT l’appel
  const toSend = { _id: 's2', name: 'S2 (edit)', coordinates: { lat: 30, lng: 40 } };
  component.editingSpot = { ...toSend };

  spotService.update.and.returnValue(
    of({ _id: 's2', name: 'S2 (ok)', coordinates: { lat: 30, lng: 40 } })
  );

  spyOn(component, 'loadSpots');

  component.updateSpot();

  // on vérifie l’objet envoyé, pas component.editingSpot (qui est devenu null)
  expect(spotService.update).toHaveBeenCalledWith('s2', toSend);
  expect(component.Spots[1].name).toBe('S2 (ok)');
  expect(component.editIndex).toBeNull();
  expect(component.editingSpot).toBeNull();
  expect(notif.show).toHaveBeenCalledWith('Spot modifié avec succès', 'success');
  expect(component.loadSpots).toHaveBeenCalled();
});

  it('deleteSpot: supprime, nettoie la map et recharge', () => {
    component.Spots = [
      { _id: 's1', name: 'S1', coordinates: { lat: 1, lng: 2 } },
      { _id: 's2', name: 'S2', coordinates: { lat: 3, lng: 4 } },
    ];
    component.map = new MockMap() as any;

    spotService.delete.and.returnValue(of(void 0));
    spyOn(component, 'loadSpots');

    component.deleteSpot('s1', 0);

    expect(spotService.delete).toHaveBeenCalledWith('s1');
    expect(component.Spots.length).toBe(1);
    expect(notif.show).toHaveBeenCalledWith('Spot supprimé avec succès', 'success');
    expect((component.map as any).eachLayer).toHaveBeenCalled();
    expect(component.loadSpots).toHaveBeenCalled();
  });

  it('cancelEdit: reset et notification', () => {
    component.editIndex = 1;
    component.editingSpot = { _id: 'x', name: 'X', coordinates: { lat: 0, lng: 0 } };
    component.cancelEdit();
    expect(component.editIndex).toBeNull();
    expect(component.editingSpot).toBeNull();
    expect(notif.show).toHaveBeenCalledWith('Modification annulée', 'info');
  });

  it('initMap: enregistre un handler de clic (smoke test)', () => {
    component.initMap();
    expect(L.map).toHaveBeenCalled();
    expect((component.map as any).on).toHaveBeenCalledWith('click', jasmine.any(Function));
  });

  it('handler de clic: met à jour newSpot et place tempMarker', () => {
    component.initMap();
    const mockMap = component.map as unknown as MockMap;

    // simulate click
    mockMap.trigger('click', { latlng: { lat: 12.34, lng: 56.78 } });

    expect(component.newSpot.coordinates).toEqual({ lat: 12.34, lng: 56.78 });
    expect(L.marker).toHaveBeenCalled(); // tempMarker placé
  });
});
