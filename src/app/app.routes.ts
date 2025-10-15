import { Routes } from '@angular/router';
// import { RolesPageComponent } from './shared/roles/roles.page/roles.page.ts.component';
// import { DevEnvironmentsComponent } from './shared/devEnvironments/dev-environments/dev-environments.component';
import { AreasComponent } from './shared/areas/areas/areas.component';
import { SystemProjectsComponent } from './shared/systemProjects/system-projects/system-projects.component';
import { SystemsInfosComponent } from './shared/systenInfos/systems-infos/systems-infos.component';
import { LoginComponent } from './shared/login/login/login.component';
import { DataItemsComponent } from './shared/dataItems/data-items/data-items.component';
import { authGuard } from './core/guards/auth.guard';
import { LogsComponent } from './shared/logs/logs/logs.component';



export const routes: Routes = [

    {
        path: 'systemsInfo', component: SystemsInfosComponent , canActivate:[authGuard]
    },
    {
        path: 'logs', component: LogsComponent , canActivate:[authGuard]
    },
    {
        path: 'login', component: LoginComponent
    },
    {
        path:'',redirectTo: 'login',pathMatch:'full'
    },
    



];
