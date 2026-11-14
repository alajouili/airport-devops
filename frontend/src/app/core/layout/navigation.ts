import { IconName } from '../../shared/components/icon/icons';

/**
 * The sidebar menu, written as data instead of HTML.
 * To add a page to the menu, add one object here: no HTML to change.
 * The layout also uses this list to build the breadcrumb of the top bar.
 */
export interface NavItem {
  label: string;
  route: string;
  icon: IconName;
  /** true = highlighted only on this exact URL, not on its sub-pages. */
  exact?: boolean;
}

export interface NavSection {
  /** Shown above the items. Empty for the first section (dashboard). */
  title: string;
  items: NavItem[];
}

/** Modules of the work plan that are not built yet (shown greyed out, not clickable). */
export interface PlannedModule {
  label: string;
  icon: IconName;
}

export const NAVIGATION: NavSection[] = [
  {
    title: '',
    items: [{ label: 'Tableau de bord', route: '/', icon: 'layout-dashboard', exact: true }],
  },
  {
    title: 'Voyageurs',
    items: [
      { label: 'Vols et horaires', route: '/passengers/vols', icon: 'plane-takeoff' },
      { label: 'Espace passager', route: '/passengers/espace', icon: 'id-card' },
    ],
  },
  {
    title: 'Passagers et billets',
    items: [
      { label: 'Passagers', route: '/passengers', icon: 'users', exact: true },
      { label: 'Réservations', route: '/passengers/reservations', icon: 'ticket' },
      { label: 'Bagages', route: '/passengers/bagages', icon: 'luggage' },
    ],
  },
  {
    title: 'Départ',
    items: [
      { label: 'Embarquement', route: '/passengers/embarquement', icon: 'door-open' },
      { label: 'Points de contrôle', route: '/passengers/points-controle', icon: 'shield-check' },
    ],
  },
  {
    title: 'Relation client',
    items: [
      { label: 'Assistance', route: '/passengers/assistances', icon: 'accessibility' },
      { label: 'Réclamations', route: '/passengers/reclamations', icon: 'message-square-warning' },
      { label: 'Objets trouvés', route: '/passengers/objets-trouves', icon: 'package-search' },
      { label: 'Avis', route: '/passengers/avis', icon: 'star' },
    ],
  },
];

export const PLANNED_MODULES: PlannedModule[] = [
  { label: 'Parking et transports', icon: 'car-front' },
  { label: 'Facturation', icon: 'receipt-text' },
  { label: 'Achats et stocks', icon: 'package' },
  { label: 'Fret et notifications', icon: 'bell' },
];

/** The section and item that match a URL (longest matching route wins). */
export function findNavItem(url: string): { section: NavSection; item: NavItem } | null {
  const path = url.split(/[?#]/)[0];
  let best: { section: NavSection; item: NavItem } | null = null;
  for (const section of NAVIGATION) {
    for (const item of section.items) {
      const matches =
        item.route === '/'
          ? path === '/'
          : path === item.route || path.startsWith(item.route + '/');
      if (matches && (!best || item.route.length > best.item.route.length)) {
        best = { section, item };
      }
    }
  }
  return best;
}
