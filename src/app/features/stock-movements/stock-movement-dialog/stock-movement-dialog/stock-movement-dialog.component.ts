import {
  Component,
  inject,
  OnInit,
  ChangeDetectionStrategy,
  signal,
  output,
} from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { StockMovementService } from '../../../../core/services/stock-movement.service';
import { ProductService } from '../../../../core/services/product.service';
import { Product } from '../../../../core/models/product.model';
import { MovementType, StockMovement } from '../../../../core/models/stock-movement.model';
import { NotificationService } from '../../../../core/services';

@Component({
  selector: 'app-stock-movement-dialog',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule],
  templateUrl: './stock-movement-dialog.component.html',
  styleUrl: './stock-movement-dialog.component.css',
})
export class StockMovementDialogComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly movementService = inject(StockMovementService);
  private readonly productService = inject(ProductService);
  private readonly notification = inject(NotificationService);

  readonly saved = output<StockMovement>();
  readonly closed = output<void>();

  readonly products = signal<Product[]>([]);
  readonly selectedProduct = signal<Product | null>(null);
  readonly MovementType = MovementType;

  readonly form = this.fb.group({
    productId: [null as number | null, Validators.required],
    type: [null as MovementType | null, Validators.required],
    quantity: [null as number | null, [Validators.required, Validators.min(1)]],
    notes: ['', Validators.maxLength(255)],
  });

  ngOnInit(): void {
    this.productService.getAll().subscribe((data) => this.products.set(data));

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
        this.saved.emit(result);
      },
      error: () => {},
    });
  }

  onCancel(): void {
    this.closed.emit();
  }
}
