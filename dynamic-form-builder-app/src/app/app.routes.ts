import { Routes } from '@angular/router';
import { authGuard, adminGuard } from './core/guards/auth.guard';
import { UserRole } from './models/form.interface';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () => import('./features/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./features/form-dashboard/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [authGuard]
  },
  {
    path: 'forms/new',
    loadComponent: () => import('./features/form-create/form-create.component').then(m => m.FormCreateComponent),
    canActivate: [adminGuard]
  },
  {
    path: 'forms/:id/edit',
    loadComponent: () => import('./features/form-create/form-create.component').then(m => m.FormCreateComponent),
    canActivate: [adminGuard]
  },
  {
    path: 'forms/:id',
    loadComponent: () => import('./features/form-fill/form-fill.component').then(m => m.FormFillComponent),
    canActivate: [authGuard]
  },
  {
    path: 'forms/:id/fill',
    loadComponent: () => import('./features/form-fill/form-fill.component').then(m => m.FormFillComponent),
    canActivate: [authGuard]
  },
  {
    path: 'unauthorized',
    loadComponent: () => import('./features/form-dashboard/dashboard.component').then(m => m.DashboardComponent)
  },
  {
    path: '**',
    redirectTo: 'dashboard'
  }
];
