import { Component, computed, inject, OnInit, signal } from '@angular/core';
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
  styleUrl: './product-list.component.css',
  imports: [
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatChipsModule,
    MatTooltipModule,
    FormsModule,
    CurrencyPipe,
],
})
export class ProductListComponent implements OnInit {
  private readonly productService = inject(ProductService);
  private readonly notification = inject(NotificationService);
  private readonly dialog = inject(MatDialog);

  readonly products = signal<Product[]>([]);
  readonly loading = signal<boolean>(false);
  readonly searchTerm = signal<string>('');

  readonly filteredProducts = computed(() => {
    const term = this.searchTerm().toLowerCase();
    if (!term) return this.products();
    return this.products().filter((p) => p.name.toLowerCase().includes(term));
  });

  readonly lowStockCount = computed(
    () => this.products().filter((p) => p.lowStock).length,
  );

  readonly displayedColumns = [
    'sku',
    'name',
    'category',
    'supplier',
    'price',
    'stock',
    'status',
    'actions',
  ];

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
      error: (err) => {
        this.notification.error('Error cargando productos');
        this.loading.set(false);
      },
    });
  }

  onSearch(term: string): void {
    this.searchTerm.set(term);
  }

  openDialog(product: Product | null = null): void {
    const dialogRef = this.dialog.open(ProductDialogComponent, {
      data: product,
      width: '560px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (!result) return;
      if (product) {
        this.products.update((list) =>
          list.map((p) => (p.id === result.id ? result : p)),
        );
      } else {
        this.products.update((list) => [...list, result]);
      }
    });
  }

  deleteProduct(id: number): void {
    if (!confirm('¿Estás seguro de eliminar este producto?')) return;
    this.productService.delete(id).subscribe({
      next: () => {
        this.products.update((list) => list.filter((p) => p.id !== id));
        this.notification.success('Producto eliminado correctamente');
      },
      error: () => this.notification.error('Error al eliminar el producto'),
    });
  }
}
