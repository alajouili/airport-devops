import { Component, inject } from '@angular/core';

import { ToastService, ToastType } from '../../../core/services/toast.service';
import { Icon } from '../icon/icon';
import { IconName } from '../icon/icons';

/**
 * Displays the messages stored in ToastService, in the bottom-right corner.
 * Because ToastService.toasts is a signal, this component updates
 * automatically every time a toast is added or removed.
 */
@Component({
  selector: 'app-toast-container',
  imports: [Icon],
  templateUrl: './toast-container.html',
  styleUrl: './toast-container.css',
})
export class ToastContainer {
  protected readonly toastService = inject(ToastService);

  protected readonly icons: Record<ToastType, IconName> = {
    success: 'circle-check',
    error: 'circle-alert',
    info: 'info',
  };
}
