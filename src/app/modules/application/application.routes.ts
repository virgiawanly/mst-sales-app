import { Routes } from '@angular/router';
import { ApplicationLayoutComponent } from '../layouts/application-layout/application-layout.component';

export const routes: Routes = [
  {
    path: '',
    component: ApplicationLayoutComponent,
    loadChildren: () =>
      import('./application-tabs.routes').then((m) => m.routes),
  },
  {
    path: 'home',
    loadChildren: () => import('./home/home.routes').then((m) => m.routes),
  },
  {
    path: 'sales',
    loadChildren: () => import('./sales/sales.routes').then((m) => m.routes),
  },
  {
    path: 'master-data',
    loadChildren: () =>
      import('./master-data/master-data.routes').then((m) => m.routes),
  },
  {
    path: 'settings',
    loadChildren: () =>
      import('./settings/settings.routes').then((m) => m.routes),
  },
];
