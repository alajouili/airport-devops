import { Routes } from '@angular/router';

/**
 * URL -> page map.
 *
 * loadComponent / loadChildren = "lazy loading": the code of a page is
 * downloaded only when the user opens it, so the app starts faster.
 * Each of Student B's modules will add one line here in the next parts:
 *   { path: 'passengers', loadChildren: () => import('./features/passengers/passengers.routes') ... }
 */
export const routes: Routes = [
  {
    path: '',
    title: 'Tableau de bord - Airport',
    loadComponent: () => import('./features/home/home').then((m) => m.Home),
  },
  {
    path: 'passengers',
    loadChildren: () => import('./features/passengers/passengers.routes').then((m) => m.PASSENGERS_ROUTES),
  },
  // Any unknown URL goes back to the dashboard.
  { path: '**', redirectTo: '' },
];
