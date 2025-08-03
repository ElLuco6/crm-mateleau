import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { MatStepperModule } from '@angular/material/stepper';
import { SelectScheduleComponent } from './select-schedule/select-schedule.component';
import { AssignEquipmentComponent } from './assign-equipment/assign-equipment.component';
import {
  CreateDiveGroupComponent,
  Team,
} from './create-dive-group/create-dive-group.component';
import { DiveWizardService } from './dive-wizard.service';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest, debounceTime, filter, finalize, firstValueFrom, startWith } from 'rxjs';
import { AvailibilityService } from '../../core/service/availibility.service';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatTimepickerModule } from '@angular/material/timepicker';
import { NgxMatTimepickerModule } from 'ngx-mat-timepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { DivingService } from '../../core/service/diving.service';
import {MatSnackBar, MatSnackBarModule} from '@angular/material/snack-bar';

@Component({
  selector: 'app-dive-wizard',
  imports: [
    MatStepperModule,
    FormsModule,
    SelectScheduleComponent,
    AssignEquipmentComponent,
    CreateDiveGroupComponent,
    ReactiveFormsModule,
    CommonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatDatepickerModule,
    MatTimepickerModule,
    NgxMatTimepickerModule,
    SelectScheduleComponent,
    AssignEquipmentComponent,
    CreateDiveGroupComponent,
    MatSnackBarModule
  ],
  providers: [provideNativeDateAdapter()],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './dive-wizard.component.html',
  styleUrl: './dive-wizard.component.scss',
})
export class DiveWizardComponent implements OnInit, AfterViewInit {
  scheduleForm!: FormGroup;
  step2FormGroup!: FormGroup;
  step3FormGroup!: FormGroup;

  @ViewChild(AssignEquipmentComponent)
  assignEquipmentComponent!: AssignEquipmentComponent;

 @ViewChild(CreateDiveGroupComponent)
createGroupComponent!: CreateDiveGroupComponent;


    availableBoats: any[] = [];
  loadingBoats = false;
  errorMessage: string = '';
  currentStep = 0;
  startDate: Date = new Date();
  constructor(
    private _formBuilder: FormBuilder,
    private wizardService: DiveWizardService,
    private route: ActivatedRoute,
    private availibilityService: AvailibilityService,
    private divingService: DivingService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.startDate = this.route.snapshot.queryParams['date']
      ? new Date(this.route.snapshot.queryParams['date'])
      : new Date();

    this.scheduleForm = this._formBuilder.group({
      startDate: [this.startDate, Validators.required],
      startTime: ['', Validators.required],
      duration: [null, [Validators.required, Validators.min(1)]],
      boat: [], // tu l'utiliseras peut-être plus tard,
      maxDepth: [null, Validators.required], // Ajout de la profondeur maximale
      location: ['', Validators.required], // Ajout du champ pour la localisation
      diveName: ['', Validators.required], // Nom de la plongée
    },
  { updateOn: 'change' });
    combineLatest([
      this.scheduleForm
        .get('startDate')!
        .valueChanges.pipe(
          startWith(this.scheduleForm.get('startDate')!.value)
        ),
      this.scheduleForm
        .get('startTime')!
        .valueChanges.pipe(
          startWith(this.scheduleForm.get('startTime')!.value)
        ),
      this.scheduleForm
        .get('duration')!
        .valueChanges.pipe(startWith(this.scheduleForm.get('duration')!.value)),
      this.scheduleForm
        .get('maxDepth')!
        .valueChanges.pipe(startWith(this.scheduleForm.get('maxDepth')!.value)),
      this.scheduleForm
        .get('location')!
        .valueChanges.pipe(startWith(this.scheduleForm.get('location')!.value)),
      this.scheduleForm
        .get('diveName')!
        .valueChanges.pipe(startWith(this.scheduleForm.get('diveName')!.value)),
    ])
      .pipe(
        debounceTime(300),
        filter(() => {
          const date = this.scheduleForm.get('startDate')?.value;
          const time = this.scheduleForm.get('startTime')?.value;
          const duration = this.scheduleForm.get('duration')?.value;
          const maxDepth = this.scheduleForm.get('maxDepth')?.value;
          const location = this.scheduleForm.get('location')?.value;
          const diveName = this.scheduleForm.get('diveName')?.value;
          return (
            !!date &&
            !!time &&
            !!duration &&
            !!maxDepth &&
            !!location &&
            !!diveName
          );
        })
      )
      .subscribe(() => {
        console.log('🟢 Recherche bateau déclenchée');
        this.fetchAvailableBoats();
      });

    /*  this.scheduleForm.get('duration')!.valueChanges.subscribe((duration) => {
    this.fetchAvailableBoats();
  })
 */

    this.step2FormGroup = this._formBuilder.group({
      // Champs pour la création de la palanquée
      groups: [[], [Validators.required, this.validTeamsValidator]],
    });

    this.step3FormGroup = this._formBuilder.group({
      equipmentAssignments: this._formBuilder.group({

      })
    });
  }

