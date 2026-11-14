import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { Vol } from '../../../../core/models/vol.model';
import { ToastService } from '../../../../core/services/toast.service';
import { VolService } from '../../../../core/services/vol.service';
import { PageHeader } from '../../../../shared/components/page-header/page-header';
import { Passager } from '../../models/passager.model';
import { CLASSE_LABELS, CLASSE_PRIX_INDICATIF, ClasseVoyage } from '../../models/reservation.model';
import { PassagerService } from '../../services/passager.service';
import { ReservationService } from '../../services/reservation.service';

/**
 * Booking form: choose a passenger, a flight (from Student A's API) and a class.
 * After creation, the user is sent to the reservation page to pay.
 */
@Component({
  selector: 'app-reservation-form',
  imports: [ReactiveFormsModule, RouterLink, DatePipe, CurrencyPipe, PageHeader],
  templateUrl: './reservation-form.html',
})
export class ReservationForm implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly passagerService = inject(PassagerService);
  private readonly volService = inject(VolService);
  private readonly reservationService = inject(ReservationService);
  private readonly toast = inject(ToastService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  protected readonly passagers = signal<Passager[]>([]);
  protected readonly vols = signal<Vol[]>([]);
  protected readonly saving = signal(false);

  protected readonly classes: ClasseVoyage[] = ['ECONOMIQUE', 'AFFAIRES'];
  protected readonly classeLabels = CLASSE_LABELS;
  protected readonly prix = CLASSE_PRIX_INDICATIF;

  protected readonly form = this.fb.group({
    passagerId: this.fb.control<number | null>(null, Validators.required),
    volId: this.fb.control<number | null>(null, Validators.required),
    classe: this.fb.nonNullable.control<ClasseVoyage>('ECONOMIQUE', Validators.required),
  });

  /** The form values as signals, so "computed" can react to them. */
  private readonly volId = toSignal(this.form.controls.volId.valueChanges, { initialValue: null });
  private readonly classe = toSignal(this.form.controls.classe.valueChanges, { initialValue: 'ECONOMIQUE' as ClasseVoyage });

  /** The selected flight, recomputed automatically when the select changes. */
  protected readonly volChoisi = computed(() => this.vols().find((v) => v.id === Number(this.volId())) ?? null);
  protected readonly prixIndicatif = computed(() => this.prix[this.classe()]);

  ngOnInit(): void {
    this.passagerService.getAll().subscribe((p) => this.passagers.set(p));
    // Only flights still open for booking are proposed.
    this.volService.getUpcoming().subscribe((vols) =>
      this.vols.set(vols.filter((v) => v.statut === 'PROGRAMME' || v.statut === 'RETARDE')),
    );

    // "Réserver" button of the passenger list: /passengers/reservations/nouvelle?passagerId=3
    const passagerId = this.route.snapshot.queryParamMap.get('passagerId');
    if (passagerId) {
      this.form.controls.passagerId.setValue(Number(passagerId));
    }
  }

  protected submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const { passagerId, volId, classe } = this.form.getRawValue();
    this.saving.set(true);
    this.reservationService.create({ passagerId: passagerId!, volId: volId!, classe }).subscribe({
      next: (reservation) => {
        this.toast.success(`Réservation ${reservation.reference} créée — en attente de paiement`);
        this.router.navigate(['/passengers/reservations', reservation.id]);
      },
      error: () => this.saving.set(false),
    });
  }
}
