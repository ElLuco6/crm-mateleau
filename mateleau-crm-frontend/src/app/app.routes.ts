import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { CalendarComponent } from './features/calendar/calendar.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { AuthGuard } from './auth.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: 'kanban',
    loadComponent: () =>
      import('./features/kanban/kanban.component').then(
        (m) => m.KanbanComponent
      ),
      canActivate: [AuthGuard]
  },
  {
    path: 'create-dive',
    loadComponent: () =>
      import('./features/dive-wizard/dive-wizard.component').then(
        (m) => m.DiveWizardComponent
      ),
      canActivate: [AuthGuard]
  },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./features/dashboard/dashboard.component').then(
        (m) => m.DashboardComponent
      ),
      canActivate: [AuthGuard]
  },
  {
    path: 'edit-dive/:id',
    loadComponent: () =>
      import('./features/edit-wizard/edit-wizard.component').then(
        (m) => m.EditWizardComponent
      ),
      canActivate: [AuthGuard]
  },
  {
    path: '',
    loadComponent: () =>
      import('./features/dashboard/dashboard.component').then(
        (m) => m.DashboardComponent
      ),
      canActivate: [AuthGuard]
  },
  
];
