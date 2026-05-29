import { NotificationService } from './../services/notification.service';
import { HttpErrorResponse, HttpInterceptorFn } from "@angular/common/http";
import { inject } from "@angular/core";
import { Router } from "@angular/router";
import { AuthService } from '../services/auth.service';
import { catchError, throwError } from 'rxjs';


export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const notificationService = inject(NotificationService);
  const authService = inject(AuthService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      switch(error.status) {
        case 401:
          // Token expirado o inválido - cerrar sesión
          authService.logout();
          notificationService.warning('Tu sesión ha expirado. Inicia sesión nuevamente.');
          break;
        case 403:
          // Sin permisos
          notificationService.error('No tienes permisos para realizar esta acción.');
          router.navigate(['/dashboard']);
          break;
        case 404:
          notificationService.error('El recurso solicitado no fue encontrado.');
          break;
        case 422:
          // Error de validación del backend
          notificationService.error('Los datos enviados no son válidos. Verifica el formulario.');
          break;

        case 500:
          notificationService.error('Error interno del servidor. Intenta nuevamente más tarde.');
          break;

        case 0:
          // Sin conexión al backend
          notificationService.error('No se puede conectar al servidor. Verifica tu conexión.');
          break;

        default:
          notificationService.error(`Error inesperado (${error.status}). Intenta nuevamente.`);
          break;

      }
      return throwError(() => error);
    })
  );
}
