import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewChild, viewChild } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FullCalendarComponent, FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin, { DateClickArg } from '@fullcalendar/interaction';
import { DivingService } from '../../core/service/diving.service';
import { EventInput } from '@fullcalendar/core';
import { Dive } from '../../models/Dive';
import { NotificationService } from '../../core/service/notification.service';
import { Subject } from 'rxjs/internal/Subject';
import { takeUntil } from 'rxjs';

@Component({
  selector: 'app-calendar',
  imports: [FullCalendarModule, CommonModule, RouterModule],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.scss'
})
export class CalendarComponent implements OnInit, OnDestroy{
 
  showDateModal: boolean = false;
  selectedDate: string = '';
  showEventModal: boolean = false;
  selectedEvent: any = null;
  events: EventInput[] = [];

@ViewChild('calendar') calendarComponent: FullCalendarComponent | undefined;

private destroy$ = new Subject<void>();
  calendarOptions = {
    initialView: 'dayGridMonth',
    plugins: [dayGridPlugin, interactionPlugin],
    dateClick: this.handleDateClick.bind(this),
    eventClick: this.handleEventClick.bind(this),
   events : this.events
  };
 
  constructor(public router: Router,
    private divingService: DivingService,
    private notificationService: NotificationService
  ) { }
  
  ngOnInit(): void {
      this.loadDives();
  }

  ngOnDestroy(): void {
       this.destroy$.next();
    this.destroy$.complete();
  }


  loadDives() {
 this.divingService.getAllDiving().pipe(takeUntil(this.destroy$)).subscribe((dives: Dive[]) => {

  this.events = dives
  .map(dive => {
    const start = new Date(dive.date);
    if (isNaN(start.getTime())) {
      console.warn('Date invalide pour la plongée :', dive);
      return null;
    }
    const end = new Date(start.getTime() + dive.duration * 60000);

    if (isNaN(end.getTime())) {
      console.warn('Date invalide pour la plongée :', dive);
      return null;
    }
    return {
      id: dive._id,
      title: dive.name,
      start: start.toISOString(),
      end: end.toISOString(),
      className: 'event-diving',
      extendedProps: { dive }
    } as EventInput;
  })
  .filter((event): event is EventInput => event !== null); // <-- filtre les null

  this.calendarOptions = {
    ...this.calendarOptions,
    events: this.events
  };
});

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
    if (!this.selectedEvent?.id) return;

  if (window.confirm('Êtes-vous sûr de vouloir supprimer cette plongée ?')) {
    this.divingService.delete(this.selectedEvent.id).subscribe({
      next: () => {
        // Mise à jour locale après suppression
        this.events = this.events.filter(event => event.id !== this.selectedEvent.id);
        this.calendarOptions = { ...this.calendarOptions, events: this.events };
        this.showEventModal = false;
        this.notificationService.show('Plongée supprimée avec succès', 'success');

      },
      error: (err) => {
        console.error('Erreur lors de la suppression :', err);
        
        this.notificationService.show('Échec de la suppression de la plongée', 'error');
      }
    });
  }
  }
  goToEventDetail(): void {
    this.showEventModal = false;
    this.router.navigate(['/edit-dive', this.selectedEvent.id]);
  }

  refreshCalendar(): void {
  this.calendarComponent?.getApi().updateSize();
}


}
