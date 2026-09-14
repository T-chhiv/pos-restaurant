import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IngredientList } from './ingredient-list/ingredient-list';

const routes: Routes = [
  {
    path: '',
    component: IngredientList
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class IngredientManagementRoutingModule {}
