import { Component, Input } from '@angular/core';
import { MenuItem } from '../shared/models/menuitem';

@Component({
  selector: 'app-menu-items',
  templateUrl: './menu-items.component.html',
  styleUrls: ['./menu-items.component.scss'],
  standalone: false
})
export class MenuItemsComponent {
  @Input() menuItems: MenuItem[] = [];
  @Input() isCollapsed: boolean = false;
}
