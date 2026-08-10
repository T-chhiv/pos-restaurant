import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StaffList } from './staff-list/staff-list';

const routes: Routes = [
  {
    path: '',
    component: StaffList
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StaffRoutingModule {}
