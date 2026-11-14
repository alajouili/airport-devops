import { DatePipe, DecimalPipe } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { PageHeader } from '../../../../shared/components/page-header/page-header';
import { StarsPipe } from '../../../../shared/pipes/stars.pipe';
import { Avis } from '../../models/avis.model';
import { AvisService } from '../../services/avis.service';

/** Passenger reviews with the average and the distribution of stars. */
@Component({
  selector: 'app-avis-list',
  imports: [RouterLink, DatePipe, DecimalPipe, StarsPipe, PageHeader],
  templateUrl: './avis-list.html',
  styleUrl: './avis-list.css',
})
export class AvisList implements OnInit {
  private readonly avisService = inject(AvisService);

  /** All reviews (statistics are computed on all of them). */
  protected readonly avis = signal<Avis[]>([]);
  protected readonly filtreNote = signal<number | null>(null);
  protected readonly loading = signal(true);

  protected readonly avisAffiches = computed(() => {
    const note = this.filtreNote();
    return note ? this.avis().filter((a) => a.note === note) : this.avis();
  });

  protected readonly moyenne = computed(() => {
    const list = this.avis();
    return list.length ? list.reduce((total, a) => total + a.note, 0) / list.length : 0;
  });

  /** For 5, 4, 3, 2, 1 stars: number of reviews and percentage (bar width). */
  protected readonly repartition = computed(() => {
    const list = this.avis();
    return [5, 4, 3, 2, 1].map((note) => {
      const nombre = list.filter((a) => a.note === note).length;
      return { note, nombre, pourcentage: list.length ? (nombre * 100) / list.length : 0 };
    });
  });

  ngOnInit(): void {
    this.avisService.getAll(null).subscribe({
      next: (list) => {
        this.avis.set(list);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  protected filtrer(note: number): void {
    this.filtreNote.update((actuel) => (actuel === note ? null : note));
  }
}
