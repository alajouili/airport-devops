import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { ToastService } from '../../../../core/services/toast.service';
import { PageHeader } from '../../../../shared/components/page-header/page-header';
import { Bagage } from '../../models/bagage.model';
import { Passager } from '../../models/passager.model';
import { CATEGORIE_RECLAMATION_LABELS, CategorieReclamation } from '../../models/reclamation.model';
import { Reservation } from '../../models/reservation.model';
import { PassagerService } from '../../services/passager.service';
import { ReclamationService } from '../../services/reclamation.service';
import { ReservationService } from '../../services/reservation.service';

/**
 * Complaint form used by the staff. It can be opened pre-filled from a bag
 * or a reservation: /passengers/reclamations/nouvelle?passagerId=1&reservationId=5&bagageId=2&categorie=BAGAGE
 * Choosing a passenger loads their reservations; choosing a reservation loads its bags.
 */
@Component({
  selector: 'app-reclamation-form',
  imports: [ReactiveFormsModule, RouterLink, PageHeader],
  templateUrl: './reclamation-form.html',
})
export class ReclamationForm implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly passagerService = inject(PassagerService);
  private readonly reservationService = inject(ReservationService);
  private readonly reclamationService = inject(ReclamationService);
  private readonly toast = inject(ToastService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  protected readonly passagers = signal<Passager[]>([]);
  protected readonly reservations = signal<Reservation[]>([]);
  protected readonly bagages = signal<Bagage[]>([]);
  protected readonly saving = signal(false);

  protected readonly categorieLabels = CATEGORIE_RECLAMATION_LABELS;
  protected readonly categories = Object.keys(CATEGORIE_RECLAMATION_LABELS) as CategorieReclamation[];

  protected readonly form = this.fb.group({
    passagerId: this.fb.control<number | null>(null, Validators.required),
    reservationId: this.fb.control<number | null>(null),
    bagageId: this.fb.control<number | null>(null),
    categorie: this.fb.nonNullable.control<CategorieReclamation>('SERVICE', Validators.required),
    sujet: this.fb.nonNullable.control('', [Validators.required, Validators.maxLength(150)]),
    description: this.fb.nonNullable.control('', [Validators.required, Validators.maxLength(2000)]),
  });

  ngOnInit(): void {
    this.passagerService.getAll().subscribe((p) => this.passagers.set(p));

    // When the passenger changes: reload their reservations and clear the dependent fields.
    this.form.controls.passagerId.valueChanges.subscribe((passagerId) => {
      this.form.patchValue({ reservationId: null, bagageId: null }, { emitEvent: false });
      this.bagages.set([]);
      this.chargerReservations(passagerId);
    });
    // When the reservation changes: reload its bags.
    this.form.controls.reservationId.valueChanges.subscribe((reservationId) => {
      this.form.controls.bagageId.setValue(null, { emitEvent: false });
      this.chargerBagages(reservationId);
    });

    // Pre-fill from the query parameters.
    const q = this.route.snapshot.queryParamMap;
    const passagerId = q.get('passagerId');
    if (passagerId) {
      this.form.controls.passagerId.setValue(Number(passagerId));
      const reservationId = q.get('reservationId');
      if (reservationId) {
        this.form.controls.reservationId.setValue(Number(reservationId));
      }
      const bagageId = q.get('bagageId');
      if (bagageId) {
        this.form.controls.bagageId.setValue(Number(bagageId));
      }
    }
    const categorie = q.get('categorie') as CategorieReclamation | null;
    if (categorie && this.categories.includes(categorie)) {
      this.form.controls.categorie.setValue(categorie);
    }
  }

  protected submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const value = this.form.getRawValue();
    this.saving.set(true);
    this.reclamationService
      .create({
        passagerId: value.passagerId!,
        reservationId: value.reservationId,
        bagageId: value.bagageId,
        categorie: value.categorie,
        sujet: value.sujet,
        description: value.description,
      })
      .subscribe({
        next: (r) => {
          this.toast.success(`Réclamation ${r.reference} créée`);
          this.router.navigate(['/passengers/reclamations', r.id]);
        },
        error: () => this.saving.set(false),
      });
  }

  private chargerReservations(passagerId: number | null): void {
    if (!passagerId) {
      this.reservations.set([]);
      return;
    }
    this.reservationService.getAll({ passagerId }).subscribe((list) => this.reservations.set(list));
  }

  private chargerBagages(reservationId: number | null): void {
    if (!reservationId) {
      this.bagages.set([]);
      return;
    }
    this.reservationService.getDetail(reservationId).subscribe((detail) => this.bagages.set(detail.bagages));
  }
}