  ngAfterViewInit(): void {}

 /*  submitWizard() {
    // Récupère toutes les données du wizard
    const payload = this.wizardService.getPayload();
    const equipmentAssignments = this.step3FormGroup.value.equipmentAssignments;

    const driver = payload.driver; // ✅ c'est un User complet
    const boat = payload.formValue1.boat;
    const date = new Date(payload.date); // ou new Date(payload.date + 'T' + payload.time) si séparés
    const duration = payload.duration;
    const maxDepth = payload.formValue1.maxDepth;
    const location = payload.formValue1.location;

    const divingGroups = payload.teams.map((team: Team) => {
      const group: any = {
        guide: team.moniteur ? team.moniteur._id : undefined, // Assure que le guide est un User complet
        divers: team.members.map((diver: any) => diver._id),
        rentedEquipment: [],
        groupSize: team.members.length + 1,
      };

      if (!equipmentAssignments) {
        console.error("Formulaire d'équipement introuvable");
        return;
      }

      for (const member of team.members) {
        const assignedEquipments = equipmentAssignments?.[member._id];
        if (assignedEquipments?.length) {
          group.rentedEquipment.push({
            diverId: member._id,
            equipmentIds: assignedEquipments.map((e: any) => e._id), // juste les ID
          });
        }
      }

      if (team.moniteur) {
        const guideEquipments = equipmentAssignments?.[team.moniteur._id];
        if (guideEquipments?.length) {
          group.rentedEquipment.push({
            diverId: team.moniteur._id,
            equipmentIds: guideEquipments.map((e: any) => e._id),
          });
        }
      }

      return group;
    });

    const finalPayload = {
      name: `${location} ${new Date(date).toLocaleDateString('fr-FR')}`,
      location,
      date,
      duration,
      maxDepth,
      boat: boat._id,
      driver: driver._id,
      divingGroups,
    };

    console.log("📦 Payload prêt à l'envoi :", finalPayload);

    // Utilise le service pour partager les données et/ou envoyer au backend
    this.wizardService.submitWizard(finalPayload);
  } */

 
 async submitWizard() {
  let payload = this.wizardService.getPayload();

  if (this.assignEquipmentComponent) {
    const equipmentAssignments =
      this.assignEquipmentComponent.getAssignedEquipmentMap();

    payload = {
      ...payload,
      equipmentAssignments,
    };

    this.wizardService.setPayload(payload); // ✅ met à jour pour cohérence
    console.log('🎒 Payload final avec équipements :', payload);
  }

  const driver = payload.driver;
  const boat = payload.formValue1.boat;
  const date = new Date(payload.date);
  const duration = payload.duration;
  const endDate = new Date(date.getTime() + duration * 60000);

  const maxDepth = payload.formValue1.maxDepth;
  const location = payload.formValue1.location;
  const assignments = payload.equipmentAssignments; // Map { diverId: Equipment[] }

  const divingGroupIds: string[] = [];

  for (const team of payload.teams) {
    const groupPayload: any = {
      guide: team.moniteur._id,
      divers: team.members.map((m: any) => m._id),
      groupSize: team.members.length + 1,
      equipmentAssignments: [],
    };


    // Ajout équipements pour les membres
    for (const diver of team.members) {
      const diverEquip = assignments?.[diver._id] || [];
      if (diverEquip.length > 0) {
        groupPayload.equipmentAssignments.push({
          diverId: diver._id,
          equipmentIds: diverEquip.map((eq: any) => eq._id || eq),
        });
      }
    }

    try {
      const groupRes = await firstValueFrom(this.divingService.createDivingGroup(groupPayload));
      divingGroupIds.push(groupRes._id);
    } catch (error) {
      console.error("❌ Erreur à la création d’un groupe :", error);
      return; // stoppe tout si un groupe échoue
    }
  }

  const finalPayload = {
    name: `${location} ${new Date(date).toLocaleDateString('fr-FR')}`,
    location,
    date: date,
    endDate,
    duration,
    maxDepth,
    boat: boat._id,
    driver: driver._id,
    divingGroups: divingGroupIds,
  };

 this.wizardService.sendFinalReservation(finalPayload).subscribe({
    next: (res) => {
      console.log("✅ Enregistré avec succès", res);
      
      // ✅ Snackbar succès
      this.snackBar.open('Plongée créée avec succès !', 'Fermer', {
        duration: 3000,
        panelClass: ['snackbar-success'], // optionnel : ajoute un style custom si tu veux
      });

      // ✅ Redirection vers dashboard
      this.router.navigate(['/dashboard']);
    },
    error: (err) => {
      console.error("❌ Erreur à l'envoi", err);

      // ❌ Snackbar d'erreur
      this.snackBar.open('Erreur lors de la création de la plongée.', 'Fermer', {
        duration: 4000,
        panelClass: ['snackbar-error'],
      });
    }
  });
}

