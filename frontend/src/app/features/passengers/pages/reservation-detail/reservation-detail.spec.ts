import { registerLocaleData } from '@angular/common';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import localeFr from '@angular/common/locales/fr';
import { LOCALE_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { API_BASE_URL } from '../../../../core/config/api.config';
import { ReservationDetail } from '../../models/reservation.model';
import { ReservationDetailPage } from './reservation-detail';

registerLocaleData(localeFr);

describe('ReservationDetailPage', () => {
  const detailEnAttente: ReservationDetail = {
    reservation: {
      id: 5,
      reference: 'K7QZ2M',
      passagerId: 1,
      passagerNom: 'Youssef Ben Ali',
      volId: 1,
      numeroVol: 'TU712',
      compagnieNom: 'Tunisair',
      aeroportDepart: 'Tunis-Carthage',
      aeroportArrivee: 'Paris-Orly',
      dateHeureDepart: '2026-10-30T08:30:00',
      classe: 'ECONOMIQUE',
      montant: 350,
      statut: 'EN_ATTENTE_PAIEMENT',
      dateReservation: '2026-10-29T10:00:00',
      dateAnnulation: null,
    },
    paiements: [],
    billet: null,
    bagages: [],
    assistances: [],
    avis: null,
  };

  it('sends the simulated payment and reloads the reservation', async () => {
    TestBed.configureTestingModule({
      imports: [ReservationDetailPage],
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([]), { provide: LOCALE_ID, useValue: 'fr-FR' }],
    });
    const http = TestBed.inject(HttpTestingController);
    const fixture = TestBed.createComponent(ReservationDetailPage);
    fixture.componentRef.setInput('id', '5');
    fixture.detectChanges();

    http.expectOne(`${API_BASE_URL}/reservations/5`).flush(detailEnAttente);
    await fixture.whenStable();
    fixture.detectChanges();

    const page = fixture.nativeElement as HTMLElement;
    expect(page.textContent).toContain('Réservation K7QZ2M');
    const payButton = Array.from(page.querySelectorAll('button')).find((b) => b.textContent?.includes('Payer'))!;
    payButton.click();

    const payment = http.expectOne(`${API_BASE_URL}/reservations/5/paiements`);
    expect(payment.request.method).toBe('POST');
    // No amount and no card data are sent: the server computes the amount.
    expect(payment.request.body).toEqual({ mode: 'CARTE', simulerRefus: false });
    payment.flush({ id: 1, montant: 350, mode: 'CARTE', statut: 'ACCEPTE', referenceTransaction: 'TRX-1', datePaiement: '' });

    // After the payment, the page asks the server for the up-to-date reservation.
    http.expectOne(`${API_BASE_URL}/reservations/5`);
    http.verify();
  });
});
