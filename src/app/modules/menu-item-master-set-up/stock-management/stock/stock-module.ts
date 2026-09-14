import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StockRoutingModule } from './stock-routing-module';
import { StockList } from './stock-list/stock-list';
import { ShareMaterialModule } from '../../../../shareComponents/share-material/share-material-module';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [StockList],
  imports: [CommonModule, StockRoutingModule, ShareMaterialModule, ReactiveFormsModule],
})
export class StockModule {}
