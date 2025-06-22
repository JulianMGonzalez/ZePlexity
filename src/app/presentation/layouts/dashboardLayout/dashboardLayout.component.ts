import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SidebarMenuItemComponent } from '@components/sidebarMenuItem/sidebarMenuItem.component';
import { routes } from '../../../app.routes';

@Component({
  selector: 'app-dashboard-layout',
  imports: [CommonModule, RouterModule, SidebarMenuItemComponent],
  templateUrl: './dashboardLayout.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardLayoutComponent {
  public menuItems = routes[0].children?.filter((route) => route.data);
}
