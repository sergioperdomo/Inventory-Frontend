import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormsModule } from '@angular/forms';
import { SupplierService } from '../../../core/services/supplier.service';
import { Supplier } from '../../../core/models';
import { SupplierDialogComponent } from '../supplier-dialog/supplier-dialog/supplier-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-supplier-list',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatTooltipModule,
    FormsModule,
],
  templateUrl: './supplier-list.component.html',
  styleUrl: './supplier-list.component.css',
})
export class SupplierListComponent implements OnInit {
  private readonly supplierService = inject(SupplierService);
  private readonly dialog = inject(MatDialog);
  private readonly notification = inject(NotificationService);

  readonly suppliers = signal<Supplier[]>([]);
  readonly loading = signal<boolean>(false);
  readonly searchTerm = signal<string>('');

  readonly filteredSuppliers = computed(() => {
    const term = this.searchTerm().toLowerCase();
    if (!term) return this.suppliers();
    return this.suppliers().filter(
      (s) =>
        s.name.toLowerCase().includes(term) ||
        s.contactName?.toLowerCase().includes(term),
    );
  });

  readonly displayedColumns = [
    'name',
    'contactName',
    'email',
    'phone',
    'productCount',
    'actions',
  ];

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
      error: (err) => {
        console.error('Error cargando proveedores', err);
        this.loading.set(false);
      },
    });
  }

  onSearch(term: string): void {
    this.searchTerm.set(term);
  }

  openDialog(supplier: Supplier | null = null): void {
    const dialogRef = this.dialog.open(SupplierDialogComponent, {
      data: supplier,
      width: '520px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (!result) return;
      if (supplier) {
        this.suppliers.update((list) =>
          list.map((s) => (s.id === result.id ? result : s)),
        );
      } else {
        this.suppliers.update((list) => [...list, result]);
      }
    });
  }

  delete(id: number): void {
    if (!confirm('¿Estás seguro de eliminar este proveedor?')) return;
    this.supplierService.delete(id).subscribe({
      next: () => {
        this.suppliers.update((list) => list.filter((s) => s.id !== id));
        this.notification.success('Proveedor eliminado correctamente');
      },
      error: (err) => {
        console.error('Error eliminando proveedor', err);
        this.notification.error('No se puede eliminar un proveedor con productos asociados');
      },
    });
  }
}
