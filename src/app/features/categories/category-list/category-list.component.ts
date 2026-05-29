import { Component, computed, inject, OnInit, signal } from '@angular/core';

import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatBadgeModule } from '@angular/material/badge';
import { FormsModule } from '@angular/forms';
import { CategoryService, NotificationService } from '../../../core/services';
import { Category } from '../../../core/models/category.model';
import { MatDialog } from '@angular/material/dialog';
import { CategoryDialogComponent } from '../category-dialog/category-dialog/category-dialog.component';

@Component({
  selector: 'app-category-list',
  standalone: true,
  imports: [
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatTooltipModule,
    MatBadgeModule,
    FormsModule,
],
  templateUrl: './category-list.component.html',
  styleUrl: './category-list.component.css',
})
export class CategoryListComponent implements OnInit {
  private readonly notification = inject(NotificationService);
  private readonly categoryService = inject(CategoryService);
  private readonly dialog = inject(MatDialog);

  readonly categories = signal<Category[]>([]);
  readonly loading = signal<boolean>(false);
  readonly searchTerm = signal<string>('');

  readonly filteredCategories = computed(() => {
    const term = this.searchTerm().toLowerCase();
    if (!term) return this.categories();
    return this.categories().filter((c) => c.name.toLowerCase().includes(term));
  });

  readonly totalProducts = computed(() =>
    this.categories().reduce((acc, c) => acc + c.productCount, 0),
  );

  readonly displayedColumns = [
    'name',
    'description',
    'productCount',
    'actions',
  ];

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.loading.set(true);
    this.categoryService.getAll().subscribe({
      next: (data) => {
        this.categories.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.notification.error('Error cargando categorías');
        this.loading.set(false);
      },
    });
  }

  onSearch(term: string): void {
    this.searchTerm.set(term);
  }

  openDialog(category: Category | null = null): void {
    const dialogRef = this.dialog.open(CategoryDialogComponent, {
      data: category,
      width: '480px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (!result) return;
      if (category) {
        // Edición: reemplaza el elemento en el signal
        this.categories.update((list) =>
          list.map((c) => (c.id === result.id ? result : c)),
        );
      } else {
        // Creación: agrega al signal
        this.categories.update((list) => [...list, result]);
      }
    });
  }

  delete(id: number): void {
    if (!confirm('¿Estás seguro de eliminar esta categoría?')) return;
    this.categoryService.delete(id).subscribe({
      next: () => {
        this.categories.update((list) => list.filter((c) => c.id !== id));
        this.notification.success('Categoría eliminada correctamente');
      },
      error: () => {},
    });
  }
}
