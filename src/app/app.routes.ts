import { Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout/layout.component';


export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/dashboard/dashboard/dashboard.component')
            .then(m => m.DashboardComponent)
      },
      {
        path: 'products',
        loadComponent: () =>
          import('./features/products/product-list/product-list.component')
            .then(m => m.ProductListComponent)
      },
      {
        path: 'categories',
        loadComponent: () =>
          import('./features/categories/category-list/category-list.component')
            .then(m => m.CategoryListComponent)
      },
      {
        path: 'suppliers',
        loadComponent: () =>
          import('./features/suppliers/supplier-list/supplier-list.component')
            .then(m => m.SupplierListComponent)
      },
      {
        path: 'stock-movements',
        loadComponent: () =>
          import('./features/stock-movements/stock-movement-list/stock-movement-list.component')
            .then(m => m.StockMovementListComponent)
      },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },
  { path: '**', redirectTo: '' }
];
