import { Component, computed, inject, signal } from '@angular/core';

import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import {
  MOVEMENT_TYPE_LABELS,
  MovementType,
  StockMovement,
} from '../../../core/models/stock-movement.model';
import { StockMovementService } from '../../../core/services/stock-movement.service';
import { MatDialog } from '@angular/material/dialog';
import { StockMovementDialogComponent } from '../stock-movement-dialog/stock-movement-dialog/stock-movement-dialog.component';

@Component({
  selector: 'app-stock-movement-list',
  standalone: true,
  imports: [
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatTooltipModule,
    MatSelectModule,
    MatChipsModule,
    FormsModule,
    DatePipe,
  ],
  templateUrl: './stock-movement-list.component.html',
  styleUrl: './stock-movement-list.component.css',
})
export class StockMovementListComponent {
  private readonly movementService = inject(StockMovementService);
  private readonly dialog = inject(MatDialog);

  readonly movements = signal<StockMovement[]>([]);
  readonly loading = signal<boolean>(false);
  readonly filterType = signal<MovementType | 'ALL'>('ALL');

  readonly MovementType = MovementType;
  readonly MOVEMENT_TYPE_LABELS = MOVEMENT_TYPE_LABELS;

  readonly filteredMovements = computed(() => {
    const type = this.filterType();
    if (type === 'ALL') return this.movements();
    return this.movements().filter((m) => m.type === type);
  });

  readonly totalEntradas = computed(() =>
    this.movements()
      .filter((m) => m.type === MovementType.ENTRADA)
      .reduce((acc, m) => acc + m.quantity, 0),
  );

  readonly totalSalidas = computed(() =>
    this.movements()
      .filter((m) => m.type === MovementType.SALIDA)
      .reduce((acc, m) => acc + m.quantity, 0),
  );

  readonly displayedColumns = [
    'type',
    'productName',
    'quantity',
    'notes',
    'createdAt',
  ];

  ngOnInit(): void {
    this.loadMovements();
  }

  loadMovements(): void {
    this.loading.set(true);
    this.movementService.getAll().subscribe({
      next: (data) => {
        this.movements.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error cargando movimientos', err);
        this.loading.set(false);
      },
    });
  }

  onFilterType(type: MovementType | 'ALL'): void {
    this.filterType.set(type);
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(StockMovementDialogComponent, {
      data: null,
      width: '520px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (!result) return;
      this.movements.update((list) => [result, ...list]);
    });
  }
}
