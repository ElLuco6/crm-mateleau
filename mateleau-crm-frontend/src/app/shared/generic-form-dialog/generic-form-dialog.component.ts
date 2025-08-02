import { Component, Inject } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormFieldConfig } from '../types/form-field-config';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-generic-form-dialog',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
  ],
  templateUrl: './generic-form-dialog.component.html',
  styleUrl: './generic-form-dialog.component.scss',
})
export class GenericFormDialogComponent {
  form: FormGroup;
  processedFields: FormFieldConfig[] = [];
  isEditMode: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<GenericFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      title: string;
      fields: FormFieldConfig[];
      values?: any;
    },
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({});
  }

  ngOnInit(): void {
    this.isEditMode = !!this.data.values;

    // Dynamique : on adapte les champs avant affichage
    this.processedFields = this.data.fields.map((field) => {
      const shouldHide = field.key === 'password' && this.isEditMode;
      return {
        ...field,
        hidden: shouldHide || field.hidden,
      };
    });

    // Génère dynamiquement les FormControls
    this.processedFields.forEach((field) => {
      this.form.addControl(
        field.key,
        new FormControl(
          this.data.values?.[field.key] || '',
          field.required ? Validators.required : []
        )
      );
    });
  }

  submit(): void {
    if (this.form.valid) {
      const result = { ...this.form.value };
      if (this.data.values?._id) {
        result._id = this.data.values._id;
      }
      this.dialogRef.close(result);
    }
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
