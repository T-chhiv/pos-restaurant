import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ItemsRoutingModule } from './items-routing-module';
import { ItemList } from './item-list/item-list';
import { ShareMaterialModule } from '../../../../shareComponents/share-material/share-material-module';

@NgModule({
  declarations: [ItemList],
  imports: [CommonModule, ItemsRoutingModule, ShareMaterialModule],
})
export class ItemsModule {}
