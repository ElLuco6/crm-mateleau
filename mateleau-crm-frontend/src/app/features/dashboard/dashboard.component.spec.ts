import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardComponent } from './dashboard.component';
import { MatTabsModule } from '@angular/material/tabs';
import { SpotComponent } from '../spot/spot.component';
import { Component } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

@Component({
  selector: 'app-spot',
  standalone: true,
  template: ''
})
class MockSpotComponent {
  initMapSafely = jasmine.createSpy('initMapSafely');
}

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardComponent, MatTabsModule, MockSpotComponent,HttpClientTestingModule,NoopAnimationsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should NOT call initMapSafely if tab index !== 2', () => {
    component.mapComponent = new MockSpotComponent() as any;

    component.onTabChange({ index: 1 } as any);
    expect(component.mapComponent.initMapSafely).not.toHaveBeenCalled();
  });

  it('should call initMapSafely if tab index is 2', () => {
    component.mapComponent = new MockSpotComponent() as any;

    component.onTabChange({ index: 2 } as any);
    expect(component.mapComponent.initMapSafely).toHaveBeenCalled();
  });
});
