import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UnitCategoriesRoutingModule } from './unit-categories-routing-module';
import { UnitCategoryList } from './unit-category-list/unit-category-list';
import { ShareMaterialModule } from '../../../shareComponents/share-material/share-material-module';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [UnitCategoryList],
  imports: [CommonModule, UnitCategoriesRoutingModule, ShareMaterialModule, ReactiveFormsModule],
})
export class UnitCategoriesModule {}
