import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

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
  imports: [RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatIconModule,
    MatButtonModule]
})
export class LayoutComponent {
  readonly navItems: NavItem[] = [
    { label: 'Dashboard',   icon: 'dashboard',      route: '/dashboard' },
    { label: 'Productos',   icon: 'inventory_2',    route: '/products' },
    { label: 'Categorías',  icon: 'category',       route: '/categories' },
    { label: 'Proveedores', icon: 'local_shipping', route: '/suppliers' },
    { label: 'Movimientos', icon: 'swap_vert',      route: '/stock-movements' }
  ];
}
