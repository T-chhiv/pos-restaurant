import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StockList } from './stock-list/stock-list';

const routes: Routes = [
  {
    path: '',
    component: StockList
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StockRoutingModule {}
