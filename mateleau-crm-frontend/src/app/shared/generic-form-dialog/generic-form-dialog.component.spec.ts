import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GenericFormDialogComponent } from './generic-form-dialog.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { FormFieldConfig } from '../types/form-field-config';
import { userFields } from '../form/form-config';

describe('GenericFormDialogComponent', () => {
  let component: GenericFormDialogComponent;
  let fixture: ComponentFixture<GenericFormDialogComponent>;
  let dialogRefSpy: jasmine.SpyObj<MatDialogRef<GenericFormDialogComponent>>;
  let dialogData: { title: string; fields: FormFieldConfig[]; values?: any };
  const mockFields: FormFieldConfig[] = [
    { key: 'name', label: 'Nom', type: 'text', required: true },
    { key: 'email', label: 'Email', type: 'email', required: true },
    {
      key: 'role',
      label: 'Rôle',
      type: 'select',
      required: true,
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'User', value: 'user' },
      ],
    },
  ];

  beforeEach(async () => {
    dialogData = {
      title: 'Créer un utilisateur',
      fields: userFields(false), // password is required
      values: {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'test123',
        role: 'admin',
        divingLvl: 2,
      },
    };

    dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);

    await TestBed.configureTestingModule({
      imports: [
        GenericFormDialogComponent,
        ReactiveFormsModule,
        NoopAnimationsModule,
      ],
      providers: [
        { provide: MatDialogRef, useValue: dialogRefSpy },
        { provide: MAT_DIALOG_DATA, useValue: dialogData },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(GenericFormDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component.ngOnInit(); // ⚠️ obligatoire car c'est pas appelé automatiquement ici
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with controls', () => {
    expect(component.form.contains('name')).toBeTrue();
    expect(component.form.contains('email')).toBeTrue();
    expect(component.form.contains('role')).toBeTrue();
  });

  it('should disable submit button if form is invalid', () => {
  component.form.reset(); // Réinitialise complètement le formulaire
  fixture.detectChanges(); // Met à jour la vue

  const button = fixture.debugElement.query(
    By.css('button[color="primary"]')
  ).nativeElement;

  expect(button.disabled).toBeTrue();
});


  it('should enable submit button when form is valid', () => {
    component.form.setValue({
      name: 'Test',
      email: 'test@example.com',
      password: 'test123', // 🔥 Ajouté ici
      role: 'admin',
      divingLvl: 2,
    });
    fixture.detectChanges();
    const button = fixture.debugElement.query(
      By.css('button[color="primary"]')
    ).nativeElement;
    expect(button.disabled).toBeFalse();
  });

  it('should call dialogRef.close with form data on submit', () => {
    component.form.setValue({
      name: 'Test',
      email: 'test@example.com',
      password: 'test123', // 🔥 Ajouté ici
      role: 'admin',
      divingLvl: 2,
    });
    component.submit();
    expect(dialogRefSpy.close).toHaveBeenCalledWith({
      name: 'Test',
      email: 'test@example.com',
      password: 'test123',
      role: 'admin',
      divingLvl: 2,
    });
  });

  it('should close dialog on cancel', () => {
    component.cancel();
    expect(dialogRefSpy.close).toHaveBeenCalled();
  });

  it('should hide password field in edit mode', () => {
    component.data.values = {
      name: 'User',
      email: 'user@example.com',
      role: 'user',
    };
    component.data.fields.push({
      key: 'password',
      label: 'Mot de passe',
      type: 'password',

      required: true,
    });
    component.ngOnInit();
    expect(
      component.processedFields.find((f) => f.key === 'password')?.hidden
    ).toBeTrue();
  });
});
