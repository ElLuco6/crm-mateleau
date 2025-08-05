import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CalendarComponent } from './calendar.component';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { Dive } from '../../models/Dive';
import { DivingService } from '../../core/service/diving.service';
import { NotificationService } from '../../core/service/notification.service';

describe('CalendarComponent', () => {
  let component: CalendarComponent;
  let fixture: ComponentFixture<CalendarComponent>;
  let divingServiceSpy: jasmine.SpyObj<DivingService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let notificationServiceSpy: jasmine.SpyObj<NotificationService>;

  const mockDives: Dive[] = [
    {
      _id: '1',
      name: 'Dive 1',
      location: 'Nice',
      date: new Date('2025-08-10'),
      duration: 60,
      maxDepth: 30,
      divingGroups: [],
      boat: {} as any,
      driver: {} as any
    }
  ];

  beforeEach(async () => {
    divingServiceSpy = jasmine.createSpyObj('DivingService', ['getAllDiving', 'delete']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    notificationServiceSpy = jasmine.createSpyObj('NotificationService', ['show']);

    await TestBed.configureTestingModule({
      imports: [CalendarComponent],
      providers: [
        { provide: DivingService, useValue: divingServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: NotificationService, useValue: notificationServiceSpy }
      ]
    }).compileComponents();

    divingServiceSpy.getAllDiving.and.returnValue(of(mockDives));

    fixture = TestBed.createComponent(CalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // 🟢 Appelle ngOnInit
  });

  afterEach(() => {
    fixture.destroy(); // Nettoie bien le composant
  });

  it('should call loadDives on init', () => {
    expect(divingServiceSpy.getAllDiving).toHaveBeenCalled();
    expect(component.events.length).toBe(1);
  });
  it('should handle date click and show modal', () => {
  component.handleDateClick({ dateStr: '2025-08-15' } as any);
  expect(component.selectedDate).toBe('2025-08-15');
  expect(component.showDateModal).toBeTrue();
});
it('should handle event click and show modal', () => {
  const mockArg = {
    event: {
      id: '1',
      title: 'Dive 1',
      start: new Date('2025-08-15'),
      extendedProps: { description: 'desc' }
    }
  };
  component.handleEventClick(mockArg);
  expect(component.selectedEvent.title).toBe('Dive 1');
  expect(component.showEventModal).toBeTrue();
});
it('should navigate to /create-dive with date', () => {
  component.selectedDate = '2025-08-20';
  component.confirmCreateDive();
  expect(routerSpy.navigate).toHaveBeenCalledWith(['/create-dive'], {
    queryParams: { date: '2025-08-20' }
  });
});
it('should navigate to /edit-dive/:id', () => {
  component.selectedEvent = { id: '123' };
  component.goToEventDetail();
  expect(routerSpy.navigate).toHaveBeenCalledWith(['/edit-dive', '123']);
});
it('should delete dive and update events list', () => {
  spyOn(window, 'confirm').and.returnValue(true);
  divingServiceSpy.delete.and.returnValue(of(void 0));

  component.events = [{ id: '123' } as any];
  component.selectedEvent = { id: '123' };

  component.deleteEvent();

  expect(divingServiceSpy.delete).toHaveBeenCalledWith('123');
  expect(component.events.length).toBe(0);
  expect(notificationServiceSpy.show).toHaveBeenCalledWith(jasmine.stringMatching('succès'), 'success');
});
it('should handle delete error', () => {
  spyOn(window, 'confirm').and.returnValue(true);
  divingServiceSpy.delete.and.returnValue(throwError(() => new Error('fail')));
  component.events = [{ id: '123' } as any];
  component.selectedEvent = { id: '123' };

  component.deleteEvent();

  expect(notificationServiceSpy.show).toHaveBeenCalledWith(jasmine.stringMatching('Échec'), 'error');
});

});
