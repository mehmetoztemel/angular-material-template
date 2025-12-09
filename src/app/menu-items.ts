// import { MenuItem } from "./shared/models/menuitem";

// export const menuItems: MenuItem[] = [
//   {
//     Path: '/dashboard',
//     Icon: 'home',
//     Label: 'Dashboard'
//   },
//   {
//     Path: '/person',
//     Icon: 'groups',
//     Label: 'Persons'
//   },
//   {
//     Path: '',
//     Icon: 'groups',
//     Label: 'Menu Items',
//     SubItems: [
//       {
//         Path: '',
//         Icon: 'groups',
//         Label: 'Menu Item1',
//       },
//       {
//         Path: '',
//         Icon: 'groups',
//         Label: 'Menu Item2',
//       },
//       {
//         Path: '',
//         Icon: 'groups',
//         Label: 'Menu Item3',
//         SubItems: [
//           {
//             Path: '',
//             Icon: 'groups',
//             Label: 'Menu Item 3.1'
//           },
//           {
//             Path: '',
//             Icon: 'groups',
//             Label: 'Menu Item 3.2'
//           },
//           {
//             Path: '',
//             Icon: 'groups',
//             Label: 'Menu Item 3.3',
//             SubItems: [
//               {
//                 Path: '',
//                 Icon: 'groups',
//                 Label: 'Menu Item 3.3.1'
//               },
//               {
//                 Path: '',
//                 Icon: 'groups',
//                 Label: 'Menu Item 3.3.2'
//               },
//               {
//                 Path: '',
//                 Icon: 'groups',
//                 Label: 'Menu Item 3.3.3'
//               }
//             ]
//           }
//         ]
//       },
//       {
//         Path: '',
//         Icon: 'groups',
//         Label: 'Menu Item3',
//         SubItems: [
//           {
//             Path: '',
//             Icon: 'groups',
//             Label: 'Menu Item 3.1'
//           },
//           {
//             Path: '',
//             Icon: 'groups',
//             Label: 'Menu Item 3.2'
//           },
//           {
//             Path: '',
//             Icon: 'groups',
//             Label: 'Menu Item 3.3',
//             SubItems: [
//               {
//                 Path: '',
//                 Icon: 'groups',
//                 Label: 'Menu Item 3.3.1'
//               },
//               {
//                 Path: '',
//                 Icon: 'groups',
//                 Label: 'Menu Item 3.3.2'
//               },
//               {
//                 Path: '',
//                 Icon: 'groups',
//                 Label: 'Menu Item 3.3.3'
//               }
//             ]
//           }
//         ]
//       },
//       {
//         Path: '',
//         Icon: 'groups',
//         Label: 'Menu Item3',
//         SubItems: [
//           {
//             Path: '',
//             Icon: 'groups',
//             Label: 'Menu Item 3.1'
//           },
//           {
//             Path: '',
//             Icon: 'groups',
//             Label: 'Menu Item 3.2'
//           },
//           {
//             Path: '',
//             Icon: 'groups',
//             Label: 'Menu Item 3.3',
//             SubItems: [
//               {
//                 Path: '',
//                 Icon: 'groups',
//                 Label: 'Menu Item 3.3.1'
//               },
//               {
//                 Path: '',
//                 Icon: 'groups',
//                 Label: 'Menu Item 3.3.2'
//               },
//               {
//                 Path: '',
//                 Icon: 'groups',
//                 Label: 'Menu Item 3.3.3'
//               }
//             ]
//           }
//         ]
//       },
//       {
//         Path: '',
//         Icon: 'groups',
//         Label: 'Menu Item3',
//         SubItems: [
//           {
//             Path: '',
//             Icon: 'groups',
//             Label: 'Menu Item 3.1'
//           },
//           {
//             Path: '',
//             Icon: 'groups',
//             Label: 'Menu Item 3.2'
//           },
//           {
//             Path: '',
//             Icon: 'groups',
//             Label: 'Menu Item 3.3',
//             SubItems: [
//               {
//                 Path: '',
//                 Icon: 'groups',
//                 Label: 'Menu Item 3.3.1'
//               },
//               {
//                 Path: '',
//                 Icon: 'groups',
//                 Label: 'Menu Item 3.3.2'
//               },
//               {
//                 Path: '',
//                 Icon: 'groups',
//                 Label: 'Menu Item 3.3.3'
//               }
//             ]
//           }
//         ]
//       },
//     ]
//   },

// ];



import { MenuItem } from "./shared/models/menuitem";

export const menuItems: MenuItem[] = [
  {
    Path: '',
    Icon: 'business',
    Label: 'Crm'
  },
  {
    Path: '',
    Icon: 'description',
    Label: 'Firmalar',
  },
  {
    Path: '',
    Icon: 'people',
    Label: 'Kişiler',
  },
  {
    Path: '',
    Icon: 'visibility',
    Label: 'Görüşme Formu',
  },
  {
    Path: '',
    Icon: 'chat',
    Label: 'İletişim',
  },
  {
    Path: '',
    Icon: 'local_shipping',
    Label: 'Tanklar',
  },
  {
    Path: '',
    Icon: 'local_gas_station',
    Label: 'Pompalar',
  },
  {
    Path: '',
    Icon: 'settings',
    Label: 'Crm Tanımları',
    SubItems: [
      {
        Path: '',
        Icon: 'category',
        Label: 'Tanım 1',
      },
      {
        Path: '',
        Icon: 'label',
        Label: 'Tanım 2',
      },
    ]
  },
  {
    Path: '',
    Icon: 'assessment',
    Label: 'Finans'
  },
  {
    Path: '',
    Icon: 'bar_chart',
    Label: 'Raporlar',
    SubItems: [
      {
        Path: '',
        Icon: 'trending_up',
        Label: 'Rapor 1',
      },
      {
        Path: '',
        Icon: 'pie_chart',
        Label: 'Rapor 2',
      },
    ]
  },
  {
    Path: '',
    Icon: 'receipt',
    Label: 'Muhasebe'
  },
  {
    Path: '/person',
    Icon: 'groups',
    Label: 'Personel'
  },
  {
    Path: '',
    Icon: 'confirmation_number',
    Label: 'Ticket'
  },
  {
    Path: '',
    Icon: 'build',
    Label: 'Bakım'
  },
  {
    Path: '',
    Icon: 'settings_applications',
    Label: 'Ayarlar'
  },
  {
    Path: '',
    Icon: 'info',
    Label: 'Durum'
  }
];