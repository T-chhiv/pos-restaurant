import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PositionList } from './position-list/position-list';

const routes: Routes = [
  {
    path: '',
    component: PositionList
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PositionRoutingModule {}
