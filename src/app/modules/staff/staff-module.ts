import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { StaffRoutingModule } from './staff-routing-module';
import { StaffList } from './staff-list/staff-list';
import { StaffDetail } from './staff-detail/staff-detail';

import { ShareMaterialModule } from '../../shareComponents/share-material/share-material-module';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';

@NgModule({
  declarations: [
    StaffList,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    StaffRoutingModule,
    ShareMaterialModule,
     MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule
  ]
})
export class StaffModule {}