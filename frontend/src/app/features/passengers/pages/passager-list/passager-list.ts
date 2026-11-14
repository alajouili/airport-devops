import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { ToastService } from '../../../../core/services/toast.service';
import { PageHeader } from '../../../../shared/components/page-header/page-header';
import { Passager } from '../../models/passager.model';
import { PassagerService } from '../../services/passager.service';

/** Passenger list with search, edit and delete. */
@Component({
  selector: 'app-passager-list',
  imports: [FormsModule, RouterLink, PageHeader],
  templateUrl: './passager-list.html',
})
export class PassagerList implements OnInit {
  private readonly passagerService = inject(PassagerService);
  private readonly toast = inject(ToastService);

  protected readonly passagers = signal<Passager[]>([]);
  protected readonly loading = signal(true);
  /** Bound to the search input with [(ngModel)]. */
  protected recherche = '';

  ngOnInit(): void {
    this.load();
  }

  protected load(): void {
    this.loading.set(true);
    this.passagerService.getAll(this.recherche).subscribe({
      next: (passagers) => {
        this.passagers.set(passagers);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  protected delete(passager: Passager): void {
    if (!confirm(`Supprimer le passager ${passager.nomComplet} ?`)) {
      return;
    }
    this.passagerService.delete(passager.id).subscribe(() => {
      this.toast.success('Passager supprimé');
      // Remove it from the list without reloading everything.
      this.passagers.update((list) => list.filter((p) => p.id !== passager.id));
    });
  }
}
