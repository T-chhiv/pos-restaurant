import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MenuCategoryRoutingModule } from './menu-category-routing-module';
import { MenuCategoryList } from './menu-category-list/menu-category-list';
import { ShareMaterialModule } from '../../../../shareComponents/share-material/share-material-module';

@NgModule({
  declarations: [MenuCategoryList],
  imports: [CommonModule, MenuCategoryRoutingModule, ShareMaterialModule],
})
export class MenuCategoryModule {}
