import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { DivingService } from '../../core/service/diving.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Dive } from '../../models/Dive';
import { CommonModule } from '@angular/common';
import { User } from '../../models/User';
import { Diver } from '../../models/Diver';
import { Boat } from '../../models/Boat';
import { AvailibilityService } from '../../core/service/availibility.service';
import { NotificationService } from '../../core/service/notification.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { NgxMatTimepickerModule } from 'ngx-mat-timepicker';
import { MatTimepickerModule } from '@angular/material/timepicker';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-update-diving',
  imports: [
    ReactiveFormsModule,
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatDatepickerModule,
    MatInputModule,
    MatTimepickerModule,
    NgxMatTimepickerModule,
  ],
  providers: [provideNativeDateAdapter()],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './update-diving.component.html',
  styleUrl: './update-diving.component.scss',
})
export class UpdateDivingComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private diveService: DivingService,
    private fb: FormBuilder,
    private availabilityService: AvailibilityService,
    private notificationService: NotificationService,
    private router: Router
  ) {}
  diveForm!: FormGroup;
  availableUsers: User[] = [];
  availableDivers: Diver[] = [];
  availableBoats: Boat[] = [];
  dive!: Dive;
  loaded = false;

   ngOnInit() {
    this.diveForm = this.fb.group({
      name: ['', Validators.required],
      location: ['', Validators.required],
      date: ['', Validators.required],
      startTime: ['', Validators.required],
      duration: [null, [Validators.required, Validators.min(1)]],
      maxDepth: [null, Validators.required],
      boat: ['', Validators.required],
      driver: ['', Validators.required],
      divingGroups: [[]], // ou null si tu veux
    });
    
    this.test();
  }

  formatTime(dateStr: string | Date): string {
    const date = new Date(dateStr);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  }

  fetchAvailability() {
    const date = this.diveForm.get('date')?.value;
    const duration = this.diveForm.get('duration')?.value;
    //if (!this.dive) return;
    if (date && duration) {
      this.availabilityService
        .getAvailableUsers(date, duration)
        .subscribe((users) => {
          console.log('Utilisateurs disponibles:', users);
          this.availableUsers = users;
        });

      this.availabilityService
        .getAvailableDivers(date, duration)
        .subscribe((divers) => {
          console.log('Plongeurs disponibles:', divers);
          this.availableDivers = divers;
        });

      this.availabilityService
        .getAvailableBoat(date, duration)
        .subscribe((boats) => {
          console.log('Bateaux disponibles:', boats);
          this.availableBoats = boats;
        });
    }
  }

  async test(){
    const params = await firstValueFrom(this.route.params);
    const diveId = params['id'];

    this.diveService.getDiveById(diveId).subscribe((dive) => {
    console.log('Plongée récupérée avec succès', dive);
      
     this.diveForm.patchValue({
        name: dive.name,
        location: dive.location,
        date: new Date(dive.date),
        startTime: this.formatTime(dive.date),
        duration: dive.duration,
        maxDepth: dive.maxDepth,
        boat: dive.boat._id,
        driver: dive.driver._id,
        divingGroups: dive.divingGroups,
      });
      this.fetchAvailability();
      this.loaded = true;
    })

  }
  
  async init(){
const params = await firstValueFrom(this.route.params);
    const diveId = params['id'];

    if (!diveId) return;

    try {
      const dive = await firstValueFrom(this.diveService.getDiveById(diveId));
      this.dive = dive;

      this.diveForm.patchValue({
        name: dive.name,
        location: dive.location,
        date: new Date(dive.date),
        startTime: this.formatTime(dive.date),
        duration: dive.duration,
        maxDepth: dive.maxDepth,
        boat: dive.boat._id,
        driver: dive.driver._id,
        divingGroups: dive.divingGroups,
      });

      this.fetchAvailability();
      this.loaded = true;
    } catch (err) {
      console.error('Erreur lors du chargement de la plongée :', err);
    }
  } 

  submitEdit() {
   
    const payload = {
      ...this.diveForm.value,
      date: this.diveForm.value.startTime,
      divingGroups: this.diveForm.value.divingGroups, // si besoin
    };
    if (this.dive) {
      this.diveService.updateDive(this.dive._id, payload).subscribe({
        next: () => {
          this.notificationService.show('✅ Plongée mise à jour avec succès');
          this.router.navigate(['/dashboard']);
        },
        error: () => {
          this.notificationService.show('❌ Erreur lors de la mise à jour');
        },
      });
    }
  }
}
