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

@Component({
  selector: 'app-product-list',
  standalone: true,
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css',
  imports: [MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatChipsModule,
    MatTooltipModule,
    FormsModule,
    CurrencyPipe],
})
export class ProductListComponent implements OnInit {
  private readonly productService = inject(ProductService);

  // Signals
  readonly products = signal<Product[]>([]);
  readonly loading = signal<boolean>(false);
  readonly searchTerm = signal<string>('');

  // Computed — filtra productos por nombre en tiempo real
  readonly filteredProducts = computed(() => {
    const term = this.searchTerm().toLowerCase();
    if (!term) return this.products();
    return this.products().filter(p =>
      p.name.toLowerCase().includes(term)
    );
  });

  // Computed — cuenta productos con stock bajo
  readonly lowStockCount = computed(() =>
    this.products().filter(p => p.lowStock).length
  );

  readonly displayedColumns = [
    'sku', 'name', 'category', 'supplier',
    'price', 'stock', 'status', 'actions'
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
        console.error('Error cargando productos', err);
        this.loading.set(false);
      }
    });
  }

  onSearch(term: string): void {
    this.searchTerm.set(term);
  }

  deleteProduct(id: number): void {
    if (!confirm('¿Estás seguro de eliminar este producto?')) return;
    this.productService.delete(id).subscribe({
      next: () => {
        this.products.update(list => list.filter(p => p.id !== id));
      },
      error: (err) => console.error('Error eliminando producto', err)
    });
  }

}
