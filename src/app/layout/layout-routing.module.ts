import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { DashboardComponent } from "./dashboard/dashboard.component";

import { LayoutComponent } from "./layout.component";
import { PersonComponent } from "./person/person.component";


export const appRoutes: Routes = [
    {
        path: '',
        component: LayoutComponent,
        children: [
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
            { path: 'dashboard', component: DashboardComponent },
            { path: 'person', component: PersonComponent },
        ]
    }
]

@NgModule({
    imports: [
        RouterModule.forChild(appRoutes)],
    exports: [
        RouterModule
    ]
})
export class LayoutRoutingModule {
}
