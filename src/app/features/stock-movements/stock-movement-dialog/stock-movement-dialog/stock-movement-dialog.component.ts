import {
  Component,
  inject,
  OnInit,
  ChangeDetectionStrategy,
  signal,
} from '@angular/core';
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
import { StockMovementService } from '../../../../core/services/stock-movement.service';
import { ProductService } from '../../../../core/services/product.service';
import { Product } from '../../../../core/models/product.model';
import { MovementType } from '../../../../core/models/stock-movement.model';
import { MatIcon } from '@angular/material/icon';
import { NotificationService } from '../../../../core/services';

@Component({
  selector: 'app-stock-movement-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatIcon,
  ],
  templateUrl: './stock-movement-dialog.component.html',
  styleUrl: './stock-movement-dialog.component.css',
})
export class StockMovementDialogComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly dialogRef = inject(
    MatDialogRef<StockMovementDialogComponent>,
  );
  private readonly movementService = inject(StockMovementService);
  private readonly notification = inject(NotificationService);
  private readonly productService = inject(ProductService);

  // Puede recibir un productId preseleccionado (opcional)
  readonly data: { productId?: number } | null = inject(MAT_DIALOG_DATA);

  readonly products = signal<Product[]>([]);
  readonly MovementType = MovementType;

  readonly form = this.fb.group({
    productId: [this.data?.productId ?? null, Validators.required],
    type: [null as MovementType | null, Validators.required],
    quantity: [null as number | null, [Validators.required, Validators.min(1)]],
    notes: ['', Validators.maxLength(255)],
  });

  // Stock disponible del producto seleccionado
  readonly selectedProduct = signal<Product | null>(null);

  ngOnInit(): void {
    this.productService.getAll().subscribe((data) => {
      this.products.set(data);
      // Si viene un productId preseleccionado, buscar el producto
      if (this.data?.productId) {
        const product = data.find((p) => p.id === this.data?.productId) ?? null;
        this.selectedProduct.set(product);
      }
    });

    // Escuchar cambios en el producto seleccionado
    this.form.get('productId')!.valueChanges.subscribe((id) => {
      const product = this.products().find((p) => p.id === id) ?? null;
      this.selectedProduct.set(product);
    });
  }

  getError(field: string): string {
    const ctrl = this.form.get(field)!;
    if (ctrl.hasError('required')) return 'Este campo es obligatorio';
    if (ctrl.hasError('min'))
      return `La cantidad mínima es ${ctrl.errors?.['min'].min}`;
    if (ctrl.hasError('maxlength'))
      return `Máximo ${ctrl.errors?.['maxlength'].requiredLength} caracteres`;
    return '';
  }

  onSubmit(): void {
    if (this.form.invalid) return;

    const request = {
      productId: Number(this.form.value.productId),
      type: this.form.value.type!,
      quantity: Number(this.form.value.quantity),
      notes: this.form.value.notes ?? '',
    };

    this.movementService.register(request).subscribe({
      next: (result) => {
        this.notification.success('Movimiento registrado correctamente');
        this.dialogRef.close(result);
      },
      error: () =>
        this.notification.error(
          'Error al registrar el movimiento — verifica el stock disponible',
        ),
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
