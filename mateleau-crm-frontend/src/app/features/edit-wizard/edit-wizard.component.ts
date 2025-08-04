import { AfterViewInit, Component, OnInit } from '@angular/core';
import { DiveWizardComponent } from '../dive-wizard/dive-wizard.component';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { DivingService } from '../../core/service/diving.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AvailibilityService } from '../../core/service/availibility.service';
import { NotificationService } from '../../core/service/notification.service';
import { CommonModule } from '@angular/common';
import {
  combineLatest,
  debounceTime,
  filter,
  finalize,
  firstValueFrom,
  startWith,
} from 'rxjs';
import { DiveWizardService } from '../dive-wizard/dive-wizard.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Dive } from '../../models/Dive';
import { MatStepperModule } from '@angular/material/stepper';
import { SelectScheduleComponent } from '../dive-wizard/select-schedule/select-schedule.component';
import { AssignEquipmentComponent } from '../dive-wizard/assign-equipment/assign-equipment.component';
import {
  CreateDiveGroupComponent,
  Team,
} from '../dive-wizard/create-dive-group/create-dive-group.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatTimepickerModule } from '@angular/material/timepicker';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { NgxMatTimepickerModule } from 'ngx-mat-timepicker';
import { User } from '../../models/User';
import { Diver } from '../../models/Diver';

@Component({
  selector: 'app-edit-wizard',
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
    MatSnackBarModule,
  ],
  templateUrl: './edit-wizard.component.html',
  styleUrl: './edit-wizard.component.scss',
})
export class EditWizardComponent extends DiveWizardComponent implements OnInit ,AfterViewInit  {
  constructor(
    override _formBuilder: FormBuilder,
    override wizardService: DiveWizardService,
    override route: ActivatedRoute,
    override availibilityService: AvailibilityService,
    override divingService: DivingService,
    override snackBar: MatSnackBar,
    override router: Router
  ) {
    super(
      _formBuilder,
      wizardService,
      route,
      availibilityService,
      divingService,
      snackBar,
      router
    );
  }
  dive!: Dive;
  moniteurs: User[] = [];
  divers: Diver[] = [];
  teams: Team[] = [{ moniteur: undefined, members: [] }]; // faire le model palanquée (diving group sans le matériel)
  selectedTeam: number = 0;
  initialDivers: Diver[] = [];
  initialMoniteurs: User[] = [];
  selectedDriver: User | null = null;
  isDriverSelectionMode: boolean = false;
  selectingDriver = false;

