import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';

import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import {
  MovementType,
  StockMovement,
} from '../../../core/models/stock-movement.model';
import { StockMovementService } from '../../../core/services/stock-movement.service';
import { StockMovementDialogComponent } from '../stock-movement-dialog/stock-movement-dialog/stock-movement-dialog.component';

@Component({
  selector: 'app-stock-movement-list',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, DatePipe, StockMovementDialogComponent],
  templateUrl: './stock-movement-list.component.html',
  styleUrl: './stock-movement-list.component.css',
})
export class StockMovementListComponent {
  private readonly movementService = inject(StockMovementService);

  readonly movements = signal<StockMovement[]>([]);
  readonly loading = signal(false);
  readonly filterType = signal<MovementType | 'ALL'>('ALL');
  readonly showDialog = signal(false);

  readonly MovementType = MovementType;

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
      error: () => this.loading.set(false),
    });
  }

  openDialog(): void {
    this.showDialog.set(true);
  }

  closeDialog(): void {
    this.showDialog.set(false);
  }

  onSaved(movement: StockMovement): void {
    this.movements.update((list) => [movement, ...list]);
    this.closeDialog();
  }

  onFilterType(type: MovementType | 'ALL'): void {
    this.filterType.set(type);
  }
}
