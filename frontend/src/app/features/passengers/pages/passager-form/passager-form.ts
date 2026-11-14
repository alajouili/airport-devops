import { Component, OnInit, inject, input, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { ToastService } from '../../../../core/services/toast.service';
import { PageHeader } from '../../../../shared/components/page-header/page-header';
import { PassagerRequest } from '../../models/passager.model';
import { PassagerService } from '../../services/passager.service';

/**
 * One form for both "create" and "edit".
 * If the URL contains an id (/passengers/3/modifier), the page is in edit mode.
 */
@Component({
  selector: 'app-passager-form',
  imports: [ReactiveFormsModule, RouterLink, PageHeader],
  templateUrl: './passager-form.html',
})
export class PassagerForm implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly passagerService = inject(PassagerService);
  private readonly toast = inject(ToastService);
  private readonly router = inject(Router);

  /** Filled automatically from the route parameter ":id" (undefined in create mode). */
  readonly id = input<string>();

  protected readonly saving = signal(false);

  /**
   * Reactive form: the structure and the validators are written in TypeScript.
   * The same rules exist on the server (PassagerRequest.java): the browser checks
   * them for a quick message, the server checks them because the browser can be bypassed.
   */
  protected readonly form = this.fb.nonNullable.group({
    nom: ['', [Validators.required, Validators.maxLength(80)]],
    prenom: ['', [Validators.required, Validators.maxLength(80)]],
    email: ['', [Validators.required, Validators.email, Validators.maxLength(150)]],
    telephone: ['', [Validators.pattern(/^[+0-9 ]{8,20}$/)]],
    dateNaissance: [''],
    nationalite: ['', [Validators.maxLength(60)]],
    numeroPasseport: ['', [Validators.pattern(/^[A-Za-z0-9]{6,20}$/)]],
  });

  protected get isEdit(): boolean {
    return !!this.id();
  }

  ngOnInit(): void {
    const id = this.id();
    if (id) {
      this.passagerService.getById(Number(id)).subscribe((p) => {
        this.form.patchValue({
          nom: p.nom,
          prenom: p.prenom,
          email: p.email,
          telephone: p.telephone ?? '',
          dateNaissance: p.dateNaissance ?? '',
          nationalite: p.nationalite ?? '',
          numeroPasseport: p.numeroPasseport ?? '',
        });
      });
    }
  }

  /** true when a field is invalid AND the user has already touched it. */
  protected showError(field: keyof typeof this.form.controls): boolean {
    const control = this.form.controls[field];
    return control.invalid && (control.touched || control.dirty);
  }

  protected submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched(); // shows every error message
      return;
    }

    const value = this.form.getRawValue();
    const request: PassagerRequest = {
      ...value,
      numeroPasseport: value.numeroPasseport.toUpperCase(),
      dateNaissance: value.dateNaissance || null,
    };

    this.saving.set(true);
    const call = this.isEdit
      ? this.passagerService.update(Number(this.id()), request)
      : this.passagerService.create(request);

    call.subscribe({
      next: () => {
        this.toast.success(this.isEdit ? 'Passager modifié' : 'Passager créé');
        this.router.navigate(['/passengers']);
      },
      // The error toast comes from errorInterceptor; we only re-enable the button.
      error: () => this.saving.set(false),
    });
  }
}
