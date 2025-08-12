import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { CalendarComponent } from './features/calendar/calendar.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { AuthGuard } from './auth.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: '',
    canMatch: [AuthGuard],
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' },

      { path: 'dashboard',
        loadComponent: () => import('./features/dashboard/dashboard.component')
          .then(m => m.DashboardComponent)
      },
      { path: 'kanban',
        loadComponent: () => import('./features/kanban/kanban.component')
          .then(m => m.KanbanComponent)
      },
      { path: 'create-dive',
        loadComponent: () => import('./features/dive-wizard/dive-wizard.component')
          .then(m => m.DiveWizardComponent)
      },
      { path: 'edit-dive/:id',
        loadComponent: () => import('./features/edit-wizard/edit-wizard.component')
          .then(m => m.EditWizardComponent)
      },
      { path: 'dive/:id',
        loadComponent: () => import('./features/dive-detail/dive-detail.component')
          .then(m => m.DiveDetailComponent)
      },
    ],
  },

  { path: '**', redirectTo: '' },
];
  

