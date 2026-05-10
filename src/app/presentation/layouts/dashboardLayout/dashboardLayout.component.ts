import { CommonModule, DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SidebarMenuItemComponent } from '@components/sidebarMenuItem/sidebarMenuItem.component';
import { routes } from '../../../app.routes';

const THEME_STORAGE_KEY = 'zeplexity-theme';

@Component({
  selector: 'app-dashboard-layout',
  imports: [CommonModule, RouterModule, SidebarMenuItemComponent],
  templateUrl: './dashboardLayout.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardLayoutComponent implements OnInit {
  private readonly doc = inject(DOCUMENT);

  public menuItems = routes[0].children?.filter((route) => route.data);
  public readonly collapsed = signal(false);
  public readonly isDark = signal(false);

  public ngOnInit(): void {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    const prefersDark =
      typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const dark = stored === 'dark' || (stored !== 'light' && prefersDark);
    this.isDark.set(dark);
    this.applyTheme(dark);
  }

  public setTheme(dark: boolean): void {
    this.isDark.set(dark);
    localStorage.setItem(THEME_STORAGE_KEY, dark ? 'dark' : 'light');
    this.applyTheme(dark);
  }

  public toggleTheme(): void {
    this.setTheme(!this.isDark());
  }

  public toggleSidebar(): void {
    this.collapsed.update((value) => !value);
  }

  private applyTheme(dark: boolean): void {
    this.doc.documentElement.classList.toggle('tw-dark-root', dark);
  }
}
