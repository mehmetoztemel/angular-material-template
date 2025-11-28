import { Component, computed, input, signal } from '@angular/core';
import { MenuItem } from '../shared/models/menuitem';

@Component({
  selector: 'app-menu-items',
  templateUrl: './app-menu-items.component.html',
  styleUrls: ['./app-menu-items.component.scss'],
  standalone: false
})
export class MenuItemsComponent {
  item = input.required<MenuItem>();
  collapsed = input.required<boolean>();
  routeHistory = input('');
  level = computed(() => this.routeHistory().split('/').length - 1);
  indentation = computed(() =>
    this.collapsed() ? '16px' : `${16 + this.level() * 16}px`
  );
  nestedItemOpen = signal(false);
}
