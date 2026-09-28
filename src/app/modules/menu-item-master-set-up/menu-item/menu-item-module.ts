import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MenuItemRoutingModule } from './menu-item-routing-module';
import { MenuItemLayout } from './menu-item-layout/menu-item-layout';
import { ShareMaterialModule } from '../../../shareComponents/share-material/share-material-module';

@NgModule({
  declarations: [MenuItemLayout],
  imports: [CommonModule, MenuItemRoutingModule, ShareMaterialModule],
})
export class MenuItemModule {}
