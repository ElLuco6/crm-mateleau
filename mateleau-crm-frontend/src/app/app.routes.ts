import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { CalendarComponent } from './features/calendar/calendar.component';

export const routes: Routes = [
    {path:'login', component: LoginComponent},
    {
        path: 'kanban',
        loadComponent: () => import('./features/kanban/kanban.component').then(m => m.KanbanComponent)
    },
    {path: '', component: CalendarComponent},
];
