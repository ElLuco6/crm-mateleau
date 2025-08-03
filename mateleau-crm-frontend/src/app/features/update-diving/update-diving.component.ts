import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { DivingService } from '../../core/service/diving.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Dive } from '../../models/Dive';
import { CommonModule } from '@angular/common';
import { User } from '../../models/User';
import { Diver } from '../../models/Diver';
import { Boat } from '../../models/Boat';
import { AvailibilityService } from '../../core/service/availibility.service';
import { NotificationService } from '../../core/service/notification.service';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';


@Component({
  selector: 'app-update-diving',
  imports: [ReactiveFormsModule, CommonModule, FormsModule, MatFormFieldModule, MatSelectModule, MatDatepickerModule, MatInputModule],
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
  ) {

    
  }
availableUsers: User[] = [];
availableDivers: Diver[] = [];
availableBoats: Boat[] = [];
  dive!: Dive;
diveForm : FormGroup  = new FormGroup({})

  ngOnInit(): void {
    
    this.route.params.subscribe((params) => {
      const diveId = params['id'];
      this.diveService.getDiveById(diveId).subscribe((dive) => {
        this.dive = dive;

        this.diveForm = this.fb.group({
          name: [dive.name, Validators.required],
          location: [dive.location, Validators.required],
          date: [new Date(dive.date), Validators.required],
          startTime: [this.formatTime(dive.date), Validators.required],
          duration: [dive.duration, [Validators.required, Validators.min(1)]],
          maxDepth: [dive.maxDepth, Validators.required],
          boat: [dive.boat, Validators.required],
          driver: [dive.driver, Validators.required],
          divingGroups: [dive.divingGroups], // Tu peux ignorer ou faire un select rapide
        });

        this.fetchAvailability();
      });
    });
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

  if (date && duration) {
    this.availabilityService.getAvailableUsers(date, duration).subscribe(users => {
      this.availableUsers = users;
    });

    this.availabilityService.getAvailableDivers(date, duration).subscribe(divers => {
      this.availableDivers = divers;
    });

    this.availabilityService.getAvailableBoat(date, duration).subscribe(boats => {
      this.availableBoats = boats;
    });
  }
}

submitEdit() {
  const payload = {
    ...this.diveForm.value,
    date: this.diveForm.value.startTime,
    divingGroups: this.diveForm.value.divingGroups // si besoin
  };

  this.diveService.updateDive(this.dive._id, payload).subscribe({
    next: () => {
      this.notificationService.show('✅ Plongée mise à jour avec succès');
      this.router.navigate(['/dashboard']);
    },
    error: () => {
      this.notificationService.show('❌ Erreur lors de la mise à jour');
    }
  });
}


}
