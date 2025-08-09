import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardComponent } from './dashboard.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SpotComponent } from '../spot/spot.component'; // <<< chemin EXACT comme dans DashboardComponent
import { MatTabsModule } from '@angular/material/tabs';
import { CalendarComponent } from '../calendar/calendar.component';

describe('DashboardComponent', () => {
  let fixture: ComponentFixture<DashboardComponent>;
  let component: DashboardComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        // On importe le standalone tel quel (avec tous ses vrais enfants)
        DashboardComponent,
        // Modules utilitaires pour éviter les emmerdes
        HttpClientTestingModule,
        NoopAnimationsModule,
        MatTabsModule, // optionnel si déjà importé par Dashboard, ça ne gêne pas
      ],
    }).compileComponents();

    // ⚠️ Stub AVANT la création du composant
    spyOn(SpotComponent.prototype, 'initMapSafely').and.stub();
    spyOn(CalendarComponent.prototype, 'refreshCalendar').and.stub();

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  /* it('should NOT call initMapSafely if tab index !== 2', () => {
    const spy = (SpotComponent.prototype.initMapSafely as jasmine.Spy);
    spy.calls.reset();

    component.onTabChange({ index: 1 } as any);
    expect(spy).not.toHaveBeenCalled();
  });

  it('should call initMapSafely if tab index is 2', () => {
    const spy = (SpotComponent.prototype.initMapSafely as jasmine.Spy);
    spy.calls.reset();

    component.onTabChange({ index: 2 } as any);
    expect(spy).toHaveBeenCalled();
  }); */
});
