import { TestBed } from '@angular/core/testing';
import { NotificationService } from './notification.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackbarComponent } from '../../shared/snackbar/snackbar.component';

describe('NotificationService', () => {
  let service: NotificationService;
  let snackBarSpy: jasmine.SpyObj<MatSnackBar>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('MatSnackBar', ['openFromComponent']);

    TestBed.configureTestingModule({
      providers: [
        NotificationService,
        { provide: MatSnackBar, useValue: spy }
      ]
    });

    service = TestBed.inject(NotificationService);
    snackBarSpy = TestBed.inject(MatSnackBar) as jasmine.SpyObj<MatSnackBar>;
  });

  it('should display a success message', () => {
    const message = 'Saved successfully!';
    service.show(message, 'success');

    expect(snackBarSpy.openFromComponent).toHaveBeenCalledWith(SnackbarComponent, {
      data: { message, type: 'success' },
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      panelClass: ['rounded-md', 'shadow-lg']
    });
  });

  it('should default to info type if not specified', () => {
    const message = 'Info message';
    service.show(message);

    expect(snackBarSpy.openFromComponent).toHaveBeenCalledWith(SnackbarComponent, {
      data: { message, type: 'info' },
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      panelClass: ['rounded-md', 'shadow-lg']
    });
  });
});
