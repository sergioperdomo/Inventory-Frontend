import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  OnInit,
  output,
  signal,
} from '@angular/core';

import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Product } from '../../../../../core/models/product.model';
import { ProductService } from '../../../../../core/services/product.service';
import { CategoryService } from '../../../../../core/services/category.service';
import { SupplierService } from '../../../../../core/services/supplier.service';
import { Category } from '../../../../../core/models/category.model';
import { Supplier } from '../../../../../core/models/supplier.model';
import { NotificationService } from '../../../../../core/services';

@Component({
  selector: 'app-product-dialog',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './product-dialog.component.html',
  styleUrl: './product-dialog.component.css',
})
export class ProductDialogComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly productService = inject(ProductService);
  private readonly categoryService = inject(CategoryService);
  private readonly supplierService = inject(SupplierService);
  private readonly notification = inject(NotificationService);

  // Signals API — reemplazan @Input y @Output
  readonly product = input<Product | null>(null);
  readonly saved = output<Product>();
  readonly closed = output<void>();

  readonly categories = signal<Category[]>([]);
  readonly suppliers = signal<Supplier[]>([]);

  get isEditMode(): boolean {
    return !!this.product();
  }

  readonly form = this.fb.group({
    name: ['', [Validators.required, Validators.maxLength(150)]],
    description: ['', Validators.maxLength(500)],
    sku: ['', Validators.maxLength(50)],
    price: [null as number | null, [Validators.required, Validators.min(0.01)]],
    stockQuantity: [0, [Validators.required, Validators.min(0)]],
    minStockAlert: [5, [Validators.required, Validators.min(0)]],
    categoryId: [null as number | null],
    supplierId: [null as number | null],
  });

  ngOnInit(): void {
    this.categoryService
      .getAll()
      .subscribe((data) => this.categories.set(data));
    this.supplierService.getAll().subscribe((data) => this.suppliers.set(data));

    // Si es edición carga los datos en el formulario
    const p = this.product();
    if (p) {
      this.form.patchValue({
        name: p.name,
        description: p.description,
        sku: p.sku,
        price: p.price,
        stockQuantity: p.stockQuantity,
        minStockAlert: p.minStockAlert,
        categoryId: p.categoryId,
        supplierId: p.supplierId,
      });
    }
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
      ? this.productService.update(this.product()!.id, request)
      : this.productService.create(request);

    operation$.subscribe({
      next: (result) => {
        this.notification.success(
          this.isEditMode
            ? 'Producto actualizado correctamente'
            : 'Producto creado correctamente',
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
