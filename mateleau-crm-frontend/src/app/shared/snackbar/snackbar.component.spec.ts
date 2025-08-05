import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SnackbarComponent } from './snackbar.component';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';
import { By } from '@angular/platform-browser';

describe('SnackbarComponent', () => {
  let component: SnackbarComponent;
  let fixture: ComponentFixture<SnackbarComponent>;

  const mockData = {
    message: 'Test message',
    type: 'success' as const
  };

  beforeEach(async () => {
  await TestBed.configureTestingModule({
    imports: [SnackbarComponent],
    providers: [
      {
        provide: MAT_SNACK_BAR_DATA,
        useValue: { ...mockData } // 🔥 clone ici
      }
    ]
  }).compileComponents();

  fixture = TestBed.createComponent(SnackbarComponent);
  component = fixture.componentInstance;
  fixture.detectChanges();
});


  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the correct message', () => {
    const span = fixture.debugElement.query(By.css('span')).nativeElement;
    expect(span.textContent).toContain('Test message');
  });

  it('should apply the correct color class for success', () => {
    expect(component.colorClass).toBe('bg-green-600');
  });

  it('should return correct icon for success', () => {
    expect(component.icon).toBe('check_circle');
  });

  it('should change icon and color for type "error"', () => {
  component.data = { message: 'Test', type: 'error' };
  expect(component.icon).toBe('error');
  expect(component.colorClass).toBe('bg-red-600');
});


  it('should change icon and color for type "info"', () => {
    component.data.type = 'info';
    expect(component.icon).toBe('info');
    expect(component.colorClass).toBe('bg-blue-600');
  });

  it('should fallback to default class and icon for unknown type', () => {
    component.data.type = 'unknown' as any;
    expect(component.icon).toBe('notifications');
    expect(component.colorClass).toBe('bg-gray-800');
  });
});
