import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () =>
      import('./home/pages/home/home.page').then((m) => m.HomePage),
  },
  {
    path: 'sales',
    loadComponent: () =>
      import('./sales/pages/sales-index/sales-index.page').then(
        (m) => m.SalesIndexPage
      ),
  },
  {
    path: 'master-data/customers',
    loadComponent: () =>
      import('./master-data/pages/customer-index/customer-index.page').then(
        (m) => m.CustomerIndexPage
      ),
  },
  {
    path: 'master-data/barang',
    loadComponent: () =>
      import('./master-data/pages/barang-index/barang-index.page').then(
        (m) => m.BarangIndexPage
      ),
  },
  {
    path: 'master-data',
    redirectTo: 'master-data/customers',
    pathMatch: 'full',
  },
  {
    path: 'settings',
    loadComponent: () =>
      import('./settings/pages/setting-index/setting-index.page').then(
        (m) => m.SettingIndexPage
      ),
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
];
