import { Component, ElementRef, effect, inject, viewChild } from '@angular/core';

import { ConfirmService } from '../../../core/services/confirm.service';
import { Icon } from '../icon/icon';

/**
 * The confirmation dialog, placed once in the layout.
 * It uses the native <dialog> element: showModal() traps the keyboard focus inside,
 * Escape closes it, and the rest of the page cannot be clicked while it is open.
 */
@Component({
  selector: 'app-confirm-dialog',
  imports: [Icon],
  templateUrl: './confirm-dialog.html',
  styleUrl: './confirm-dialog.css',
})
export class ConfirmDialog {
  protected readonly confirmService = inject(ConfirmService);
  private readonly dialog = viewChild.required<ElementRef<HTMLDialogElement>>('dialog');

  constructor() {
    // Open or close the native dialog when a request arrives or is answered.
    effect(() => {
      const element = this.dialog().nativeElement;
      const pending = this.confirmService.pending();
      if (pending && !element.open) {
        element.showModal();
      } else if (!pending && element.open) {
        element.close();
      }
    });
  }

  /** Escape key or form "cancel": answer "no". */
  protected onCancel(event: Event): void {
    event.preventDefault();
    this.confirmService.answer(false);
  }

  /** A click on the dark backdrop (outside the panel) also answers "no". */
  protected onBackdropClick(event: MouseEvent): void {
    if (event.target === this.dialog().nativeElement) {
      this.confirmService.answer(false);
    }
  }
}
