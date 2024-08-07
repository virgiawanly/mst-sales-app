import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'create',
    loadComponent: () =>
      import('./pages/sales-create/sales-create.page').then(
        (m) => m.SalesCreatePage
      ),
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./pages/sales-show/sales-show.page').then((m) => m.SalesShowPage),
  },
  {
    path: ':id/edit',
    loadComponent: () =>
      import('./pages/sales-edit/sales-edit.page').then((m) => m.SalesEditPage),
  },
];
