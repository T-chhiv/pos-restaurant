import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UnitList } from './unit-list/unit-list';

const routes: Routes = [
  {
    path: '',
    component: UnitList
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UnitRoutingModule {}
