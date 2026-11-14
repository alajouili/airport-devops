import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { API_BASE_URL } from '../../../../core/config/api.config';
import { Siege } from '../../models/reservation.model';
import { SeatMap } from './seat-map';

describe('SeatMap', () => {
  const sieges: Siege[] = [
    { id: 1, numero: '1A', classe: 'AFFAIRES', occupe: false },
    { id: 2, numero: '1B', classe: 'AFFAIRES', occupe: false },
    { id: 3, numero: '2A', classe: 'ECONOMIQUE', occupe: true },
    { id: 4, numero: '2B', classe: 'ECONOMIQUE', occupe: false },
  ];

  async function setup() {
    TestBed.configureTestingModule({
      imports: [SeatMap],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    const fixture = TestBed.createComponent(SeatMap);
    // Inputs are set like the parent would do in its HTML.
    fixture.componentRef.setInput('volId', 7);
    fixture.componentRef.setInput('classe', 'ECONOMIQUE');
    fixture.detectChanges();
    TestBed.inject(HttpTestingController).expectOne(`${API_BASE_URL}/vols/7/sieges`).flush(sieges);
    await fixture.whenStable();
    fixture.detectChanges();
    return fixture;
  }

  it('groups seats by row and only enables free seats of the booked class', async () => {
    const fixture = await setup();
    const page = fixture.nativeElement as HTMLElement;

    expect(page.querySelectorAll('.row').length).toBe(2);
    const buttons = Array.from(page.querySelectorAll<HTMLButtonElement>('button.seat'));
    const enabled = buttons.filter((b) => !b.disabled).map((b) => b.title);
    expect(enabled).toEqual(['2B']); // 1A/1B other class, 2A occupied
  });

  it('emits the id of the clicked seat', async () => {
    const fixture = await setup();
    let chosen: number | undefined;
    fixture.componentInstance.siegeChoisi.subscribe((id) => (chosen = id));

    (fixture.nativeElement as HTMLElement).querySelector<HTMLButtonElement>('button[title="2B"]')!.click();

    expect(chosen).toBe(4);
  });
});
