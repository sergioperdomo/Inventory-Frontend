import { Component, inject, OnInit, signal } from '@angular/core';

import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import {
  MatDialogModule,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { Product } from '../../../../../core/models/product.model';
import { ProductService } from '../../../../../core/services/product.service';
import { CategoryService } from '../../../../../core/services/category.service';
import { SupplierService } from '../../../../../core/services/supplier.service';
import { Category } from '../../../../../core/models/category.model';
import { Supplier } from '../../../../../core/models/supplier.model';
import { NotificationService } from '../../../../../core/services';

@Component({
  selector: 'app-product-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
  ],
  templateUrl: './product-dialog.component.html',
  styleUrl: './product-dialog.component.css',
})
export class ProductDialogComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly dialogRef = inject(MatDialogRef<ProductDialogComponent>);
  private readonly productService = inject(ProductService);
  private readonly categoryService = inject(CategoryService);
  private readonly supplierService = inject(SupplierService);
  private readonly notification = inject(NotificationService);


  readonly data: Product | null = inject(MAT_DIALOG_DATA);
  readonly isEditMode = !!this.data;

  readonly categories = signal<Category[]>([]);
  readonly suppliers = signal<Supplier[]>([]);

  readonly form = this.fb.group({
    name: [
      this.data?.name ?? '',
      [Validators.required, Validators.maxLength(150)],
    ],
    description: [this.data?.description ?? '', Validators.maxLength(500)],
    sku: [this.data?.sku ?? '', Validators.maxLength(50)],
    price: [
      this.data?.price ?? null,
      [Validators.required, Validators.min(0.01)],
    ],
    stockQuantity: [
      this.data?.stockQuantity ?? 0,
      [Validators.required, Validators.min(0)],
    ],
    minStockAlert: [
      this.data?.minStockAlert ?? 5,
      [Validators.required, Validators.min(0)],
    ],
    categoryId: [this.data?.categoryId ?? null], // ← ahora usa el ID real
    supplierId: [this.data?.supplierId ?? null], // ← ahora usa el ID real
  });

  ngOnInit(): void {
    this.categoryService
      .getAll()
      .subscribe((data) => this.categories.set(data));
    this.supplierService.getAll().subscribe((data) => this.suppliers.set(data));
  }

  getError(field: string): string {
    const ctrl = this.form.get(field)!;
    if (ctrl.hasError('required')) return 'Este campo es obligatorio';
    if (ctrl.hasError('maxlength'))
      return `Máximo ${ctrl.errors?.['maxlength'].requiredLength} caracteres`;
    if (ctrl.hasError('min'))
      return `El valor mínimo es ${ctrl.errors?.['min'].min}`;
    return '';
  }

  onSubmit(): void {
    if (this.form.invalid) return;

    const request = {
      name: this.form.value.name!,
      description: this.form.value.description ?? '',
      sku: this.form.value.sku ?? '',
      price: Number(this.form.value.price),
      stockQuantity: Number(this.form.value.stockQuantity),
      minStockAlert: Number(this.form.value.minStockAlert),
      categoryId: this.form.value.categoryId ?? null,
      supplierId: this.form.value.supplierId ?? null,
    };

    const operation$ = this.isEditMode
      ? this.productService.update(this.data!.id, request)
      : this.productService.create(request);

    operation$.subscribe({
      next: (result) => this.dialogRef.close(result),
      error: () => {
        this.notification.error('Error guardando producto');
      },
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
