import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { ChangeDetectionStrategy, Component, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { Router } from '@angular/router';
import { menuItems } from '../menu-items';
import { AppConfig } from '../app.config';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss',
  changeDetection: ChangeDetectionStrategy.Default,
  standalone: false
})
export class LayoutComponent implements OnInit {
  @ViewChild(MatSidenav) matSideNav: MatSidenav;
  isCollapsed = false;
  userInfo: string;
  menuItems = menuItems;
  constructor(private breakpointObserver: BreakpointObserver, private router: Router, public appConfig: AppConfig) { }

  ngOnInit(): void {
    this.userInfo = localStorage.getItem("UserInfo");

    this.breakpointObserver.observe([
      Breakpoints.XSmall,
      Breakpoints.Small,
      Breakpoints.Medium,
      Breakpoints.Large,
      Breakpoints.XLarge
    ]).subscribe(result => {
      if (result.matches) {
        if (result.breakpoints[Breakpoints.XSmall]) {
          // console.log('xs');
          this.appConfig.isMobile = true;
        }
        else if (result.breakpoints[Breakpoints.Small]) {
          // console.log('s');
          this.appConfig.isMobile = true;
        }
        else if (result.breakpoints[Breakpoints.Medium]) {
          // console.log('m');
          this.appConfig.isMobile = false;
        }
        else if (result.breakpoints[Breakpoints.Large]) {
          // console.log('l');
          this.appConfig.isMobile = false;
        }
        else if (result.breakpoints[Breakpoints.XLarge]) {
          // console.log('xl');
          this.appConfig.isMobile = false;
        }
      }
    });
  }

  toggleMenu() {
    if (this.appConfig.isMobile) {
      this.matSideNav.toggle();
      this.isCollapsed = false;
    } else {
      this.matSideNav.open();
      this.isCollapsed = !this.isCollapsed;
    }
  }

  logOut() {
    const rememberMe = localStorage.getItem("rememberMe");
    if (rememberMe == null) {
      localStorage.clear();
    }
    this.router.navigateByUrl('auth/login');
  }
}