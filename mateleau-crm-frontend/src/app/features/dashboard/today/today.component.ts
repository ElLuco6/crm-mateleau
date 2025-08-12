import { Component, OnInit } from '@angular/core';
import { KanbanComponent } from '../../kanban/kanban.component';
import { CommonModule } from '@angular/common';
import { DashboardService } from '../../../core/service/dashboard.service';
import { firstValueFrom } from 'rxjs';
import { NotificationService } from '../../../core/service/notification.service';
import { MatIcon, MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-today',
  imports: [KanbanComponent,CommonModule,MatIconModule],
  templateUrl: './today.component.html',
  styleUrl: './today.component.scss'
})
export class TodayComponent implements OnInit {
 

  todayDives: any[] = [];
  weekDives: any[] = [];

  todayEquipment: any[] = [];
  weekEquipment: any[] = [];

  todayBoats: any[] = [];
  weekBoats: any[] = [];

  isLoading = true;
  hasError = false;

  constructor(
    private dashboardService: DashboardService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.fetchDashboardData();
  }

  async fetchDashboardData() {
    this.isLoading = true;
    this.hasError = false;

    try {
      const [today, week] = await Promise.all([
        firstValueFrom(this.dashboardService.getDashboardToday()),
        firstValueFrom(this.dashboardService.getDashboardWeek())
      ]);

      this.todayDives = today.dives ?? [];
      this.todayEquipment = today.equipmentToReview ?? [];
      this.todayBoats = today.boatsToReview ?? [];

      this.weekDives = week.dives ?? [];
      this.weekEquipment = week.equipmentToReview ?? [];
      this.weekBoats = week.boatsToReview ?? [];
    } catch (err) {
      console.error('❌ Erreur lors du chargement du dashboard :', err);
      this.hasError = true;
    } finally {
      this.isLoading = false;
    }
  }

  sendRemindEmail(diveId: string) {
    this.notificationService.sendRemindEmailToDivers(diveId).subscribe({
      next: () => {
        this.notificationService.show('Rappel envoyé aux plongeurs.', 'success');
      },
      error: (err) => {
        this.notificationService.show('Erreur lors de l\'envoi du rappel.', 'error');
      }
    });
  }

}
