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
  {
    path: 'barang/create',
    loadComponent: () => import('./pages/barang-create/barang-create.page').then((m) => m.BarangCreatePage),
  },
  {
    path: 'barang/:id',
    loadComponent: () => import('./pages/barang-show/barang-show.page').then((m) => m.BarangShowPage),
  },
  {
    path: 'barang/:id/edit',
    loadComponent: () => import('./pages/barang-edit/barang-edit.page').then((m) => m.BarangEditPage),
  },
];
