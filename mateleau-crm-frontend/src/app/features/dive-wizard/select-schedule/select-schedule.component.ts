import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { AvailibilityService } from '../../../core/service/availibility.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { BoatService } from '../../../core/service/boat.service';
import { Boat } from '../../../models/Boat';
import { firstValueFrom } from 'rxjs';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import {MatTimepickerModule} from '@angular/material/timepicker';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-select-schedule',
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatTimepickerModule],
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
 * avoir un select pour l'heure 
 * Ne plus dépendre du bouton rechercher qauand une date + h + durée et valide lancer la recherche des bateaux
 * la date dans le form est préremplie avec la date passé en paramètre
 * refaire un peu de style car le formulaire est moche
 */
  constructor(  private availibilityService:AvailibilityService, 
                private fb: FormBuilder,
                private boatService: BoatService,
                private route: ActivatedRoute) {
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
  
    const date: Date = this.scheduleForm.get('startDate')?.value;
    const time: string = this.scheduleForm.get('startTime')?.value; // format "HH:mm"
    const duration: number = this.scheduleForm.get('duration')?.value;
  
    // Fusion date + heure
    const [hours, minutes] = time.split(':').map(Number);
    const fullDate = new Date(date);
    fullDate.setHours(hours, minutes, 0, 0);
  
    this.loadingBoats = true;
    this.errorMessage = '';
  
    this.availibilityService.getAvailableBoat(fullDate, duration)
      .subscribe({
        next: (boats) => {
          this.availableBoats = boats;
          this.loadingBoats = false;
        },
        error: (err) => {
          this.errorMessage = 'Erreur lors de la récupération des bateaux: ' + err.message;
          this.loadingBoats = false;
        }
      });
  }
}
