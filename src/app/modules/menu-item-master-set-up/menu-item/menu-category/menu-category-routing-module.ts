import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MenuCategoryList } from './menu-category-list/menu-category-list';

const routes: Routes = [
  {
    path: '',
    component: MenuCategoryList,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MenuCategoryRoutingModule {}
