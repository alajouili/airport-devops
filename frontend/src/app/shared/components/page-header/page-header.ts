import { Component, input } from '@angular/core';

/**
 * The title block at the top of every page.
 *
 * Usage:
 *   <app-page-header title="Passagers" subtitle="Liste des passagers">
 *     <button class="btn btn-primary">Nouveau</button>   <- projected into <ng-content>
 *   </app-page-header>
 */
@Component({
  selector: 'app-page-header',
  templateUrl: './page-header.html',
  styleUrl: './page-header.css',
})
export class PageHeader {
  /** input() creates a property the parent fills from its HTML. */
  readonly title = input.required<string>();
  readonly subtitle = input<string>();
}
