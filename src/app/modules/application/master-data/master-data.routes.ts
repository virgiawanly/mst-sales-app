import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'customers/create',
    loadComponent: () => import('./pages/customer-create/customer-create.page').then((m) => m.CustomerCreatePage),
  },
  {
    path: 'customers/:id',
    loadComponent: () => import('./pages/customer-show/customer-show.page').then((m) => m.CustomerShowPage),
  },
  {
    path: 'customers/:id/edit',
    loadComponent: () => import('./pages/customer-edit/customer-edit.page').then((m) => m.CustomerEditPage),
  },
];
