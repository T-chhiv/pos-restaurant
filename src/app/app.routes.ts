import { Routes } from '@angular/router';
import { authGuardGuard } from './guards/auth-guard-guard';

export const routes: Routes = [
    {
        path:'',
        redirectTo: '/login',
        pathMatch:'full'
    },
    {
        path: 'login',
        loadChildren:() => import('./modules/login/login-routing-module').then(m => m.LoginRoutingModule),
    },
    {
        path: 'home',
        canActivate:[authGuardGuard],
        loadChildren:() => import('./modules/layout/layout-routing-module').then(m => m.LayoutRoutingModule)
    },
    {
        path:'**',
        redirectTo:'/login'
    }
];
