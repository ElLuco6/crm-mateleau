import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import {MatStepperModule} from '@angular/material/stepper';
import { SelectScheduleComponent } from './select-schedule/select-schedule.component';
import { AssignEquipmentComponent } from './assign-equipment/assign-equipment.component';
import { CreateDiveGroupComponent } from './create-dive-group/create-dive-group.component';
import { DiveWizardService } from './dive-wizard.service';
import { ActivatedRoute } from '@angular/router';
import { debounceTime, filter, finalize } from 'rxjs';
import { AvailibilityService } from '../../core/service/availibility.service';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatTimepickerModule } from '@angular/material/timepicker';
import { NgxMatTimepickerModule } from 'ngx-mat-timepicker';
import { provideNativeDateAdapter } from '@angular/material/core';

   
@Component({
  selector: 'app-dive-wizard',
  imports: [MatStepperModule,
    FormsModule,
    SelectScheduleComponent,
    AssignEquipmentComponent,
    CreateDiveGroupComponent,
    ReactiveFormsModule,
    CommonModule,MatFormFieldModule,
    MatSelectModule,
    MatDatepickerModule,
    MatTimepickerModule,
    NgxMatTimepickerModule,
    SelectScheduleComponent,
    AssignEquipmentComponent,
    CreateDiveGroupComponent

  ],
  providers: [provideNativeDateAdapter()],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './dive-wizard.component.html',
  styleUrl: './dive-wizard.component.scss'
})
export class DiveWizardComponent implements OnInit {

  scheduleForm!: FormGroup;
  step2FormGroup!: FormGroup;
  step3FormGroup!: FormGroup;

  availableBoats: any[] = [];
  loadingBoats = false;
  errorMessage: string = '';
 
  startDate: Date = new Date();
  constructor(private _formBuilder: FormBuilder, private wizardService: DiveWizardService,
               private route: ActivatedRoute,
               private availibilityService:AvailibilityService, 
                              
  ) { }


  ngOnInit(): void {
    this.startDate = this.route.snapshot.queryParams['date'] ? new Date(this.route.snapshot.queryParams['date']) : new Date();
     this.scheduleForm = this._formBuilder.group({
                        startDate: [this.startDate, Validators.required],
                        startTime: ['', Validators.required],
                        duration: [null, [Validators.required, Validators.min(1)]],
                        boat: [] // tu l'utiliseras peut-être plus tard
                      });

                          
                          this.scheduleForm.valueChanges.pipe(
                            debounceTime(300),
                            filter(() => this.scheduleForm.valid) // uniquement quand le formulaire est valide
                          )
                          .subscribe(() => {
                            this.fetchAvailableBoats();
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
      ...this.scheduleForm.value,
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

    // Appel à l'API pour récupérer les bateaux disponibles
  fetchAvailableBoats(): void {
    if (this.scheduleForm.invalid) return; 
    
    const { startDate, startTime, duration } = this.scheduleForm.value;

    const rawDate = startDate instanceof Date ? startDate : new Date(startDate);

    if (isNaN(rawDate.getTime())) {
      console.error('Date invalide');
      return;
    }
  
    
    // 1. Fusion date + heure
    const fixedStartTime = startTime.replace('h', ':');
    
    
    if (!/^\d{1,2}:\d{2}$/.test(fixedStartTime)) {
      console.error('Heure invalide', fixedStartTime);
      return;
    }

    const [hours, minutes] = fixedStartTime.split(':').map(Number);
    if (isNaN(hours) || isNaN(minutes)) {
      console.error('Heure ou minute non numérique', hours, minutes);
      return;
    }
    const combinedDate = new Date(rawDate);

    combinedDate.setHours(hours);
   
    combinedDate.setMinutes(minutes);
   
    combinedDate.setSeconds(0);
    
    combinedDate.setMilliseconds(0);
   

    
    // 2. Conversion en UTC ISO string
    const isoDateUTC = combinedDate.toISOString();

    // 3. Format final pour backend
    const payload = {
      date: isoDateUTC, // format 2025-03-10T10:00:00Z
      duration: duration
    };

    this.wizardService.setPayload(payload);
    this.loadingBoats = true;
    this.errorMessage = '';

    this.availibilityService.getAvailableBoat(this.wizardService.getPayload().date, this.wizardService.getPayload().duration)
  .pipe(finalize(() => this.loadingBoats = false))
  .subscribe({
    next: (boats) => this.availableBoats = boats,
    error: (err) => {
      this.errorMessage = 'Erreur lors de la récupération des bateaux: ' + err.message;
    }
  });
  }
  
}
