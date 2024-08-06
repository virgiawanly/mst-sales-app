import { Routes } from '@angular/router';
import { authGuard } from 'src/app/core/guards/auth.guard';
import { ApplicationLayoutComponent } from '../layouts/application-layout/application-layout.component';

export const routes: Routes = [
  {
    path: '',
    component: ApplicationLayoutComponent,
    canActivate: [authGuard],
    loadChildren: () =>
      import('./application-tabs.routes').then((m) => m.routes),
  },
  {
    path: 'home',
    canActivate: [authGuard],
    loadChildren: () => import('./home/home.routes').then((m) => m.routes),
  },
  {
    path: 'sales',
    canActivate: [authGuard],
    loadChildren: () => import('./sales/sales.routes').then((m) => m.routes),
  },
  {
    path: 'master-data',
    canActivate: [authGuard],
    loadChildren: () =>
      import('./master-data/master-data.routes').then((m) => m.routes),
  },
  {
    path: 'settings',
    canActivate: [authGuard],
    loadChildren: () =>
      import('./settings/settings.routes').then((m) => m.routes),
  },
];
