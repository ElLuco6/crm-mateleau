import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin, { DateClickArg } from '@fullcalendar/interaction';
import { EventClickArg } from '@fullcalendar/core';

@Component({
  selector: 'app-calendar',
  imports: [FullCalendarModule, CommonModule, RouterModule],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.scss'
})
export class CalendarComponent implements OnInit {
  /*
  Faire le model diving 
  au click sur une plonége existante on prend id de la plongée et on la modifie 
  */
  showDateModal: boolean = false;
  selectedDate: string = '';
  showEventModal: boolean = false;
  selectedEvent: any = null;
  events = [
    { id:'1',title: 'Plongée Matin', start: '2025-03-05', className: 'event-diving',  extendedProps: { description: 'Excursion dans les eaux de Bali' } },
    {id:'2', title: 'Maintenance Matériel', start: '2025-03-07', className: 'event-maintenance' ,extendedProps: { description: 'Aventure dans les Caraïbes' }}
  ];
  calendarOptions = {
    initialView: 'dayGridMonth',
    plugins: [dayGridPlugin, interactionPlugin],
    dateClick: this.handleDateClick.bind(this),
    eventClick: this.handleEventClick.bind(this),
   events : this.events
  };
 
  constructor(public router: Router) { }
  
  ngOnInit(): void {
      
  }
  // Lors du clic sur un événement : ouvre la modale d'information
  handleEventClick(arg: any): void {
    this.selectedEvent = {
      id: arg.event.id,
      title: arg.event.title,
      date: arg.event.start ? arg.event.start.toISOString().split('T')[0] : '',
      description: arg.event.extendedProps.description
    };
    this.showEventModal = true;
  }

  handleDateClick(arg: DateClickArg): void {
    this.selectedDate = arg.dateStr; // Format ISO, ex: "2025-03-23"
    this.showDateModal = true;
  }

  // Actions de la modale de date
  closeDateModal(): void {
    this.showDateModal = false;
  }
  confirmCreateDive(): void {
    this.showDateModal = false;
    this.router.navigate(['/create-dive'], { queryParams: { date: this.selectedDate } });
  }

  // Actions de la modale d'événement
  closeEventModal(): void {
    this.showEventModal = false;
  }
  deleteEvent(): void {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet événement ?')) {
      // Exemple de suppression locale, à adapter selon votre service/API
      this.events = this.events.filter(event => event.id !== this.selectedEvent.id);
      // Mise à jour des événements dans le calendrier
      this.calendarOptions = { ...this.calendarOptions, events: this.events };
      this.showEventModal = false;
    }
  }
  goToEventDetail(): void {
    this.showEventModal = false;
    this.router.navigate(['/edit-dive', this.selectedEvent.id]);
  }

}
