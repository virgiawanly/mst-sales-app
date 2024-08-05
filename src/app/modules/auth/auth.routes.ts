import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'login',
    loadChildren: () =>
      import('./login/login.routes').then((m) => m.routes),
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  }
];
