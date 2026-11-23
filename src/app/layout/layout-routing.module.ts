import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';

import { LayoutComponent } from './layout.component';
import { PersonComponent } from './person/person.component';
import { ProfileComponent } from './profile/profile.component';

export const appRoutes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'person', component: PersonComponent },
      { path: 'account', component: ProfileComponent },
      ...['products', 'orders', 'activity'].map((path) => ({
        path,
        loadComponent: () =>
          import('./demo-data/demo-data.component').then(
            (module) => module.DemoDataComponent,
          ),
        data: { demoPage: path },
      })),
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(appRoutes)],
  exports: [RouterModule],
})
export class LayoutRoutingModule {}
