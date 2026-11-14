import { registerLocaleData } from '@angular/common';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import localeFr from '@angular/common/locales/fr';
import { LOCALE_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { API_BASE_URL } from '../../../../core/config/api.config';
import { PassagerEmbarquement } from '../../models/embarquement.model';
import { EmbarquementPage } from './embarquement';

registerLocaleData(localeFr);

describe('EmbarquementPage', () => {
  const nonControle: PassagerEmbarquement = {
    billetId: 3,
    numeroBillet: 'TKT0000000003',
    statutBillet: 'EMIS',
    reservationId: 5,
    reservationReference: 'K7QZ2M',
    passagerNom: 'Leila Mansouri',
    classe: 'ECONOMIQUE',
    siegeNumero: '12A',
    dernierControle: null,
    dernierEvenement: null,
    peutEmbarquer: false,
  };

  it('disables "Embarquer" until the server says the passenger can board', async () => {
    TestBed.configureTestingModule({
      imports: [EmbarquementPage],
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([]), { provide: LOCALE_ID, useValue: 'fr-FR' }],
    });
    const http = TestBed.inject(HttpTestingController);
    const fixture = TestBed.createComponent(EmbarquementPage);
    fixture.detectChanges();
    http.expectOne(`${API_BASE_URL}/vols`).flush([]);
    http.expectOne(`${API_BASE_URL}/points-controle`).flush([]);

    // Simulate the choice of flight 1, then select the passenger.
    const component = fixture.componentInstance as unknown as { volId: number; chargerVol: () => void };
    component.volId = 1;
    component.chargerVol();
    http.expectOne(`${API_BASE_URL}/vols/1/embarquement`).flush([nonControle]);
    await fixture.whenStable();
    fixture.detectChanges();

    const page = fixture.nativeElement as HTMLElement;
    page.querySelector<HTMLTableRowElement>('tbody tr')!.click();
    fixture.detectChanges();

    const embarquer = Array.from(page.querySelectorAll('button')).find((b) => b.textContent?.trim() === 'Embarquer')!;
    expect(embarquer.disabled).toBe(true);
    expect(page.textContent).toContain('Non contrôlé');
  });
});
