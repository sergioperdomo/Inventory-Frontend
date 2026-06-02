import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from '@angular/core';

import { FormsModule } from '@angular/forms';
import { CategoryService, NotificationService } from '../../../core/services';
import { Category } from '../../../core/models/category.model';
import { CategoryDialogComponent } from '../category-dialog/category-dialog/category-dialog.component';

@Component({
  selector: 'app-category-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [FormsModule, CategoryDialogComponent],
  templateUrl: './category-list.component.html',
  styleUrl: './category-list.component.css',
})
export class CategoryListComponent implements OnInit {
  private readonly categoryService = inject(CategoryService);
  private readonly notification = inject(NotificationService);

  readonly categories = signal<Category[]>([]);
  readonly loading = signal(false);
  readonly searchTerm = signal('');
  readonly showDialog = signal(false);
  readonly editCategory = signal<Category | null>(null);

  readonly filteredCategories = computed(() => {
    const term = this.searchTerm().toLowerCase();
    if (!term) return this.categories();
    return this.categories().filter((c) => c.name.toLowerCase().includes(term));
  });

  readonly totalProducts = computed(() =>
    this.categories().reduce((acc, c) => acc + c.productCount, 0),
  );

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
      error: () => this.loading.set(false),
    });
  }

  openCreate(): void {
    this.editCategory.set(null);
    this.showDialog.set(true);
  }

  openEdit(category: Category): void {
    this.editCategory.set(category);
    this.showDialog.set(true);
  }

  closeDialog(): void {
    this.showDialog.set(false);
    this.editCategory.set(null);
  }

  onSaved(category: Category): void {
    if (this.editCategory()) {
      this.categories.update((list) =>
        list.map((c) => (c.id === category.id ? category : c)),
      );
    } else {
      this.categories.update((list) => [...list, category]);
    }
    this.closeDialog();
  }

  onSearch(term: string): void {
    this.searchTerm.set(term);
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
