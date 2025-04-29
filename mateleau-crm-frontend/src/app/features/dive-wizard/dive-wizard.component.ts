import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import {MatStepperModule} from '@angular/material/stepper';
import { SelectScheduleComponent } from './select-schedule/select-schedule.component';
import { AssignEquipmentComponent } from './assign-equipment/assign-equipment.component';
import { CreateDiveGroupComponent } from './create-dive-group/create-dive-group.component';
import { DiveWizardService } from './dive-wizard.service';

@Component({
  selector: 'app-dive-wizard',
  imports: [MatStepperModule,FormsModule,SelectScheduleComponent,AssignEquipmentComponent,CreateDiveGroupComponent,ReactiveFormsModule],
  templateUrl: './dive-wizard.component.html',
  styleUrl: './dive-wizard.component.scss'
})
export class DiveWizardComponent implements OnInit {

  step1FormGroup!: FormGroup;
  step2FormGroup!: FormGroup;
  step3FormGroup!: FormGroup;

  constructor(private _formBuilder: FormBuilder, private wizardService: DiveWizardService) { }


  ngOnInit(): void {
    this.step1FormGroup = this._formBuilder.group({
      startDate: [''],
      startTime: [''],
      boat: ['']
    });
    this.step2FormGroup = this._formBuilder.group({
      // Champs pour la création de la palanquée
      groups: [[]]
    });
    this.step3FormGroup = this._formBuilder.group({
      // Champs pour l'attribution du matériel
      equipment: [[]]
    });
  }

  submitWizard() {
    // Récupère toutes les données du wizard
    const wizardData = {
      ...this.step1FormGroup.value,
      ...this.step2FormGroup.value,
      ...this.step3FormGroup.value
    };

    // Utilise le service pour partager les données et/ou envoyer au backend
    this.wizardService.submitWizard(wizardData).subscribe(response => {
      // Traitement après soumission
    }, error => {
      // Gestion d'erreur
    });
  }

}
