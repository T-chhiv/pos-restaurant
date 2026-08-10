import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageManagementList } from './page-management-list/page-management-list';

const routes: Routes = [
  {
    path : '',
    component: PageManagementList
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PageManagementRoutingModule {}
