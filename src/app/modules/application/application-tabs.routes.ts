import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./home/pages/home/home.page').then((m) => m.HomePage),
  },
  {
    path: 'sales',
    loadComponent: () => import('./sales/pages/sales-index/sales-index.page').then((m) => m.SalesIndexPage),
  },
  {
    path: 'master-data',
    loadComponent: () =>
      import('./master-data/pages/master-data-index/master-data-index.page').then((m) => m.MasterDataIndexPage),
  },
  {
    path: 'settings',
    loadComponent: () => import('./settings/pages/setting-index/setting-index.page').then((m) => m.SettingIndexPage),
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
];
