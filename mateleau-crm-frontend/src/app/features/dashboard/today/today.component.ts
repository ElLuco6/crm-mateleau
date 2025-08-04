import { Component, OnInit } from '@angular/core';
import { KanbanComponent } from '../../kanban/kanban.component';
import { CommonModule } from '@angular/common';
import { DashboardService } from '../../../core/service/dashboard.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-today',
  imports: [KanbanComponent,CommonModule],
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

}
