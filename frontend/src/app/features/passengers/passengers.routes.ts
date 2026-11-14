import { Routes } from '@angular/router';

/**
 * Routes of the passengers module, all under /passengers (see app.routes.ts).
 * Each page is lazy-loaded. A ":id" segment is given to the page as an input
 * (withComponentInputBinding in app.config.ts).
 * ':id/modifier' stays LAST: the router takes the first matching route,
 * so it must come after fixed paths like 'vols' or 'avis'.
 */
export const PASSENGERS_ROUTES: Routes = [
  {
    path: '',
    title: 'Passagers',
    loadComponent: () => import('./pages/passager-list/passager-list').then((m) => m.PassagerList),
  },
  {
    path: 'nouveau',
    title: 'Nouveau passager',
    loadComponent: () => import('./pages/passager-form/passager-form').then((m) => m.PassagerForm),
  },
  {
    path: 'reservations',
    title: 'Réservations',
    loadComponent: () => import('./pages/reservation-list/reservation-list').then((m) => m.ReservationList),
  },
  {
    path: 'reservations/nouvelle',
    title: 'Nouvelle réservation',
    loadComponent: () => import('./pages/reservation-form/reservation-form').then((m) => m.ReservationForm),
  },
  {
    path: 'reservations/:id',
    title: 'Réservation',
    loadComponent: () => import('./pages/reservation-detail/reservation-detail').then((m) => m.ReservationDetailPage),
  },
  {
    path: 'bagages',
    title: 'Bagages',
    loadComponent: () => import('./pages/bagage-list/bagage-list').then((m) => m.BagageList),
  },
  {
    path: 'bagages/:id',
    title: 'Suivi du bagage',
    loadComponent: () => import('./pages/bagage-detail/bagage-detail').then((m) => m.BagageDetailPage),
  },
  {
    path: 'vols',
    title: 'Vols et horaires',
    loadComponent: () => import('./pages/vol-board/vol-board').then((m) => m.VolBoard),
  },
  {
    path: 'espace',
    title: 'Espace passager',
    loadComponent: () => import('./pages/espace-passager/espace-passager').then((m) => m.EspacePassagerPage),
  },
  {
    path: 'embarquement',
    title: 'Embarquement',
    loadComponent: () => import('./pages/embarquement/embarquement').then((m) => m.EmbarquementPage),
  },
  {
    path: 'points-controle',
    title: 'Points de contrôle',
    loadComponent: () => import('./pages/points-controle/points-controle').then((m) => m.PointsControle),
  },
  {
    path: 'assistances',
    title: 'Assistance',
    loadComponent: () => import('./pages/assistance-list/assistance-list').then((m) => m.AssistanceList),
  },
  {
    path: 'avis',
    title: 'Avis des passagers',
    loadComponent: () => import('./pages/avis-list/avis-list').then((m) => m.AvisList),
  },
  {
    path: 'reclamations',
    title: 'Réclamations',
    loadComponent: () => import('./pages/reclamation-list/reclamation-list').then((m) => m.ReclamationList),
  },
  {
    path: 'reclamations/nouvelle',
    title: 'Nouvelle réclamation',
    loadComponent: () => import('./pages/reclamation-form/reclamation-form').then((m) => m.ReclamationForm),
  },
  {
    path: 'reclamations/:id',
    title: 'Réclamation',
    loadComponent: () => import('./pages/reclamation-detail/reclamation-detail').then((m) => m.ReclamationDetailPage),
  },
  {
    path: 'objets-trouves',
    title: 'Objets trouvés',
    loadComponent: () => import('./pages/objet-list/objet-list').then((m) => m.ObjetList),
  },
  {
    path: 'objets-trouves/:id',
    title: 'Objet trouvé',
    loadComponent: () => import('./pages/objet-detail/objet-detail').then((m) => m.ObjetDetailPage),
  },
  {
    path: ':id/modifier',
    title: 'Modifier le passager',
    loadComponent: () => import('./pages/passager-form/passager-form').then((m) => m.PassagerForm),
  },
];
