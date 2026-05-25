import { Component, inject, ChangeDetectionStrategy } from '@angular/core';


import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { SupplierService } from '../../../../core/services/supplier.service';
import { Supplier } from '../../../../core/models/supplier.model';

@Component({
  selector: 'app-supplier-dialog',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule],
  templateUrl: './supplier-dialog.component.html',
  styleUrl: './supplier-dialog.component.css'
})
export class SupplierDialogComponent {
  private readonly fb = inject(FormBuilder);
  private readonly dialogRef = inject(MatDialogRef<SupplierDialogComponent>);
  private readonly supplierService = inject(SupplierService);

  readonly data: Supplier | null = inject(MAT_DIALOG_DATA);
  readonly isEditMode = !!this.data;

  readonly form = this.fb.group({
    name:        [this.data?.name        ?? '', [Validators.required, Validators.maxLength(150)]],
    contactName: [this.data?.contactName ?? '',  Validators.maxLength(100)],
    email:       [this.data?.email       ?? '', [Validators.email, Validators.maxLength(100)]],
    phone:       [this.data?.phone       ?? '',  Validators.maxLength(20)],
    address:     [this.data?.address     ?? '',  Validators.maxLength(255)]
  });

  getError(field: string): string {
    const ctrl = this.form.get(field)!;
    if (ctrl.hasError('required')) return 'Este campo es obligatorio';
    if (ctrl.hasError('email')) return 'El email no tiene formato válido';
    if (ctrl.hasError('maxlength')) return `Máximo ${ctrl.errors?.['maxlength'].requiredLength} caracteres`;
    return '';
  }

  onSubmit(): void {
    if (this.form.invalid) return;

    const request = {
      name:        this.form.value.name!,
      contactName: this.form.value.contactName ?? '',
      email:       this.form.value.email ?? '',
      phone:       this.form.value.phone ?? '',
      address:     this.form.value.address ?? ''
    };

    const operation$ = this.isEditMode
      ? this.supplierService.update(this.data!.id, request)
      : this.supplierService.create(request);

    operation$.subscribe({
      next: (result) => this.dialogRef.close(result),
      error: (err) => console.error('Error guardando proveedor', err)
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
