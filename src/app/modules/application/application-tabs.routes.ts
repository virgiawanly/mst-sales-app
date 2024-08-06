import { Routes } from '@angular/router';
import { authGuard } from 'src/app/core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'home',
    canActivate: [authGuard],
    loadComponent: () => import('./home/pages/home/home.page').then((m) => m.HomePage),
  },
  {
    path: 'sales',
    canActivate: [authGuard],
    loadComponent: () => import('./sales/pages/sales-index/sales-index.page').then((m) => m.SalesIndexPage),
  },
  {
    path: 'master-data',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./master-data/pages/master-data-index/master-data-index.page').then((m) => m.MasterDataIndexPage),
  },
  {
    path: 'settings',
    canActivate: [authGuard],
    loadComponent: () => import('./settings/pages/setting-index/setting-index.page').then((m) => m.SettingIndexPage),
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
];
