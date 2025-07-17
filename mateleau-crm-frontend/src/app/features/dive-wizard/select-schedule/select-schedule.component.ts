import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { AvailibilityService } from '../../../core/service/availibility.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { BoatService } from '../../../core/service/boat.service';
import { Boat } from '../../../models/Boat';
import { debounce, debounceTime, filter, finalize, firstValueFrom } from 'rxjs';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import {MatTimepickerModule} from '@angular/material/timepicker';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxMatTimepickerModule } from 'ngx-mat-timepicker';
import { DiveWizardService } from '../dive-wizard.service';


@Component({
  selector: 'app-select-schedule',
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatTimepickerModule,
    NgxMatTimepickerModule],
    providers: [provideNativeDateAdapter()],
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './select-schedule.component.html',
    styleUrl: './select-schedule.component.scss'
})
export class SelectScheduleComponent implements OnInit {
  scheduleForm: FormGroup;
  availableBoats: any[] = [];
  loadingBoats = false;
  errorMessage: string = '';
  boatForm = false;
  newBoatForm: FormGroup;
  startDate: Date = new Date(); // Date par défaut récupérer dans l'url
/**
 * Les truc a faire :
 * Ne plus dépendre du bouton rechercher qauand une date + h + durée et valide lancer la recherche des bateaux
 * la date dans le form est préremplie avec la date passé en paramètre
 * refaire un peu de style car le formulaire est moche
 */
  constructor(  private availibilityService:AvailibilityService, 
                private fb: FormBuilder,
                private boatService: BoatService,
                private route: ActivatedRoute,
                private wizardService: DiveWizardService ) {
                  this.scheduleForm = this.fb.group({
                    startDate: ['', Validators.required],
                    startTime: ['', Validators.required],
                    duration: [null, [Validators.required, Validators.min(1)]],
                    boat: [''] // tu l'utiliseras peut-être plus tard
                  });

                  this.newBoatForm = this.fb.group({
                    name: ['', Validators.required],
                    numberMaxPlaces: [ null, Validators.required],
                    revisionDate: [new Date(), [Validators.required, ]],
                  });
                  

                 }


   ngOnInit(): void {
    this.startDate = this.route.snapshot.queryParams['date'] ? new Date(this.route.snapshot.queryParams['date']) : new Date();
    this.scheduleForm = this.fb.group({
      startDate: [this.startDate, Validators.required],
      startTime: ['', Validators.required],
      duration: [null, [Validators.required, Validators.min(1)]],
      boat: [''] // tu l'utiliseras peut-être plus tard
    });
    this.scheduleForm.valueChanges.pipe(
      debounceTime(300),
      filter(() => this.scheduleForm.valid) // uniquement quand le formulaire est valide
    )
    .subscribe(() => {
      this.fetchAvailableBoats();
    });
  }

  async addNewBoat() {

    const newBoat: Boat = this.newBoatForm.value;
    try {
      const response = await firstValueFrom(this.boatService.addBoat(newBoat));
      console.log('Bateau ajouté avec succès', response);
      this.boatForm = false;
      this.newBoatForm.reset();
      this.fetchAvailableBoats();
    } catch (err) {
      console.error('Erreur lors de l\'ajout du bateau', err);
    }
  }


  showBoatForm(){
    this.boatForm = true;
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
