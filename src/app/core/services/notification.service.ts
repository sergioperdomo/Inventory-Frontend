import { inject, Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private readonly snackBar = inject(MatSnackBar);

  private readonly baseConfig: MatSnackBarConfig = {
    duration: 3000,
    horizontalPosition: 'right',
    verticalPosition: 'top'
  };

  success(message: string): void {
    this.snackBar.open(message, '✕', {
      ...this.baseConfig,
      panelClass: ['snack-success']
    });
  }

  error(message: string): void {
    this.snackBar.open(message, '✕', {
      ...this.baseConfig,
      duration: 5000,
      panelClass: ['snack-error']
    });
  }

  warning(message: string): void {
    this.snackBar.open(message, '✕', {
      ...this.baseConfig,
      panelClass: ['snack-warning']
    });
  }

  info(message: string): void {
    this.snackBar.open(message, '✕', {
      ...this.baseConfig,
      panelClass: ['snack-info']
    });
  }
}
