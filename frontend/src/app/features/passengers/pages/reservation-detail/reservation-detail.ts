import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, OnInit, inject, input, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Observable } from 'rxjs';

import { ToastService } from '../../../../core/services/toast.service';
import { PageHeader } from '../../../../shared/components/page-header/page-header';
import { StarsPipe } from '../../../../shared/pipes/stars.pipe';
import { SeatMap } from '../../components/seat-map/seat-map';
import {
  STATUT_ASSISTANCE_BADGES,
  STATUT_ASSISTANCE_LABELS,
  TYPE_ASSISTANCE_LABELS,
  TypeAssistance,
} from '../../models/assistance.model';
import { STATUT_BAGAGE_BADGES, STATUT_BAGAGE_LABELS, TYPE_BAGAGE_LABELS, TypeBagage } from '../../models/bagage.model';
import {
  CANAL_LABELS,
  CLASSE_LABELS,
  CanalEnregistrement,
  MODE_PAIEMENT_LABELS,
  ModePaiement,
  ReservationDetail,
  STATUT_BILLET_LABELS,
  STATUT_RESERVATION_BADGES,
  STATUT_RESERVATION_LABELS,
} from '../../models/reservation.model';
import { AssistanceService } from '../../services/assistance.service';
import { AvisService } from '../../services/avis.service';
import { BagageService } from '../../services/bagage.service';
import { BilletService } from '../../services/billet.service';
import { ReservationService } from '../../services/reservation.service';

/**
 * The reservation page drives the whole journey, step by step:
 *   1. pay (simulated)  ->  2. ticket issued  ->  3. choose a seat
 *   ->  4. check in  ->  5. register bags.
 * It also shows assistance requests, the review (after boarding) and a complaint link.
 * After every action the page reloads the detail from the server,
 * so what is displayed is always what is in the database.
 */
@Component({
  selector: 'app-reservation-detail',
  imports: [FormsModule, RouterLink, DatePipe, CurrencyPipe, StarsPipe, PageHeader, SeatMap],
  templateUrl: './reservation-detail.html',
  styleUrl: './reservation-detail.css',
})
export class ReservationDetailPage implements OnInit {
  private readonly reservationService = inject(ReservationService);
  private readonly billetService = inject(BilletService);
  private readonly bagageService = inject(BagageService);
  private readonly assistanceService = inject(AssistanceService);
  private readonly avisService = inject(AvisService);
  private readonly toast = inject(ToastService);

  /** Route parameter ":id". */
  readonly id = input.required<string>();

  protected readonly detail = signal<ReservationDetail | null>(null);
  protected readonly busy = signal(false);
  protected readonly showSeatMap = signal(false);

  // Form fields (template-driven forms with ngModel: simple one-line forms)
  protected modePaiement: ModePaiement = 'CARTE';
  protected simulerRefus = false;
  protected canal: CanalEnregistrement = 'COMPTOIR';
  protected typeBagage: TypeBagage = 'SOUTE';
  protected poidsKg: number | null = null;
  protected typeAssistance: TypeAssistance = 'FAUTEUIL_ROULANT';
  protected descriptionAssistance = '';
  protected note = 5;
  protected commentaireAvis = '';

  // Labels for the template
  protected readonly statutLabels = STATUT_RESERVATION_LABELS;
  protected readonly statutBadges = STATUT_RESERVATION_BADGES;
  protected readonly classeLabels = CLASSE_LABELS;
  protected readonly modeLabels = MODE_PAIEMENT_LABELS;
  protected readonly modes = Object.keys(MODE_PAIEMENT_LABELS) as ModePaiement[];
  protected readonly billetLabels = STATUT_BILLET_LABELS;
  protected readonly canalLabels = CANAL_LABELS;
  protected readonly canaux = Object.keys(CANAL_LABELS) as CanalEnregistrement[];
  protected readonly typeBagageLabels = TYPE_BAGAGE_LABELS;
  protected readonly typesBagage = Object.keys(TYPE_BAGAGE_LABELS) as TypeBagage[];
  protected readonly statutBagageLabels = STATUT_BAGAGE_LABELS;
  protected readonly statutBagageBadges = STATUT_BAGAGE_BADGES;
  protected readonly assistanceLabels = TYPE_ASSISTANCE_LABELS;
  protected readonly typesAssistance = Object.keys(TYPE_ASSISTANCE_LABELS) as TypeAssistance[];
  protected readonly statutAssistanceLabels = STATUT_ASSISTANCE_LABELS;
  protected readonly statutAssistanceBadges = STATUT_ASSISTANCE_BADGES;

  ngOnInit(): void {
    this.reload();
  }

  protected reload(): void {
    this.reservationService.getDetail(Number(this.id())).subscribe((detail) => this.detail.set(detail));
  }

  /** Cancel is possible until the passenger has checked in. */
  protected canCancel(d: ReservationDetail): boolean {
    return d.reservation.statut !== 'ANNULEE' && !d.billet?.enregistrementId;
  }

  protected payer(): void {
    this.run(
      this.reservationService.payer(Number(this.id()), { mode: this.modePaiement, simulerRefus: this.simulerRefus }),
      (paiement) =>
        paiement.statut === 'ACCEPTE'
          ? this.toast.success('Paiement accepté : billet émis')
          : this.toast.error('Paiement refusé (simulation). La réservation reste en attente.'),
    );
  }

  protected annuler(): void {
    if (!confirm('Annuler cette réservation ? Le billet sera annulé et le siège libéré.')) {
      return;
    }
    this.run(this.reservationService.annuler(Number(this.id())), () => this.toast.info('Réservation annulée'));
  }

  protected choisirSiege(billetId: number, siegeId: number): void {
    this.run(this.billetService.choisirSiege(billetId, siegeId), (billet) => {
      this.toast.success(`Siège ${billet.siegeNumero} attribué`);
      this.showSeatMap.set(false);
    });
  }

  protected enregistrer(billetId: number): void {
    this.run(this.billetService.enregistrer(billetId, this.canal), (billet) =>
      this.toast.success(`Passager enregistré — siège ${billet.siegeNumero}`),
    );
  }

  protected ajouterBagage(enregistrementId: number): void {
    if (!this.poidsKg || this.poidsKg <= 0) {
      this.toast.error('Indiquez le poids du bagage');
      return;
    }
    this.run(this.bagageService.ajouter(enregistrementId, { type: this.typeBagage, poidsKg: this.poidsKg }), (bagage) => {
      this.toast.success(`Bagage enregistré — étiquette ${bagage.numeroEtiquette}`);
      this.poidsKg = null;
    });
  }

  protected demanderAssistance(): void {
    this.run(
      this.assistanceService.create({
        reservationId: Number(this.id()),
        typeAssistance: this.typeAssistance,
        description: this.descriptionAssistance,
      }),
      () => {
        this.toast.success("Demande d'assistance enregistrée");
        this.descriptionAssistance = '';
      },
    );
  }

  protected donnerAvis(): void {
    this.run(
      this.avisService.create({ reservationId: Number(this.id()), note: this.note, commentaire: this.commentaireAvis }),
      () => this.toast.success('Avis enregistré'),
    );
  }

  /**
   * Runs an API call: disables the buttons while it runs, calls onSuccess,
   * then reloads the page data. Errors are already displayed by errorInterceptor.
   */
  private run<T>(call: Observable<T>, onSuccess: (result: T) => void): void {
    this.busy.set(true);
    call.subscribe({
      next: (result) => {
        onSuccess(result);
        this.busy.set(false);
        this.reload();
      },
      error: () => this.busy.set(false),
    });
  }
}
