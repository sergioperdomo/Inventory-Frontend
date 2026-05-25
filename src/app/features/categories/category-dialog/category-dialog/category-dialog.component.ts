import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CategoryService } from '../../../../core/services';

import { MatFormFieldModule } from '@angular/material/form-field';
import {
  MatDialogModule,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';

import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Category } from '../../../../core/models/category.model';

@Component({
  selector: 'app-category-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './category-dialog.component.html',
  styleUrl: './category-dialog.component.css',
})
export class CategoryDialogComponent {
  private readonly fb = inject(FormBuilder);
  private readonly dialogRef = inject(MatDialogRef<CategoryDialogComponent>);
  private readonly categoryService = inject(CategoryService);

  // MAT_DIALOG_DATA contiene la categoría si es edición, null si es creación
  readonly data: Category | null = inject(MAT_DIALOG_DATA);

  readonly isEditMode = !!this.data;

  readonly form = this.fb.group({
    name: [
      this.data?.name ?? '',
      [Validators.required, Validators.maxLength(100)],
    ],
    description: [this.data?.description ?? '', Validators.maxLength(255)],
  });

  get nameError(): string {
    const ctrl = this.form.get('name')!;
    if (ctrl.hasError('required')) return 'El nombre es obligatorio';
    if (ctrl.hasError('maxlength')) return 'Máximo 100 caracteres';
    return '';
  }

  onSubmit(): void {
    if (this.form.invalid) return;

    const request = {
      name: this.form.value.name!,
      description: this.form.value.description ?? '',
    };

    const operation$ = this.isEditMode
      ? this.categoryService.update(this.data!.id, request)
      : this.categoryService.create(request);

    operation$.subscribe({
      next: (result) => this.dialogRef.close(result),
      error: (err) => console.error('Error guardando categoría', err),
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
