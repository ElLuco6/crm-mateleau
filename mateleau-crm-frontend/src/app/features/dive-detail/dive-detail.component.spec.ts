// dive-detail.component.spec.ts
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { DiveDetailComponent } from './dive-detail.component';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';
import { of, throwError } from 'rxjs';

import { DivingService } from '../../core/service/diving.service';
import { NotificationService } from '../../core/service/notification.service';

describe('DiveDetailComponent', () => {
  let fixture: ComponentFixture<DiveDetailComponent>;
  let component: DiveDetailComponent;
  let divingService: jasmine.SpyObj<DivingService>;
  let notificationService: jasmine.SpyObj<NotificationService>;

  const routeId = 'dive-123';
  const mockDive: any = {
    _id: routeId,
    name: 'Tombant St Cyprien',
    location: 'St-Cyprien',
    date: '2025-08-10T10:00:00.000Z',
    endDate: '2025-08-10T10:10:00.000Z',
    duration: 10, maxDepth: 20,
    boat: { name: 'Sea Explorer', numberAviablePlaces: 5, numberMaxPlaces: 10, revisionDate: '2025-07-01T00:00:00.000Z' },
    driver: { name: 'Alice', role: 'Moniteur', email: 'alice@club.fr' },
    divingGroups: [
      {
        _id: 'g1',
        guide: { name: 'Bob', role: 'Guide' },
        divers: [
          { _id: 'd1', firstName: 'John', lastName: 'Doe', divingLvl: 2 },
          { _id: 'd2', firstName: 'Jane', lastName: 'Roe', divingLvl: 1 },
        ],
        rentedEquipment: [
          { diver: { _id: 'd1', firstName: 'John', lastName: 'Doe' }, items: [{ _id: 'e1', name: 'Combinaison', size: 'M', nature: 'Néoprène', ref: 'C123', state: 'OK' }] },
        ],
      },
    ],
    totals: { groups: 1, divers: 2 },
  };

  beforeEach(async () => {
    const divingServiceSpy = jasmine.createSpyObj<DivingService>('DivingService', ['getDiveDetailById']);
    const notificationServiceSpy = jasmine.createSpyObj<NotificationService>('NotificationService', ['sendRemindEmailToDivers', 'show']);

    await TestBed.configureTestingModule({
      imports: [
        DiveDetailComponent, RouterTestingModule, MatIconModule, NoopAnimationsModule,
      ],
      providers: [
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: convertToParamMap({ id: routeId }) } } },
        { provide: DivingService, useValue: divingServiceSpy },
        { provide: NotificationService, useValue: notificationServiceSpy },
      ],
    }).compileComponents();

    divingService = TestBed.inject(DivingService) as jasmine.SpyObj<DivingService>;
    notificationService = TestBed.inject(NotificationService) as jasmine.SpyObj<NotificationService>;

    divingService.getDiveDetailById.and.returnValue(of(mockDive));
    notificationService.sendRemindEmailToDivers.and.returnValue(of( 0));

    fixture = TestBed.createComponent(DiveDetailComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('loads dive on init and renders title', () => {
    fixture.detectChanges();
    expect(divingService.getDiveDetailById).toHaveBeenCalledWith(routeId);
    expect(component.dive).toEqual(mockDive);
    const h1 = fixture.debugElement.query(By.css('h1')).nativeElement as HTMLElement;
    expect(h1.textContent).toContain('Tombant St Cyprien');
  });

  it('totalGroups prefers totals.groups then length', () => {
    component.dive = { divingGroups: [{}, {}], totals: { groups: 7 } } as any;
    expect(component.totalGroups).toBe(7);
    component.dive = { divingGroups: [{}, {}, {}] } as any;
    expect(component.totalGroups).toBe(3);
    component.dive = {} as any;
    expect(component.totalGroups).toBe(0);
  });

  it('totalDivers prefers totals.divers then computed sum', () => {
    component.dive = { totals: { divers: 5 }, divingGroups: [{ divers: [{}, {}] }, { divers: [{}] }] } as any;
    expect(component.totalDivers).toBe(5);
    component.dive = { divingGroups: [{ divers: [{}, {}] }, { divers: [{}] }] } as any;
    expect(component.totalDivers).toBe(3);
    component.dive = {} as any;
    expect(component.totalDivers).toBe(0);
  });

  it('renders boat/driver and groups', () => {
    fixture.detectChanges();
    const page = (fixture.debugElement.nativeElement as HTMLElement).textContent || '';
    expect(page).toContain('Bateau');
    expect(page).toContain('Sea Explorer');
    expect(page).toContain('Conducteur');
    expect(page).toContain('Alice');
    expect(page).toContain('Groupes');
    expect(page).toContain('Bob');
    expect(page).toContain('John Doe');
    expect(page).toContain('Jane Roe');
  });

  it('sends reminder and shows success', fakeAsync(() => {
    fixture.detectChanges();
    const btn = fixture.debugElement.query(By.css('button[aria-label="Envoyer un rappel"]'));
    btn.nativeElement.click();
    tick();
    expect(notificationService.sendRemindEmailToDivers).toHaveBeenCalledWith(routeId);
    expect(notificationService.show).toHaveBeenCalledWith('Rappel envoyé aux plongeurs.', 'success');
  }));

  it('shows error if reminder API fails', fakeAsync(() => {
    notificationService.sendRemindEmailToDivers.and.returnValue(throwError(() => new Error('fail')));
    fixture.detectChanges();
    const btn = fixture.debugElement.query(By.css('button[aria-label="Envoyer un rappel"]'));
    btn.nativeElement.click();
    tick();
    expect(notificationService.sendRemindEmailToDivers).toHaveBeenCalledWith(routeId);
    expect(notificationService.show).toHaveBeenCalledWith(`Erreur lors de l'envoi du rappel.`, 'error');
  }));
});
