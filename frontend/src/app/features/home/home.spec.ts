import { registerLocaleData } from '@angular/common';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import localeFr from '@angular/common/locales/fr';
import { LOCALE_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { API_BASE_URL } from '../../core/config/api.config';
import { errorInterceptor } from '../../core/interceptors/error.interceptor';
import { Vol } from '../../core/models/vol.model';
import { ToastService } from '../../core/services/toast.service';
import { Home } from './home';

registerLocaleData(localeFr);

/**
 * HttpTestingController replaces the real backend: the test decides
 * what each request "receives", then checks what the page displays.
 */
describe('Home', () => {
  let http: HttpTestingController;

  const vol: Vol = {
    id: 1,
    numeroVol: 'TU712',
    compagnieCode: 'TU',
    compagnieNom: 'Tunisair',
    aeroportDepart: 'Tunis-Carthage',
    aeroportArrivee: 'Paris-Orly',
    dateHeureDepart: '2026-10-30T08:30:00',
    dateHeureArrivee: '2026-10-30T10:55:00',
    capacite: 180,
    statut: 'PROGRAMME',
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [Home],
      providers: [
        provideHttpClient(withInterceptors([errorInterceptor])),
        provideHttpClientTesting(),
        provideRouter([]),
        { provide: LOCALE_ID, useValue: 'fr-FR' },
      ],
    });
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  /** Answers the 4 counter requests (filters are sent as query parameters). */
  function flushCounters(sizes: number[]) {
    const urls = [
      `${API_BASE_URL}/reservations?statut=EN_ATTENTE_PAIEMENT`,
      `${API_BASE_URL}/assistances?statut=DEMANDEE`,
      `${API_BASE_URL}/reclamations?statut=OUVERTE`,
      `${API_BASE_URL}/objets-trouves?statut=EN_STOCK`,
    ];
    urls.forEach((url, i) => http.expectOne(url).flush(new Array(sizes[i]).fill({})));
  }

  it('shows the real counters and the next departures', async () => {
    const fixture = TestBed.createComponent(Home);
    fixture.detectChanges();

    http.expectOne(`${API_BASE_URL}/vols`).flush([vol]);
    flushCounters([2, 1, 3, 4]);
    await fixture.whenStable();
    fixture.detectChanges();

    const page = fixture.nativeElement as HTMLElement;
    const values = Array.from(page.querySelectorAll('.counter-value')).map((e) => e.textContent?.trim());
    expect(values).toEqual(['2', '1', '3', '4']);
    expect(page.querySelector('app-departures-board')?.textContent).toContain('TU712');
    expect(page.querySelector('app-departures-board')?.textContent).toContain('Programmé');
  });

  it('shows the backend help and only one toast when the server is down', async () => {
    const toast = TestBed.inject(ToastService);
    const fixture = TestBed.createComponent(Home);
    fixture.detectChanges();

    // status 0 = network error: every request fails
    http.match(() => true).forEach((request) => request.error(new ProgressEvent('error'), { status: 0 }));
    await fixture.whenStable();
    fixture.detectChanges();

    const page = fixture.nativeElement as HTMLElement;
    expect(page.textContent).toContain('Le backend ne répond pas');
    expect(page.textContent).toContain('Impossible de charger les vols');
    expect(toast.toasts().length).toBe(1); // 5 identical errors, shown once
  });
});
