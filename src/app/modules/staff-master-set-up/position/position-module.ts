import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PositionRoutingModule } from './position-routing-module';
import { ReactiveFormsModule } from '@angular/forms';
import { ShareMaterialModule } from '../../../shareComponents/share-material/share-material-module';
import { PositionList } from './position-list/position-list';

@NgModule({
  declarations: [PositionList],
  imports: [CommonModule, PositionRoutingModule, ShareMaterialModule, ReactiveFormsModule],
})
export class PositionModule {}
