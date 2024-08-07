import { Routes } from '@angular/router';
import { noAuthGuard } from 'src/app/core/guards/no-auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    canActivate: [noAuthGuard],
    loadChildren: () => import('./login/login.routes').then((m) => m.routes),
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
];
