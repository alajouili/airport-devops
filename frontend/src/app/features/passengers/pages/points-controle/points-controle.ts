import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { ToastService } from '../../../../core/services/toast.service';
import { PageHeader } from '../../../../shared/components/page-header/page-header';
import { PointControle, TYPE_POINT_LABELS, TypePointControle } from '../../models/embarquement.model';
import { EmbarquementService } from '../../services/embarquement.service';

/** Security checkpoints: list, create, edit, activate/deactivate, delete if unused. */
@Component({
  selector: 'app-points-controle',
  imports: [ReactiveFormsModule, PageHeader],
  templateUrl: './points-controle.html',
})
export class PointsControle implements OnInit {
  private readonly embarquementService = inject(EmbarquementService);
  private readonly toast = inject(ToastService);
  private readonly fb = inject(FormBuilder);

  protected readonly points = signal<PointControle[]>([]);
  /** null = creating a new point; a number = editing that point. */
  protected readonly editionId = signal<number | null>(null);
  protected readonly saving = signal(false);

  protected readonly typeLabels = TYPE_POINT_LABELS;
  protected readonly types = Object.keys(TYPE_POINT_LABELS) as TypePointControle[];

  protected readonly form = this.fb.nonNullable.group({
    code: ['', [Validators.required, Validators.pattern(/^[A-Za-z0-9-]{3,10}$/)]],
    nom: ['', [Validators.required, Validators.maxLength(100)]],
    terminal: ['', [Validators.required, Validators.maxLength(20)]],
    type: this.fb.nonNullable.control<TypePointControle>('STANDARD'),
    actif: [true],
  });

  ngOnInit(): void {
    this.load();
  }

  protected modifier(point: PointControle): void {
    this.editionId.set(point.id);
    this.form.setValue({ code: point.code, nom: point.nom, terminal: point.terminal, type: point.type, actif: point.actif });
  }

  protected annulerEdition(): void {
    this.editionId.set(null);
    this.form.reset();
  }

  protected basculer(point: PointControle): void {
    this.embarquementService.updatePoint(point.id, { ...point, actif: !point.actif }).subscribe(() => {
      this.toast.success(point.actif ? 'Point désactivé' : 'Point activé');
      this.load();
    });
  }

  protected supprimer(point: PointControle): void {
    if (!confirm(`Supprimer le point ${point.code} ?`)) {
      return;
    }
    this.embarquementService.deletePoint(point.id).subscribe(() => {
      this.toast.success('Point supprimé');
      this.load();
    });
  }

  protected submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const id = this.editionId();
    const request = this.form.getRawValue();
    this.saving.set(true);
    const call = id ? this.embarquementService.updatePoint(id, request) : this.embarquementService.createPoint(request);
    call.subscribe({
      next: () => {
        this.toast.success(id ? 'Point modifié' : 'Point créé');
        this.annulerEdition();
        this.saving.set(false);
        this.load();
      },
      error: () => this.saving.set(false),
    });
  }

  private load(): void {
    this.embarquementService.getPoints().subscribe((p) => this.points.set(p));
  }
}
