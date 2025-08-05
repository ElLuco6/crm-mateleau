import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { TodayComponent } from './today.component';
import { DashboardService } from '../../../core/service/dashboard.service';
import { of, throwError } from 'rxjs';
import { KanbanComponent } from '../../kanban/kanban.component';
import { CommonModule } from '@angular/common';

describe('TodayComponent', () => {
  let component: TodayComponent;
  let fixture: ComponentFixture<TodayComponent>;
  let dashboardServiceSpy: jasmine.SpyObj<DashboardService>;

  const mockToday = {
    dives: [{ _id: '1', name: 'Plongée 1', location: 'Nice', date: new Date() }],
    equipmentToReview: [{ _id: 'eq1', name: 'Détendeur' }],
    boatsToReview: [{ _id: 'b1', name: 'Bateau 1' }]
  };

  const mockWeek = {
    dives: [{ _id: '2', name: 'Plongée 2', location: 'Cannes', date: new Date() }],
    equipmentToReview: [{ _id: 'eq2', name: 'Bloc 15L' }],
    boatsToReview: [{ _id: 'b2', name: 'Zodiac' }]
  };

  beforeEach(waitForAsync(() => {
    dashboardServiceSpy = jasmine.createSpyObj('DashboardService', [
      'getDashboardToday',
      'getDashboardWeek',
      'getTasks'
    ]);

    TestBed.configureTestingModule({
      imports: [TodayComponent, CommonModule, KanbanComponent],
      providers: [{ provide: DashboardService, useValue: dashboardServiceSpy }]
    }).compileComponents();
  }));

  beforeEach(async () => {
    dashboardServiceSpy.getDashboardToday.and.returnValue(of(mockToday));
dashboardServiceSpy.getDashboardWeek.and.returnValue(of(mockWeek));
dashboardServiceSpy.getTasks.and.returnValue(of([])); // <== ADD THIS TOO

    fixture = TestBed.createComponent(TodayComponent);
    component = fixture.componentInstance;
    await component.fetchDashboardData();
    fixture.detectChanges();
  });

  it('should load dashboard data successfully', fakeAsync(() => {
  const todayMock = {
    dives: [{ _id: '1', name: 'Plongée A', location: 'Nice', date: new Date() }],
    equipmentToReview: [{ _id: 'eq1', name: 'Palme' }],
    boatsToReview: [{ _id: 'b1', name: 'Bateau A' }]
  };

  const weekMock = {
    dives: [{ _id: '2', name: 'Plongée B', location: 'Marseille', date: new Date() }],
    equipmentToReview: [{ _id: 'eq2', name: 'Gilet' }],
    boatsToReview: [{ _id: 'b2', name: 'Bateau B' }]
  };

  dashboardServiceSpy.getDashboardToday.and.returnValue(of(todayMock));
  dashboardServiceSpy.getDashboardWeek.and.returnValue(of(weekMock));

  component.fetchDashboardData();
  tick(); // attend la résolution de la Promise

  expect(component.todayDives.length).toBe(1);
  expect(component.weekDives.length).toBe(1);
  expect(component.todayEquipment.length).toBe(1);
  expect(component.todayBoats.length).toBe(1);
  expect(component.weekEquipment.length).toBe(1);
  expect(component.weekBoats.length).toBe(1);
  expect(component.isLoading).toBeFalse();
  expect(component.hasError).toBeFalse();
}));

  it('should handle dashboard fetch error', async () => {
    dashboardServiceSpy.getDashboardToday.and.returnValue(throwError(() => new Error('fail')));
    dashboardServiceSpy.getDashboardWeek.and.returnValue(of(mockWeek));

    await component.fetchDashboardData();
    expect(component.hasError).toBeTrue();
    expect(component.isLoading).toBeFalse();
  });
});
