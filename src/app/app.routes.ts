import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () =>
      import('./modules/auth/auth.routes').then((m) => m.routes),
  },
  {
    path: 'application',
    loadChildren: () =>
      import('./modules/application/application.routes').then((m) => m.routes),
  },
  {
    path: '**',
    redirectTo: 'application',
    pathMatch: 'full',
  },
];
