import { ChangeDetectionStrategy, Component, HostListener, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ToastComponent } from '../../shared/components/toast/toast.component';

interface NavItem {
  label: string;
  icon: string;
  route: string;
}

@Component({
  selector: 'app-layout',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css',
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    NgxSpinnerModule,
    ToastComponent
],
})
export class LayoutComponent {
  readonly authService = inject(AuthService);
  readonly sidebarOpen = signal(window.innerWidth >= 1024);
  readonly navItems: NavItem[] = [
    { label: 'Dashboard', icon: 'dashboard', route: '/dashboard' },
    { label: 'Productos', icon: 'inventory_2', route: '/products' },
    { label: 'Categorías', icon: 'category', route: '/categories' },
    { label: 'Proveedores', icon: 'local_shipping', route: '/suppliers' },
    { label: 'Movimientos', icon: 'swap_vert', route: '/stock-movements' },
  ];

  isMobile(): boolean {
    return window.innerWidth < 1024;
  }

  @HostListener('window:resize')
  onResize(): void {
    if (window.innerWidth >= 1024) {
      this.sidebarOpen.set(true);
    }
  }

  toggleSidebar(): void {
    this.sidebarOpen.update(open => !open);
  }

  closeSidebarOnMobile(): void {
    if (this.isMobile()) {
      this.sidebarOpen.set(false);
    }
  }

  logout(): void {
    this.authService.logout();
  }
}
