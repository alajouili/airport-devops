import { Injectable, signal } from '@angular/core';

/** What the confirmation dialog shows. */
export interface ConfirmOptions {
  title: string;
  message: string;
  /** Text of the confirm button, a verb describing the action: "Supprimer", "Annuler la réservation". */
  confirmLabel: string;
  /** Text of the button that closes without acting. */
  cancelLabel?: string;
  /** true = red confirm button, for actions that delete or cannot be undone. */
  danger?: boolean;
}

interface PendingConfirm extends ConfirmOptions {
  resolve: (confirmed: boolean) => void;
}

/**
 * Replaces the browser's confirm() with a styled, accessible dialog.
 *
 *   if (await this.confirm.ask({ title: 'Supprimer ce passager ?', message: '…', confirmLabel: 'Supprimer', danger: true })) {
 *     ...delete
 *   }
 *
 * ConfirmDialog (placed once in the layout) displays the pending request.
 */
@Injectable({ providedIn: 'root' })
export class ConfirmService {
  private readonly pendingRequest = signal<PendingConfirm | null>(null);
  readonly pending = this.pendingRequest.asReadonly();

  ask(options: ConfirmOptions): Promise<boolean> {
    // A new question closes an older one as "not confirmed".
    this.pendingRequest()?.resolve(false);
    return new Promise<boolean>((resolve) => this.pendingRequest.set({ ...options, resolve }));
  }

  /** Called by ConfirmDialog when the user answers. */
  answer(confirmed: boolean): void {
    const request = this.pendingRequest();
    this.pendingRequest.set(null);
    request?.resolve(confirmed);
  }
}
