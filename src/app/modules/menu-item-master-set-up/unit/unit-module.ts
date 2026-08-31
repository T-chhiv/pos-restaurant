import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UnitRoutingModule } from './unit-routing-module';
import { UnitList } from './unit-list/unit-list';
import { ShareMaterialModule } from '../../../shareComponents/share-material/share-material-module';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [UnitList],
  imports: [CommonModule, UnitRoutingModule, ShareMaterialModule, ReactiveFormsModule],
})
export class UnitModule {}