    validTeamsValidator(control: AbstractControl): ValidationErrors | null {
    const teams = control.value as Team[];
    if (!Array.isArray(teams) || teams.length === 0) return { noTeams: true };

    const allValid = teams.every(
      (team) =>
        team.moniteur && team.members.length > 0 && team.members.length <= 3
    );

    return allValid ? null : { invalidTeams: true };
  }

  // Appel à l'API pour récupérer les bateaux disponibles
  fetchAvailableBoats(): void {
    console.log('🔵 Récupération des bateaux disponibles');
    // if (this.scheduleForm.invalid) return;

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
      duration: duration,
    };

    this.wizardService.setPayload(payload);
    this.loadingBoats = true;
    this.errorMessage = '';

    this.availibilityService
      .getAvailableBoat(
        this.wizardService.getPayload().date,
        this.wizardService.getPayload().duration
      )
      .pipe(finalize(() => (this.loadingBoats = false)))
      .subscribe({
        next: (boats) => (this.availableBoats = boats),
        error: (err) => {
          this.errorMessage =
            'Erreur lors de la récupération des bateaux: ' + err.message;
        },
      });
  }

  onStepChange(event: StepperSelectionEvent): void {
    this.currentStep = event.selectedIndex;
  }
  onNextStep() {
    const currentFormValue = this.scheduleForm?.value;
if (!currentFormValue) {
  console.warn('🔴 Formulaire non prêt');
  return;
}

    const currentPayload = this.wizardService.getPayload();
     if (this.currentStep === 1 && this.createGroupComponent) {
    this.createGroupComponent.init(); 
  }


    // Mise à jour du payload avec les données des étapes 1 & 2
    let updatedPayload = {
      ...currentPayload,
      formValue1: this.scheduleForm.value,
      teams: this.step2FormGroup.value.groups,
      driver: this.step2FormGroup.value.driver, // Assure que le driver est un User complet
    };

    // Si on est à l'étape 3, on ajoute aussi les équipements
    if (this.currentStep === 2 && this.assignEquipmentComponent) {
      const equipmentAssignments =
        this.assignEquipmentComponent.getAssignedEquipmentMap();
      updatedPayload = {
        ...updatedPayload,
        equipmentAssignments,
      };

      console.log('🎒 Payload avec équipements :', updatedPayload);
    }

    // Mise à jour finale du payload dans le service
    this.wizardService.setPayload(updatedPayload);
    console.log('✅ Payload mis à jour :', updatedPayload);
  }
}
