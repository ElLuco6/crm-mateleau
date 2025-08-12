import { Component, OnInit } from '@angular/core';
import { DivingService } from '../../core/service/diving.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DiveDetail } from '../../shared/types/dive-detail';
import { NotificationService } from '../../core/service/notification.service';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-dive-detail',
  imports: [CommonModule, MatIconModule,RouterModule],
  templateUrl: './dive-detail.component.html',
  styleUrl: './dive-detail.component.scss'
})
export class DiveDetailComponent implements OnInit {

  dive!: DiveDetail;
  constructor(private diveService: DivingService,
    private route: ActivatedRoute,
    private notificationService: NotificationService
  ) {
    
   }
  ngOnInit(): void {
    const diveId = this.route.snapshot.paramMap.get('id');
    if (diveId) {
      this.diveService.getDiveDetailById(diveId).subscribe(dive => {
        this.dive = dive;
        console.log(this.dive);

      });
    }
  }

   get totalGroups(): number {
    return this.dive?.totals?.groups ?? this.dive?.divingGroups?.length ?? 0;
    // ^ fallback si totals.groups n’est pas fourni
  }

  get totalDivers(): number {
    return this.dive?.totals?.divers
      ?? this.dive?.divingGroups?.reduce((acc, g) => acc + (g.divers?.length || 0), 0)
      ?? 0;
  }

  sendRemindEmailToDivers() {
    const diveId = this.route.snapshot.paramMap.get('id');
    if (diveId) {
      this.notificationService.sendRemindEmailToDivers(diveId).subscribe({
        next: () => this.notificationService.show('Rappel envoyé aux plongeurs.', 'success'),
        error: () => this.notificationService.show('Erreur lors de l\'envoi du rappel.', 'error')
      });
    }
  }

}
