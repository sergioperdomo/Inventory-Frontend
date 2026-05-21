import { Component, computed, inject, signal } from '@angular/core';

import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { RouterLink } from '@angular/router';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { ProductService } from '../../../core/services/product.service';
import { CategoryService } from '../../../core/services/category.service';
import { SupplierService } from '../../../core/services/supplier.service';
import { StockMovementService } from '../../../core/services/stock-movement.service';
import { Category } from '../../../core/models/category.model';
import { Product } from '../../../core/models/product.model';
import { Supplier } from '../../../core/models/supplier.model';
import { MovementType, StockMovement } from '../../../core/models/stock-movement.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [MatCardModule,
    MatIconModule,
    MatTableModule,
    MatButtonModule,
    MatDividerModule,
    RouterLink,
    CurrencyPipe,
    DatePipe],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  private readonly productService = inject(ProductService);
  private readonly categoryService = inject(CategoryService);
  private readonly supplierService = inject(SupplierService);
  private readonly movementService = inject(StockMovementService);

  readonly products = signal<Product[]>([]);
  readonly categories = signal<Category[]>([]);
  readonly suppliers = signal<Supplier[]>([]);
  readonly movements = signal<StockMovement[]>([]);

  // Métricas computed
  readonly totalProducts = computed(() => this.products().length);
  readonly totalCategories = computed(() => this.categories().length);
  readonly totalSuppliers = computed(() => this.suppliers().length);
  readonly lowStockProducts = computed(() =>
    this.products().filter(p => p.lowStock)
  );
  readonly recentMovements = computed(() =>
    this.movements().slice(0, 5)
  );
  readonly totalStockValue = computed(() =>
    this.products().reduce((acc, p) => acc + (p.price * p.stockQuantity), 0)
  );

  readonly MovementType = MovementType;

  readonly lowStockColumns = ['name', 'sku', 'stockQuantity', 'minStockAlert'];
  readonly movementColumns = ['type', 'productName', 'quantity', 'createdAt'];

  ngOnInit(): void {
    this.loadAll();
  }

  loadAll(): void {
    this.productService.getAll().subscribe(data => this.products.set(data));
    this.categoryService.getAll().subscribe(data => this.categories.set(data));
    this.supplierService.getAll().subscribe(data => this.suppliers.set(data));
    this.movementService.getAll().subscribe(data => this.movements.set(data));
  }
}