  override async ngOnInit(): Promise<void> {
    const params = await firstValueFrom(this.route.params);
    const diveId = params['id'];
    if (!diveId) return;

    this.divingService.getDiveById(diveId).subscribe({
      next: (dive) => {
        this.dive = dive;
        this.startDate = new Date(dive.date);
        console.log('Plongée récupérée pour édition :', dive);

        // Step 1 : planning & meta
        this.scheduleForm = this._formBuilder.group(
          {
            startDate: [new Date(dive.date), Validators.required],
            startTime: [this.formatTime(dive.date), Validators.required],
            duration: [dive.duration, [Validators.required, Validators.min(1)]],
            boat: [dive.boat._id],
            maxDepth: [dive.maxDepth, Validators.required],
            location: [dive.location, Validators.required],
            diveName: [dive.name, Validators.required],
          },
          { updateOn: 'change' }
        );

        // Étape 2
        const teams = dive.divingGroups.map((g) => ({
          moniteur: g.guide, // Si objet complet
          members: g.divers,
        }));

        this.step2FormGroup = this._formBuilder.group({
          groups: [teams, [Validators.required, this.validTeamsValidator]],
          driver: [dive.driver._id, Validators.required],
        });
     

        // Step 3 : matériel
        this.step3FormGroup = this._formBuilder.group({
          equipmentAssignments: this._formBuilder.group({}),
        });
        const assignMap: Record<string, string[]> = {};
        dive.divingGroups.forEach((group) => {
          group.rentedEquipment?.forEach((assign) => {
            assignMap[assign.diverId] = assign.equipmentIds;
          });
        });
        this.step3FormGroup.patchValue({ equipmentAssignments: assignMap });

        // Patch driver
        this.wizardService.setPayload({
          ...this.wizardService.getPayload(),
          driver: dive.driver,
        });

        // Lancer la recherche des bateaux
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
            .valueChanges.pipe(
              startWith(this.scheduleForm.get('duration')!.value)
            ),
          this.scheduleForm
            .get('maxDepth')!
            .valueChanges.pipe(
              startWith(this.scheduleForm.get('maxDepth')!.value)
            ),
          this.scheduleForm
            .get('location')!
            .valueChanges.pipe(
              startWith(this.scheduleForm.get('location')!.value)
            ),
          this.scheduleForm
            .get('diveName')!
            .valueChanges.pipe(
              startWith(this.scheduleForm.get('diveName')!.value)
            ),
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
            console.log('🟢 Recherche bateau déclenchée (mode édition)');
            this.fetchAvailableBoatsOnEdit();
               this.loadExistingDiveState(dive);
               this.loadExistingTeamsFromPayload(dive.divingGroups);
          });
      },
      error: (err) => {
        console.error('❌ Erreur lors du chargement de la plongée :', err);
      },
    });
  }


  loadExistingTeamsFromPayload(teamsPayload: any[]) {
  this.teams = teamsPayload.map(team => ({
    moniteur: this.initialMoniteurs.find(m => m._id === team.moniteur),
    members: team.members.map((id: string) =>
      this.initialDivers.find(d => d._id === id)
    ).filter(Boolean), // au cas où un ID n’existe pas
  }));


  this.step2FormGroup.get('groups')?.setValue(this.teams);

  // ❌ On enlève les assignés des listes
  const assignedMoniteurs = this.teams.map(t => t.moniteur?._id);
  const assignedDivers = this.teams.flatMap(t => t.members.map(m => m._id));

  this.moniteurs = this.initialMoniteurs.filter(m => !assignedMoniteurs.includes(m._id));
  this.divers = this.initialDivers.filter(d => !assignedDivers.includes(d._id));
}


  formatTime(dateStr: string | Date): string {
    const date = new Date(dateStr);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  }

  override async submitWizard() {
    if (!this.dive) {
      console.error('❌ Aucune plongée à mettre à jour.');
      return;
    }

    let payload = this.wizardService.getPayload();

    if (this.assignEquipmentComponent) {
      const equipmentAssignments =
        this.assignEquipmentComponent.getAssignedEquipmentMap();

      payload = {
        ...payload,
        equipmentAssignments,
      };

      this.wizardService.setPayload(payload);
      console.log('🎒 Payload final avec équipements :', payload);
    }

    const driver = payload.driver;
    const boat = payload.formValue1.boat;
    const date = new Date(payload.date);
    const duration = payload.duration;
    const endDate = new Date(date.getTime() + duration * 60000);

    const maxDepth = payload.formValue1.maxDepth;
    const location = payload.formValue1.location;
    const assignments = payload.equipmentAssignments;

    const divingGroupIds: string[] = [];

    for (const team of payload.teams) {
      const groupPayload: any = {
        guide: team.moniteur._id,
        divers: team.members.map((m: any) => m._id),
        groupSize: team.members.length + 1,
        equipmentAssignments: [],
      };

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
        const groupRes = await firstValueFrom(
          this.divingService.createDivingGroup(groupPayload)
        );
        divingGroupIds.push(groupRes._id);
      } catch (error) {
        console.error('❌ Erreur à la création d’un groupe :', error);
        return;
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

    this.divingService.updateDive(this.dive._id, finalPayload).subscribe({
      next: (res) => {
        console.log('✅ Mise à jour réussie :', res);

        this.snackBar.open('Plongée mise à jour avec succès !', 'Fermer', {
          duration: 3000,
          panelClass: ['snackbar-success'],
        });

        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        console.error('❌ Erreur lors de la mise à jour :', err);

        this.snackBar.open(
          'Erreur lors de la mise à jour de la plongée.',
          'Fermer',
          {
            duration: 4000,
            panelClass: ['snackbar-error'],
          }
        );
      },
    });
  }

  override ngAfterViewInit(): void {
    //  this.loadExistingDiveState(this.dive);
  }


  /**
   * Meme fonction que dans le composant de création, mais pour l'édition on ajoute le bateau de la plongée
   */
  fetchAvailableBoatsOnEdit(): void {
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
        next: (boats) => (this.availableBoats = [...boats, this.dive.boat]),
        error: (err) => {
          this.errorMessage =
            'Erreur lors de la récupération des bateaux: ' + err.message;
        },
      });
  }

  loadExistingDiveState(dive: Dive) {
 
    // ✅ Conducteur
    this.selectedDriver = dive.driver;
    this.step2FormGroup.get('driver')?.setValue(this.selectedDriver);

    // ❌ Retirer le driver de la liste des moniteurs dispo
    this.moniteurs = this.moniteurs.filter(
      (m) => m._id !== this.selectedDriver?._id
    );

    // ✅ Palanquées
    this.teams = dive.divingGroups.map((group) => ({
      moniteur: group.guide,
      members: group.divers,
    }));

    // ❌ Enlever les plongeurs/moniteurs assignés des listes dispo
    const assignedDiverIds = this.teams.flatMap((t) =>
      t.members.map((m) => m._id)
    );
    const assignedMoniteurIds = this.teams
      .map((t) => t.moniteur?._id)
      .filter((id) => !!id);

    this.divers = this.divers.filter((d) => !assignedDiverIds.includes(d._id));
    this.moniteurs = this.moniteurs.filter(
      (m) => !assignedMoniteurIds.includes(m._id)
    );

    // ✅ Patch dans le form
         console.log('🟢 État de la plongée chargé dans le wizard', { dive: this.dive, teams: this.teams });
    this.step2FormGroup.get('groups')?.setValue(this.teams);
  }
}
