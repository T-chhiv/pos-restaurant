import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IngredientManagementRoutingModule } from './ingredient-management-routing-module';
import { IngredientList } from './ingredient-list/ingredient-list';
import { ShareMaterialModule } from '../../../../shareComponents/share-material/share-material-module';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
@NgModule({
  declarations: [IngredientList],
  imports: [CommonModule, 
    IngredientManagementRoutingModule, 
    ShareMaterialModule, 
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule],
})
export class IngredientManagementModule {}
