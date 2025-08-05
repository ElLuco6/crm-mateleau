import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegisterComponent } from './register.component';
import { AuthService } from '../../../core/service/auth.service';
import { Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';
import { User } from '../../../models/User';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        RouterTestingModule.withRoutes([]),
        RegisterComponent,
      ],
      providers: [
        {
          provide: AuthService,
          useValue: jasmine.createSpyObj('AuthService', ['register']),
        },
      ],
    });

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;

    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router);
    spyOn(router, 'navigate');

    fixture.detectChanges(); // ⚠️ initialise ngOnInit()
  });

  it('should create the form with default values', () => {
    const form = component.registerForm;
    expect(form).toBeDefined();
    expect(form.get('name')?.value).toBe('');
    expect(form.get('email')?.value).toBe('');
    expect(form.get('password')?.value).toBe('');
    expect(form.get('role')?.value).toBe('staff');
    expect(form.get('divingLvl')?.value).toBe(0);
  });

  it('should call authService.register and navigate on success', () => {
    const formValues: Omit<User, '_id'> = {
  name: 'Alice',
  email: 'alice@example.com',
  password: 'secure',
  role: 'admin',
  divingLvl: 2
};

    component.registerForm.setValue(formValues);

    authServiceSpy.register.and.returnValue(
      of({
        _id: '123',
        ...formValues
        
      })
    );

    component.onSubmit();

  expect(authServiceSpy.register).toHaveBeenCalledOnceWith(jasmine.objectContaining(formValues));
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should handle registration error', () => {
    spyOn(console, 'error');

    const formValues = {
      name: 'Bob',
      email: 'bob@example.com',
      password: 'weak',
      role: 'manager',
      divingLvl: 1,
    };

    component.registerForm.setValue(formValues);

    authServiceSpy.register.and.returnValue(
      throwError(() => new Error('fail'))
    );

    component.onSubmit();

    expect(authServiceSpy.register).toHaveBeenCalled();
    expect(console.error).toHaveBeenCalledWith(
      'Registration failed',
      jasmine.any(Error)
    );
    expect(router.navigate).not.toHaveBeenCalled();
  });
});
