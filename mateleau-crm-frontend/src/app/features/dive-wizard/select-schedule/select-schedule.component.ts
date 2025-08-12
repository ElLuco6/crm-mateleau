import { ChangeDetectionStrategy, Component,  Input   } from '@angular/core';
import { FormBuilder, FormGroup,  ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { BoatService } from '../../../core/service/boat.service';
import { Boat } from '../../../models/Boat';
import {  firstValueFrom } from 'rxjs';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import {MatTimepickerModule} from '@angular/material/timepicker';
import { NgxMatTimepickerModule } from 'ngx-mat-timepicker';
import { Spot } from '../../../models/Spot';


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
export class SelectScheduleComponent {
  @Input() formGroup!: FormGroup;
  @Input() boats: any[] = [];
  @Input() modeEdit!: boolean;


 
  loadingBoats = false;
  errorMessage: string = '';
  boatForm = false;
  newBoatForm: FormGroup;
  startDate: Date = new Date(); // Date par défaut récupérer dans l'url
  @Input() location: Spot[] = [];

  constructor(  private fb: FormBuilder,
                private boatService: BoatService,
                ) {
                

                  this.newBoatForm = this.fb.group({
                    name: ['', Validators.required],
                    numberMaxPlaces: [ null, Validators.required],
                    revisionDate: [new Date(), [Validators.required, ]],
                  });
                  

                 }


  async addNewBoat() {

    const newBoat: Boat = this.newBoatForm.value;
    try {
      const response = await firstValueFrom(this.boatService.create(newBoat));
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
