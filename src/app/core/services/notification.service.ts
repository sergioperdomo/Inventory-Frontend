import { Injectable, signal } from '@angular/core';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: number;
  message: string;
  type: ToastType;
  classes: string;
}

const TOAST_CLASSES: Record<ToastType, string> = {
  success: 'bg-emerald-900/90 border-emerald-500/50 text-emerald-300',
  error: 'bg-red-900/90 border-red-500/50 text-red-300',
  warning: 'bg-amber-900/90 border-amber-500/50 text-amber-300',
  info: 'bg-indigo-900/90 border-indigo-500/50 text-indigo-300',
};

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  readonly toasts = signal<Toast[]>([]);
  private counter = 0;

  private add(message: string, type: ToastType): void {
    const id = ++this.counter;
    const toast: Toast = {
      id,
      message,
      type,
      classes: TOAST_CLASSES[type],
    };

    this.toasts.update((list) => [...list, toast]);

    // Auto-eliminar después de 3.5 segundos
    setTimeout(() => this.remove(id), 3500);
  }

  remove(id: number): void {
    this.toasts.update((list) => list.filter((t) => t.id !== id));
  }

  success(message: string): void {
    this.add(message, 'success');
  }
  error(message: string): void {
    this.add(message, 'error');
  }
  warning(message: string): void {
    this.add(message, 'warning');
  }
  info(message: string): void {
    this.add(message, 'info');
  }
}
