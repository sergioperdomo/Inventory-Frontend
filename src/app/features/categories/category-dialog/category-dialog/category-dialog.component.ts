import { Component, inject, input, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  CategoryService,
  NotificationService,
} from '../../../../core/services';

import { Category } from '../../../../core/models/category.model';

@Component({
  selector: 'app-category-dialog',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './category-dialog.component.html',
  styleUrl: './category-dialog.component.css',
})
export class CategoryDialogComponent {
  private readonly fb = inject(FormBuilder);
  private readonly categoryService = inject(CategoryService);
  private readonly notification = inject(NotificationService);

  readonly category = input<Category | null>(null);
  readonly saved = output<Category>();
  readonly closed = output<void>();

  get isEditMode(): boolean {
    return !!this.category();
  }

  readonly form = this.fb.group({
    name: ['', [Validators.required, Validators.maxLength(100)]],
    description: ['', Validators.maxLength(255)],
  });

  ngOnInit(): void {
    const c = this.category();
    if (c) {
      this.form.patchValue({
        name: c.name,
        description: c.description,
      });
    }
  }

  getError(field: string): string {
    const ctrl = this.form.get(field)!;
    if (ctrl.hasError('required')) return 'Este campo es obligatorio';
    if (ctrl.hasError('maxlength'))
      return `Máximo ${ctrl.errors?.['maxlength'].requiredLength} caracteres`;
    return '';
  }

  onSubmit(): void {
    if (this.form.invalid) return;

    const request = {
      name: this.form.value.name!,
      description: this.form.value.description ?? '',
    };

    const operation$ = this.isEditMode
      ? this.categoryService.update(this.category()!.id, request)
      : this.categoryService.create(request);

    operation$.subscribe({
      next: (result) => {
        this.notification.success(
          this.isEditMode
            ? 'Categoría actualizada correctamente'
            : 'Categoría creada correctamente',
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
