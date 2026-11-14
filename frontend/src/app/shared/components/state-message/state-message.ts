import { Component, input } from '@angular/core';

import { Icon } from '../icon/icon';
import { IconName } from '../icon/icons';

export type StateKind = 'loading' | 'empty' | 'error';

/**
 * The three states every list or detail page needs, with the same look everywhere:
 *
 *   <app-state-message kind="loading" title="Chargement des vols…" />
 *   <app-state-message kind="empty" title="Aucun passager" message="Créez le premier passager.">
 *     <a class="btn btn-primary" routerLink="nouveau">Nouveau passager</a>     <- optional action
 *   </app-state-message>
 *   <app-state-message kind="error" title="Impossible de charger les vols" message="Vérifiez que le backend est démarré." />
 */
@Component({
  selector: 'app-state-message',
  imports: [Icon],
  template: `
    <div class="state" [class.error]="kind() === 'error'" [attr.role]="kind() === 'error' ? 'alert' : 'status'">
      @if (kind() === 'loading') {
        <span class="spinner" aria-hidden="true"></span>
      } @else {
        <span class="symbol"><app-icon [name]="icon() ?? (kind() === 'error' ? 'circle-alert' : 'inbox')" [size]="22" /></span>
      }
      <p class="title">{{ title() }}</p>
      @if (message()) {
        <p class="message">{{ message() }}</p>
      }
      <div class="action"><ng-content /></div>
    </div>
  `,
  styles: `
    .state {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: var(--space-2);
      padding: var(--space-8) var(--space-4);
      text-align: center;
      color: var(--ink-muted);
    }

    .symbol {
      display: grid;
      place-items: center;
      width: 44px;
      height: 44px;
      border-radius: 50%;
      background: var(--neutral-soft);
      color: var(--ink-muted);
    }

    .error .symbol {
      background: var(--danger-soft);
      color: var(--danger);
    }

    .spinner {
      width: 22px;
      height: 22px;
      color: var(--sky-500);
    }

    .title {
      margin: var(--space-1) 0 0;
      font-weight: 600;
      color: var(--ink);
    }

    .message {
      margin: 0;
      max-width: 52ch;
    }

    .action:empty {
      display: none;
    }

    .action {
      margin-top: var(--space-2);
    }
  `,
})
export class StateMessage {
  readonly kind = input.required<StateKind>();
  readonly title = input.required<string>();
  readonly message = input<string>();
  /** Overrides the default icon of the empty / error state. */
  readonly icon = input<IconName>();
}
