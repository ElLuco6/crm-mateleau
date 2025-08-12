import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { DashboardComponent } from './dashboard.component';

describe('DashboardComponent', () => {
  let fixture: ComponentFixture<DashboardComponent>;
  let component: DashboardComponent;

  // Mocks partagés pour les ViewChild
  const mapMock = { initMapSafely: jasmine.createSpy('initMapSafely') };
  const calendarMock = { refreshCalendar: jasmine.createSpy('refreshCalendar') };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardComponent],
    })
      .overrideComponent(DashboardComponent, {
        set: {
          template: '<div></div>', // neutralise le template
          imports: [],
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;

    // IMPORTANT: d'abord déclencher le cycle de vie...
    fixture.detectChanges();

    // ...puis injecter nos mocks (Angular ne les écrasera plus)
    (component as any).mapComponent = mapMock;
    (component as any).calendarTab = calendarMock;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('onTabChange(index=2) appelle initMapSafely du spot', () => {
    mapMock.initMapSafely.calls.reset();

    component.onTabChange({ index: 2 } as any);

    expect(mapMock.initMapSafely).toHaveBeenCalledTimes(1);
  });

  it('onTabChange(index=1) appelle refreshCalendar (via setTimeout 0)', fakeAsync(() => {
    calendarMock.refreshCalendar.calls.reset();

    component.onTabChange({ index: 1 } as any);
    tick(); // flush setTimeout(0)

    expect(calendarMock.refreshCalendar).toHaveBeenCalledTimes(1);
  }));

  it('onTabChange(index différent) ne fait rien', fakeAsync(() => {
    mapMock.initMapSafely.calls.reset();
    calendarMock.refreshCalendar.calls.reset();

    component.onTabChange({ index: 0 } as any);
    tick();

    expect(mapMock.initMapSafely).not.toHaveBeenCalled();
    expect(calendarMock.refreshCalendar).not.toHaveBeenCalled();
  }));
});
