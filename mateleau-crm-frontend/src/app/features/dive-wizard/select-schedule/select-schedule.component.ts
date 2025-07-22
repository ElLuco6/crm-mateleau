import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
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
    styleUrl: './select-schedule.component.scss',
    standalone: true
})
export class SelectScheduleComponent implements OnInit {
  @Input() formGroup!: FormGroup;
  @Input() boats: any[] = [];
 
  loadingBoats = false;
  errorMessage: string = '';
  boatForm = false;
  newBoatForm: FormGroup;
  startDate: Date = new Date(); // Date par défaut récupérer dans l'url
  @Output() triggerBoatSearch = new EventEmitter<void>();
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
                

                  this.newBoatForm = this.fb.group({
                    name: ['', Validators.required],
                    numberMaxPlaces: [ null, Validators.required],
                    revisionDate: [new Date(), [Validators.required, ]],
                  });
                  

                 }


   ngOnInit(): void {
   
    if (this.formGroup) {
    this.formGroup.valueChanges
      .pipe(debounceTime(300), filter(() => this.formGroup.valid))
      .subscribe(() => {
        this.triggerBoatSearch.emit(); 
      });
  }
  }

  async addNewBoat() {

    const newBoat: Boat = this.newBoatForm.value;
    try {
      const response = await firstValueFrom(this.boatService.addBoat(newBoat));
      console.log('Bateau ajouté avec succès', response);
      this.boatForm = false;
      this.newBoatForm.reset();
     // this.fetchAvailableBoats();
    } catch (err) {
      console.error('Erreur lors de l\'ajout du bateau', err);
    }
  }

 


  showBoatForm(){
    this.boatForm = true;
  }


}
