import { Component, inject, ChangeDetectionStrategy, input, output } from '@angular/core';

import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SupplierService } from '../../../../core/services/supplier.service';
import { Supplier } from '../../../../core/models/supplier.model';
import { NotificationService } from '../../../../core/services';

@Component({
  selector: 'app-supplier-dialog',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule],
  templateUrl: './supplier-dialog.component.html',
  styleUrl: './supplier-dialog.component.css',
})
export class SupplierDialogComponent {
  private readonly fb = inject(FormBuilder);
  private readonly supplierService = inject(SupplierService);
  private readonly notification = inject(NotificationService);

  readonly supplier = input<Supplier | null>(null);
  readonly saved = output<Supplier>();
  readonly closed = output<void>();

  get isEditMode(): boolean {
    return !!this.supplier();
  }

  readonly form = this.fb.group({
    name: ['', [Validators.required, Validators.maxLength(150)]],
    contactName: ['', Validators.maxLength(100)],
    email: ['', [Validators.email, Validators.maxLength(100)]],
    phone: ['', Validators.maxLength(20)],
    address: ['', Validators.maxLength(255)],
  });

  ngOnInit(): void {
    const s = this.supplier();
    if (s) {
      this.form.patchValue({
        name: s.name,
        contactName: s.contactName,
        email: s.email,
        phone: s.phone,
        address: s.address,
      });
    }
  }

  getError(field: string): string {
    const ctrl = this.form.get(field)!;
    if (ctrl.hasError('required')) return 'Este campo es obligatorio';
    if (ctrl.hasError('email')) return 'El email no tiene formato válido';
    if (ctrl.hasError('maxlength'))
      return `Máximo ${ctrl.errors?.['maxlength'].requiredLength} caracteres`;
    return '';
  }

  onSubmit(): void {
    if (this.form.invalid) return;

    const request = {
      name: this.form.value.name!,
      contactName: this.form.value.contactName ?? '',
      email: this.form.value.email ?? '',
      phone: this.form.value.phone ?? '',
      address: this.form.value.address ?? '',
    };

    const operation$ = this.isEditMode
      ? this.supplierService.update(this.supplier()!.id, request)
      : this.supplierService.create(request);

    operation$.subscribe({
      next: (result) => {
        this.notification.success(
          this.isEditMode
            ? 'Proveedor actualizado correctamente'
            : 'Proveedor creado correctamente',
        );
        this.saved.emit(result);
      },
      error: () => {},
    });
  }

  onCancel(): void {
    this.closed.emit();
  }
}
