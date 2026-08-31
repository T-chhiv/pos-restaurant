import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UnitCategoryList } from './unit-category-list/unit-category-list';

const routes: Routes = [
  {
    path: '',
    component: UnitCategoryList
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UnitCategoriesRoutingModule {}
