import { Component, OnInit } from '@angular/core';
import { FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';

@Component({
  selector: 'app-calendar',
  imports: [FullCalendarModule],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.scss'
})
export class CalendarComponent implements OnInit {
  constructor() { }
  /*
  Faire le model diving 
  au click sur une plonége existante on prend id de la plongée et on la modifie 
  */
  calendarOptions = {
    initialView: 'dayGridMonth',
    plugins: [dayGridPlugin, interactionPlugin],
    events: [
      { title: 'Plongée Matin', start: '2025-03-05', className: 'event-diving' },
      { title: 'Maintenance Matériel', start: '2025-03-07', className: 'event-maintenance' }
    ]
  };

  ngOnInit(): void {
      
  }
}
