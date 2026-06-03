import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,

  templateUrl: './toast.component.html',
  styleUrl: './toast.component.css',
})
export class ToastComponent {
  readonly notificationService = inject(NotificationService);
}
