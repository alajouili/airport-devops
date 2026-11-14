import { registerLocaleData } from '@angular/common';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import localeFr from '@angular/common/locales/fr';
import { LOCALE_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { API_BASE_URL } from '../../../../core/config/api.config';
import { EspacePassagerPage } from './espace-passager';

registerLocaleData(localeFr);

describe('EspacePassagerPage', () => {
  function setup() {
    TestBed.configureTestingModule({
      imports: [EspacePassagerPage],
      providers: [provideHttpClient(), provideHttpClientTesting(), { provide: LOCALE_ID, useValue: 'fr-FR' }],
    });
    const fixture = TestBed.createComponent(EspacePassagerPage);
    fixture.detectChanges();
    return { fixture, http: TestBed.inject(HttpTestingController), page: fixture.nativeElement as HTMLElement };
  }

  function fill(page: HTMLElement, id: string, value: string) {
    const input = page.querySelector<HTMLInputElement>(`#${id}`)!;
    input.value = value;
    input.dispatchEvent(new Event('input'));
  }

  it('sends reference and email in the body of a POST (not in the URL)', () => {
    const { fixture, http, page } = setup();
    fill(page, 'reference', 'k7qz2m');
    fill(page, 'email', 'youssef.benali@mail.tn');
    page.querySelector<HTMLFormElement>('form')!.dispatchEvent(new Event('submit'));
    fixture.detectChanges();

    const request = http.expectOne(`${API_BASE_URL}/espace-passager/recherche`);
    expect(request.request.method).toBe('POST');
    expect(request.request.urlWithParams).not.toContain('mail');
    expect(request.request.body).toEqual({ reference: 'K7QZ2M', email: 'youssef.benali@mail.tn' });
  });

  it('shows a neutral message when nothing matches', async () => {
    const { fixture, http, page } = setup();
    fill(page, 'reference', 'AAAAAA');
    fill(page, 'email', 'x@y.tn');
    page.querySelector<HTMLFormElement>('form')!.dispatchEvent(new Event('submit'));

    http.expectOne(`${API_BASE_URL}/espace-passager/recherche`).flush({ message: 'x' }, { status: 404, statusText: 'Not Found' });
    await fixture.whenStable();
    fixture.detectChanges();

    expect(page.textContent).toContain('Aucune réservation ne correspond');
  });
});
