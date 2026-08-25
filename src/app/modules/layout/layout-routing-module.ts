import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Layout } from './layout/layout';
import { authGuardGuard } from '../../guards/auth-guard-guard';

const routes: Routes = [
  {
    path: '',
    component: Layout,
    children: [
      {
        path: 'staff',
        loadChildren: () =>
          import('../staff/staff-routing-module')
            .then(m => m.StaffRoutingModule)
      },
      {
        path:'page-management',
        loadChildren: () => 
            import('../page-management/page-management-routing-module')
            .then(m => m.PageManagementRoutingModule)
      },
      {
        path: 'department',
        loadChildren: () =>
            import('../staff-master-set-up/departments/departments-routing-module')
            .then(m => m.DepartmentsRoutingModule)
      },
      {
        path: 'position',
        loadChildren: () => 
          import('../staff-master-set-up/position/position-routing-module')
          .then(m => m.PositionRoutingModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LayoutRoutingModule {}
