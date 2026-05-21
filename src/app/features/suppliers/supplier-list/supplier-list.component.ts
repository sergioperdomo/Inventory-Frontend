import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormsModule } from '@angular/forms';
import { SupplierService } from '../../../core/services/supplier.service';
import { Supplier } from '../../../core/models';

@Component({
  selector: 'app-supplier-list',
  standalone: true,
  imports: [MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatTooltipModule,
    FormsModule],
  templateUrl: './supplier-list.component.html',
  styleUrl: './supplier-list.component.css'
})
export class SupplierListComponent implements OnInit {
   private readonly supplierService = inject(SupplierService);

  readonly suppliers = signal<Supplier[]>([]);
  readonly loading = signal<boolean>(false);
  readonly searchTerm = signal<string>('');

  readonly filteredSuppliers = computed(() => {
    const term = this.searchTerm().toLowerCase();
    if (!term) return this.suppliers();
    return this.suppliers().filter(s =>
      s.name.toLowerCase().includes(term) ||
      s.contactName?.toLowerCase().includes(term)
    );
  });

  readonly displayedColumns = [
    'name', 'contactName', 'email', 'phone', 'productCount', 'actions'
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
      }
    });
  }

  onSearch(term: string): void {
    this.searchTerm.set(term);
  }

  delete(id: number): void {
    if (!confirm('¿Estás seguro de eliminar este proveedor?')) return;
    this.supplierService.delete(id).subscribe({
      next: () => {
        this.suppliers.update(list => list.filter(s => s.id !== id));
      },
      error: (err) => console.error('Error eliminando proveedor', err)
    });
  }
}
