import { Component, OnInit, ViewChild } from '@angular/core';
import { CalendarComponent } from '../calendar/calendar.component';
import { CrudBoatsComponent } from './crud-boats/crud-boats.component';
import { CrudUsersComponent } from './crud-users/crud-users.component';
import { CrudEquipmentsComponent } from './crud-equipments/crud-equipments.component';
import {MatTabChangeEvent, MatTabsModule} from '@angular/material/tabs';
import { CrudDiversComponent } from './crud-divers/crud-divers.component';
import { TodayComponent } from './today/today.component';
import { SpotComponent } from '../spot/spot.component';

@Component({
  selector: 'app-dashboard',
  imports: [CalendarComponent,TodayComponent,CrudBoatsComponent,CrudUsersComponent,CrudEquipmentsComponent,MatTabsModule,CrudDiversComponent,SpotComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
constructor() { }
ngOnInit(): void {
}
@ViewChild('mapComponent') mapComponent!: SpotComponent;

onTabChange(event: MatTabChangeEvent) {
  if (event.index === 2) {
    this.mapComponent?.initMapSafely(); // appel déclenché uniquement quand l’onglet est actif
  }
}


}
