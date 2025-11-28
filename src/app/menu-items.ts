import { MenuItem } from "./shared/models/menuitem";

export const menuItems: MenuItem[] = [
  {
    Path: '/dashboard',
    Icon: 'home',
    Label: 'Dashboard'
  },
  {
    Path: '/person',
    Icon: 'groups',
    Label: 'Persons'
  },
  {
    Path: '',
    Icon: 'groups',
    Label: 'Menu Items',
    SubItems: [
      {
        Path: '',
        Icon: 'groups',
        Label: 'Menu Item1',
      },
      {
        Path: '',
        Icon: 'groups',
        Label: 'Menu Item2',
      },
      {
        Path: '',
        Icon: 'groups',
        Label: 'Menu Item3',
        SubItems: [
          {
            Path: '',
            Icon: 'groups',
            Label: 'Menu Item 3.1'
          },
          {
            Path: '',
            Icon: 'groups',
            Label: 'Menu Item 3.2'
          },
          {
            Path: '',
            Icon: 'groups',
            Label: 'Menu Item 3.3',
            SubItems: [
              {
                Path: '',
                Icon: 'groups',
                Label: 'Menu Item 3.3.1'
              },
              {
                Path: '',
                Icon: 'groups',
                Label: 'Menu Item 3.3.2'
              },
              {
                Path: '',
                Icon: 'groups',
                Label: 'Menu Item 3.3.3'
              }
            ]
          }
        ]
      },
    ]
  },

];