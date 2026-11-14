import { Component, DestroyRef, HostListener, OnInit, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRouteSnapshot, NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';

import { ConfirmDialog } from '../../shared/components/confirm-dialog/confirm-dialog';
import { Icon } from '../../shared/components/icon/icon';
import { ToastContainer } from '../../shared/components/toast-container/toast-container';
import { HealthService } from '../services/health.service';
import { NAVIGATION, PLANNED_MODULES, findNavItem } from './navigation';

/** One step of the breadcrumb; the last one has no link (current page). */
interface Crumb {
  label: string;
  link?: string;
}

/**
 * The application shell: sidebar + top bar + page area.
 * It is displayed once; only the content of <router-outlet> changes when the user navigates.
 */
@Component({
  selector: 'app-layout',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, Icon, ToastContainer, ConfirmDialog],
  templateUrl: './layout.html',
  styleUrl: './layout.css',
})
export class Layout implements OnInit {
  private readonly router = inject(Router);
  private readonly healthService = inject(HealthService);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly navigation = NAVIGATION;
  protected readonly plannedModules = PLANNED_MODULES;

  /** On small screens the sidebar is hidden until the user opens it. */
  protected readonly menuOpen = signal(false);
  protected readonly plannedOpen = signal(false);

  /** Real API status from GET /api/health: null = checking. */
  protected readonly apiUp = signal<boolean | null>(null);

  private readonly url = signal(this.router.url);
  private readonly pageTitle = signal<string | null>(null);

  /** "Relation client > Réclamations > Réclamation": section, menu item, then the page title if different. */
  protected readonly breadcrumb = computed<Crumb[]>(() => {
    const match = findNavItem(this.url());
    if (!match) {
      return [];
    }
    const crumbs: Crumb[] = [];
    if (match.section.title) {
      crumbs.push({ label: match.section.title });
    }
    const title = this.pageTitle();
    const onSubPage = title !== null && title !== match.item.label && !title.startsWith('Tableau de bord');
    crumbs.push(onSubPage ? { label: match.item.label, link: match.item.route } : { label: match.item.label });
    if (onSubPage) {
      crumbs.push({ label: title });
    }
    return crumbs;
  });

  ngOnInit(): void {
    this.updateFromRoute();
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(() => {
        this.updateFromRoute();
        this.menuOpen.set(false);
      });
    this.checkApi();
  }

  protected checkApi(): void {
    this.apiUp.set(null);
    this.healthService.check().subscribe({
      next: (status) => this.apiUp.set(status.status === 'UP' && status.database === 'UP'),
      error: () => this.apiUp.set(false),
    });
  }

  protected toggleMenu(): void {
    this.menuOpen.update((open) => !open);
  }

  protected closeMenu(): void {
    this.menuOpen.set(false);
  }

  /** The Escape key closes the mobile menu. */
  @HostListener('document:keydown.escape')
  protected onEscape(): void {
    this.menuOpen.set(false);
  }

  private updateFromRoute(): void {
    this.url.set(this.router.url);
    this.pageTitle.set(deepestTitle(this.router.routerState.snapshot.root));
  }
}

/** The "title" of the deepest active route, for example "Suivi du bagage". */
function deepestTitle(route: ActivatedRouteSnapshot): string | null {
  let current: ActivatedRouteSnapshot | null = route;
  let title: string | null = null;
  while (current) {
    if (typeof current.title === 'string') {
      title = current.title;
    }
    current = current.firstChild;
  }
  return title;
}
