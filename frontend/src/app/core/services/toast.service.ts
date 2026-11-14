import { Injectable, signal } from '@angular/core';

export type ToastType = 'success' | 'error' | 'info';

export interface Toast {
  id: number;
  type: ToastType;
  message: string;
}

/**
 * Shows short messages ("Réservation créée", "Erreur 409...") in the corner
 * of the screen. Any component or interceptor can inject it.
 *
 * providedIn: 'root' = one single instance shared by the whole application.
 */
@Injectable({ providedIn: 'root' })
export class ToastService {
  /** Private, writable list. Only this service can change it. */
  private readonly toastList = signal<Toast[]>([]);

  /** Public, read-only view used by ToastContainer to display the toasts. */
  readonly toasts = this.toastList.asReadonly();

  private nextId = 1;

  success(message: string): void {
    this.show('success', message);
  }

  error(message: string): void {
    this.show('error', message, 6000);
  }

  info(message: string): void {
    this.show('info', message);
  }

  dismiss(id: number): void {
    this.toastList.update((list) => list.filter((toast) => toast.id !== id));
  }

  private show(type: ToastType, message: string, durationMs = 4000): void {
    const id = this.nextId++;
    // Several requests failing together (backend stopped) would stack identical messages:
    // a message already on screen is not shown a second time.
    if (this.toastList().some((toast) => toast.type === type && toast.message === message)) {
      return;
    }
    this.toastList.update((list) => [...list, { id, type, message }]);
    setTimeout(() => this.dismiss(id), durationMs);
  }
}
