import { BreakpointObserver } from '@angular/cdk/layout';
import {
  Component,
  DestroyRef,
  inject,
  OnInit,
  ViewChild,
  ChangeDetectionStrategy,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatSidenav } from '@angular/material/sidenav';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { menuItems } from '../menu-items';
import { AppConfig } from '../app.config';
import { ThemeService } from '../shared/services/theme.service';
import { ProfileService } from '../shared/services/profile.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss',
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class LayoutComponent implements OnInit {
  @ViewChild(MatSidenav) matSideNav: MatSidenav;
  private readonly destroyRef = inject(DestroyRef);
  readonly theme = inject(ThemeService);
  isCollapsed = false;
  readonly account = inject(ProfileService);
  menuItems = menuItems;
  constructor(
    private breakpointObserver: BreakpointObserver,
    private router: Router,
    public appConfig: AppConfig,
  ) {}
  ngOnInit(): void {
    this.breakpointObserver
      .observe('(max-width: 959px)')
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((result) => {
        this.appConfig.isMobile = result.matches;
      });
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(() => {
        if (this.appConfig.isMobile) this.matSideNav.close();
      });
  }
  toggleMenu(): void {
    if (this.appConfig.isMobile) {
      this.isCollapsed = false;
      this.matSideNav.toggle();
    } else this.isCollapsed = !this.isCollapsed;
  }
  logOut(): void {
    this.account.clear();
    localStorage.removeItem('Token');
    localStorage.removeItem('UserInfo');
    this.router.navigateByUrl('/auth/login');
  }
}
