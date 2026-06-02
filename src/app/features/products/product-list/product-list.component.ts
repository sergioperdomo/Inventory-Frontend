import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormsModule } from '@angular/forms';
import { CurrencyPipe } from '@angular/common';
import { Product } from '../../../core/models/product.model';
import { ProductService } from '../../../core/services/product.service';
import { MatDialog } from '@angular/material/dialog';
import { ProductDialogComponent } from './product-dialog/product-dialog/product-dialog.component';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-product-list',
  standalone: true,
  templateUrl: './product-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,

  styleUrl: './product-list.component.css',
  imports: [FormsModule, CurrencyPipe, ProductDialogComponent],
})
export class ProductListComponent implements OnInit {
  private readonly productService = inject(ProductService);
  private readonly notification = inject(NotificationService);

  readonly products = signal<Product[]>([]);
  readonly loading = signal(false);
  readonly searchTerm = signal('');
  readonly showDialog = signal(false);
  readonly editProduct = signal<Product | null>(null);

  readonly filteredProducts = computed(() => {
    const term = this.searchTerm().toLowerCase();
    if (!term) return this.products();
    return this.products().filter((p) => p.name.toLowerCase().includes(term));
  });

  readonly lowStockCount = computed(
    () => this.products().filter((p) => p.lowStock).length,
  );

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.loading.set(true);
    this.productService.getAll().subscribe({
      next: (data) => {
        this.products.set(data);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  openCreate(): void {
    this.editProduct.set(null);
    this.showDialog.set(true);
  }

  openEdit(product: Product): void {
    this.editProduct.set(product);
    this.showDialog.set(true);
  }

  closeDialog(): void {
    this.showDialog.set(false);
    this.editProduct.set(null);
  }

  onSaved(product: Product): void {
    if (this.editProduct()) {
      this.products.update((list) =>
        list.map((p) => (p.id === product.id ? product : p)),
      );
    } else {
      this.products.update((list) => [...list, product]);
    }
    this.closeDialog();
  }

  delete(id: number): void {
    if (!confirm('¿Estás seguro de eliminar este producto?')) return;
    this.productService.delete(id).subscribe({
      next: () => {
        this.products.update((list) => list.filter((p) => p.id !== id));
        this.notification.success('Producto eliminado correctamente');
      },
      error: () => {},
    });
  }

  onSearch(term: string): void {
    this.searchTerm.set(term);
  }
}
