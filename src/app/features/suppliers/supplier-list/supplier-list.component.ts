import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from '@angular/core';

import { FormsModule } from '@angular/forms';
import { SupplierService } from '../../../core/services/supplier.service';
import { Supplier } from '../../../core/models';
import { SupplierDialogComponent } from '../supplier-dialog/supplier-dialog/supplier-dialog.component';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-supplier-list',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, SupplierDialogComponent],
  templateUrl: './supplier-list.component.html',
  styleUrl: './supplier-list.component.css',
})
export class SupplierListComponent implements OnInit {
  private readonly supplierService = inject(SupplierService);
  private readonly notification = inject(NotificationService);

  readonly suppliers = signal<Supplier[]>([]);
  readonly loading = signal(false);
  readonly searchTerm = signal('');
  readonly showDialog = signal(false);
  readonly editSupplier = signal<Supplier | null>(null);

  readonly filteredSuppliers = computed(() => {
    const term = this.searchTerm().toLowerCase();
    if (!term) return this.suppliers();
    return this.suppliers().filter(
      (s) =>
        s.name.toLowerCase().includes(term) ||
        s.contactName?.toLowerCase().includes(term),
    );
  });

  ngOnInit(): void {
    this.loadSuppliers();
  }

  loadSuppliers(): void {
    this.loading.set(true);
    this.supplierService.getAll().subscribe({
      next: (data) => {
        this.suppliers.set(data);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  openCreate(): void {
    this.editSupplier.set(null);
    this.showDialog.set(true);
  }

  openEdit(supplier: Supplier): void {
    this.editSupplier.set(supplier);
    this.showDialog.set(true);
  }

  closeDialog(): void {
    this.showDialog.set(false);
    this.editSupplier.set(null);
  }

  onSaved(supplier: Supplier): void {
    if (this.editSupplier()) {
      this.suppliers.update((list) =>
        list.map((s) => (s.id === supplier.id ? supplier : s)),
      );
    } else {
      this.suppliers.update((list) => [...list, supplier]);
    }
    this.closeDialog();
  }

  onSearch(term: string): void {
    this.searchTerm.set(term);
  }

  delete(id: number): void {
    if (!confirm('¿Estás seguro de eliminar este proveedor?')) return;
    this.supplierService.delete(id).subscribe({
      next: () => {
        this.suppliers.update((list) => list.filter((s) => s.id !== id));
        this.notification.success('Proveedor eliminado correctamente');
      },
      error: () => {},
    });
  }
}
