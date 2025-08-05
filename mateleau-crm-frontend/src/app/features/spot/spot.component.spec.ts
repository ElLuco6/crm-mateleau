import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SpotComponent } from './spot.component';
import { SpotService } from '../../core/service/spot.service';
import { NotificationService } from '../../core/service/notification.service';
import { of } from 'rxjs';
import * as L from 'leaflet';

class MockMap {
  addLayer = jasmine.createSpy('addLayer');
  removeLayer = jasmine.createSpy('removeLayer');
  on = jasmine.createSpy('on');
  eachLayer = jasmine.createSpy('eachLayer').and.callFake((cb: any) => {
    cb({ remove: jasmine.createSpy('remove') });
  });
}

class MockMarker {
  addTo = jasmine.createSpy('addTo').and.returnValue(this);
  bindPopup = jasmine.createSpy('bindPopup').and.returnValue(this);
}

describe('SpotComponent', () => {
  let component: SpotComponent;
  let fixture: ComponentFixture<SpotComponent>;
  let spotServiceSpy: jasmine.SpyObj<SpotService>;
  let notificationServiceSpy: jasmine.SpyObj<NotificationService>;

  beforeEach(async () => {
    const spotSpy = jasmine.createSpyObj('SpotService', [
      'getAll',
      'create',
      'update',
      'delete',
    ]);
    const notifSpy = jasmine.createSpyObj('NotificationService', ['show']);
    spyOn(L, 'map').and.returnValue(new MockMap() as any);
    spyOn(L, 'marker').and.returnValue(new MockMarker() as any);
    spyOn(L, 'tileLayer').and.returnValue({ addTo: () => {} } as any);

    await TestBed.configureTestingModule({
      imports: [SpotComponent], // Standalone
      providers: [
        { provide: SpotService, useValue: spotSpy },
        { provide: NotificationService, useValue: notifSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SpotComponent);
    component = fixture.componentInstance;
    spotServiceSpy = TestBed.inject(SpotService) as jasmine.SpyObj<SpotService>;
    notificationServiceSpy = TestBed.inject(
      NotificationService
    ) as jasmine.SpyObj<NotificationService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load spots and render markers', () => {
  const mockSpots = [
    { _id: '1', name: 'Spot 1', coordinates: { lat: 45, lng: 5 } },
  ];
  spotServiceSpy.getAll.and.returnValue(of(mockSpots));

  // simulate map already initialized (bypass initMap)
  component.map = new MockMap() as any;

  // cleanIcon doit exister pour marker()
  component.cleanIcon = {} as any;

  component.loadSpots();

  expect(spotServiceSpy.getAll).toHaveBeenCalled();
  expect(component.Spots.length).toBe(1);
});



  it('should create a new spot if name is valid', () => {
    component.newSpot = {
      name: 'Test Spot',
      coordinates: { lat: 10, lng: 10 },
    };
    spotServiceSpy.create.and.returnValue(
      of({
        _id: '42',
        name: 'Test Spot',
        coordinates: { lat: 10, lng: 10 },
      })
    );

    component.createSpot();

    expect(spotServiceSpy.create).toHaveBeenCalled();
    expect(notificationServiceSpy.show).toHaveBeenCalledWith(
      'Spot ajouté avec succès',
      'success'
    );
  });

  it('should cancel editing', () => {
    component.editIndex = 1;
    component.editingSpot = {
      _id: '1',
      name: 'Edit',
      coordinates: { lat: 0, lng: 0 },
    };

    component.cancelEdit();

    expect(component.editIndex).toBeNull();
    expect(component.editingSpot).toBeNull();
    expect(notificationServiceSpy.show).toHaveBeenCalledWith(
      'Modification annulée',
      'info'
    );
  });
});
