import { CurrencyPipe, DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

import { ToastService } from '../../../../core/services/toast.service';
import { Icon } from '../../../../shared/components/icon/icon';
import { PageHeader } from '../../../../shared/components/page-header/page-header';
import { StarsPipe } from '../../../../shared/pipes/stars.pipe';
import {
  STATUT_ASSISTANCE_BADGES,
  STATUT_ASSISTANCE_LABELS,
  TYPE_ASSISTANCE_LABELS,
  TypeAssistance,
} from '../../models/assistance.model';
import { STATUT_BAGAGE_BADGES, STATUT_BAGAGE_LABELS } from '../../models/bagage.model';
import { EspacePassager } from '../../models/espace.model';
import {
  CATEGORIE_RECLAMATION_LABELS,
  CategorieReclamation,
  STATUT_RECLAMATION_BADGES,
  STATUT_RECLAMATION_LABELS,
} from '../../models/reclamation.model';
import { CLASSE_LABELS, STATUT_RESERVATION_BADGES, STATUT_RESERVATION_LABELS } from '../../models/reservation.model';
import { AssistanceService } from '../../services/assistance.service';
import { AvisService } from '../../services/avis.service';
import { EspacePassagerService } from '../../services/espace-passager.service';
import { ReclamationService } from '../../services/reclamation.service';

/**
 * Personal space of the passenger ("manage my booking").
 * The passenger enters the reservation reference and their email; the server
 * returns the trip only if both match. From here the passenger can follow
 * the trip and the bags, request assistance, give a review and file a complaint.
 */
@Component({
  selector: 'app-espace-passager',
  imports: [ReactiveFormsModule, FormsModule, DatePipe, CurrencyPipe, StarsPipe, PageHeader, Icon],
  templateUrl: './espace-passager.html',
  styleUrl: './espace-passager.css',
})
export class EspacePassagerPage {
  private readonly fb = inject(FormBuilder);
  private readonly espaceService = inject(EspacePassagerService);
  private readonly assistanceService = inject(AssistanceService);
  private readonly avisService = inject(AvisService);
  private readonly reclamationService = inject(ReclamationService);
  private readonly toast = inject(ToastService);

  protected readonly espace = signal<EspacePassager | null>(null);
  protected readonly erreur = signal<string | null>(null);
  protected readonly busy = signal(false);

  protected readonly loginForm = this.fb.nonNullable.group({
    reference: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]],
    email: ['', [Validators.required, Validators.email]],
  });

  // Small forms of the space (template-driven with ngModel)
  protected typeAssistance: TypeAssistance = 'FAUTEUIL_ROULANT';
  protected descriptionAssistance = '';
  protected note = 5;
  protected commentaireAvis = '';
  protected categorie: CategorieReclamation = 'SERVICE';
  protected bagageId: number | null = null;
  protected sujet = '';
  protected description = '';

  protected readonly statutLabels = STATUT_RESERVATION_LABELS;
  protected readonly statutBadges = STATUT_RESERVATION_BADGES;
  protected readonly classeLabels = CLASSE_LABELS;
  protected readonly bagageLabels = STATUT_BAGAGE_LABELS;
  protected readonly bagageBadges = STATUT_BAGAGE_BADGES;
  protected readonly assistanceLabels = TYPE_ASSISTANCE_LABELS;
  protected readonly typesAssistance = Object.keys(TYPE_ASSISTANCE_LABELS) as TypeAssistance[];
  protected readonly statutAssistanceLabels = STATUT_ASSISTANCE_LABELS;
  protected readonly statutAssistanceBadges = STATUT_ASSISTANCE_BADGES;
  protected readonly categorieLabels = CATEGORIE_RECLAMATION_LABELS;
  protected readonly categories = Object.keys(CATEGORIE_RECLAMATION_LABELS) as CategorieReclamation[];
  protected readonly statutReclamationLabels = STATUT_RECLAMATION_LABELS;
  protected readonly statutReclamationBadges = STATUT_RECLAMATION_BADGES;

  /** The steps of the journey, each "done" or not, read from the real reservation data. */
  protected readonly etapes = computed(() => {
    const voyage = this.espace()?.voyage;
    if (!voyage) {
      return [];
    }
    const billet = voyage.billet;
    return [
      { label: 'Paiement', done: voyage.reservation.statut === 'CONFIRMEE' || !!billet },
      { label: 'Billet émis', done: !!billet },
      { label: 'Siège', done: !!billet?.siegeNumero },
      { label: 'Enregistrement', done: !!billet?.enregistrementId },
      { label: 'Embarquement', done: billet?.statut === 'UTILISE' },
    ];
  });

  /** The review form appears only after boarding and if no review exists yet. */
  protected readonly peutDonnerAvis = computed(() => {
    const voyage = this.espace()?.voyage;
    return !!voyage && voyage.billet?.statut === 'UTILISE' && !voyage.avis;
  });

  protected readonly peutDemanderAssistance = computed(() => {
    const voyage = this.espace()?.voyage;
    return !!voyage && voyage.reservation.statut !== 'ANNULEE' && voyage.billet?.statut !== 'UTILISE';
  });

  protected rechercher(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }
    const { reference, email } = this.loginForm.getRawValue();
    this.busy.set(true);
    this.erreur.set(null);
    this.espaceService.rechercher(reference.toUpperCase(), email).subscribe({
      next: (espace) => {
        this.espace.set(espace);
        this.busy.set(false);
      },
      error: (error: HttpErrorResponse) => {
        this.erreur.set(error.status === 404
          ? 'Aucune réservation ne correspond à cette référence et à cet email.'
          : 'Service momentanément indisponible.');
        this.busy.set(false);
      },
    });
  }

  protected deconnecter(): void {
    this.espace.set(null);
    this.loginForm.reset();
  }

  protected demanderAssistance(): void {
    const voyage = this.espace()!.voyage;
    this.busy.set(true);
    this.assistanceService
      .create({ reservationId: voyage.reservation.id, typeAssistance: this.typeAssistance, description: this.descriptionAssistance })
      .subscribe({
        next: () => {
          this.toast.success("Demande d'assistance envoyée");
          this.descriptionAssistance = '';
          this.rafraichir();
        },
        error: () => this.busy.set(false),
      });
  }

  protected donnerAvis(): void {
    const voyage = this.espace()!.voyage;
    this.busy.set(true);
    this.avisService.create({ reservationId: voyage.reservation.id, note: this.note, commentaire: this.commentaireAvis }).subscribe({
      next: () => {
        this.toast.success('Merci pour votre avis !');
        this.rafraichir();
      },
      error: () => this.busy.set(false),
    });
  }

  protected envoyerReclamation(): void {
    const voyage = this.espace()!.voyage;
    if (!this.sujet.trim() || !this.description.trim()) {
      this.toast.error('Le sujet et la description sont obligatoires');
      return;
    }
    this.busy.set(true);
    this.reclamationService
      .create({
        passagerId: voyage.reservation.passagerId,
        reservationId: voyage.reservation.id,
        bagageId: this.categorie === 'BAGAGE' ? this.bagageId : null,
        categorie: this.categorie,
        sujet: this.sujet,
        description: this.description,
      })
      .subscribe({
        next: (reclamation) => {
          this.toast.success(`Réclamation ${reclamation.reference} enregistrée`);
          this.sujet = '';
          this.description = '';
          this.rafraichir();
        },
        error: () => this.busy.set(false),
      });
  }

  /** Reloads the space with the same reference and email. */
  private rafraichir(): void {
    const { reference, email } = this.loginForm.getRawValue();
    this.espaceService.rechercher(reference.toUpperCase(), email).subscribe({
      next: (espace) => {
        this.espace.set(espace);
        this.busy.set(false);
      },
      error: () => this.busy.set(false),
    });
  }
}
