import { TestBed } from '@angular/core/testing';

import { ConfirmService } from '../../../core/services/confirm.service';
import { ConfirmDialog } from './confirm-dialog';

describe('ConfirmDialog', () => {
  // jsdom does not implement <dialog> methods: simple stand-ins are enough here.
  beforeAll(() => {
    HTMLDialogElement.prototype.showModal ??= function (this: HTMLDialogElement) { this.setAttribute('open', ''); };
    HTMLDialogElement.prototype.close ??= function (this: HTMLDialogElement) { this.removeAttribute('open'); };
  });

  async function setup() {
    TestBed.configureTestingModule({ imports: [ConfirmDialog] });
    const fixture = TestBed.createComponent(ConfirmDialog);
    fixture.detectChanges();
    return { fixture, service: TestBed.inject(ConfirmService), page: fixture.nativeElement as HTMLElement };
  }

  it('resolves true when the user confirms', async () => {
    const { fixture, service, page } = await setup();
    const answer = service.ask({ title: 'Supprimer ce passager ?', message: 'Action définitive.', confirmLabel: 'Supprimer', danger: true });
    fixture.detectChanges();

    expect(page.querySelector('h2')?.textContent).toContain('Supprimer ce passager ?');
    const buttons = page.querySelectorAll<HTMLButtonElement>('.actions button');
    expect(buttons[1].classList).toContain('btn-danger');
    buttons[1].click();

    await expect(answer).resolves.toBe(true);
  });

  it('resolves false with the safe button', async () => {
    const { fixture, service, page } = await setup();
    const answer = service.ask({ title: 'Annuler ?', message: 'm', confirmLabel: 'Annuler la réservation' });
    fixture.detectChanges();
    page.querySelectorAll<HTMLButtonElement>('.actions button')[0].click();

    await expect(answer).resolves.toBe(false);
  });
});
