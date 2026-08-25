import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DepartmentsRoutingModule } from './departments-routing-module';
import { DepartmentList } from './department-list/department-list';
import { ShareMaterialModule } from '../../../shareComponents/share-material/share-material-module';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [DepartmentList],
  imports: [CommonModule,
      DepartmentsRoutingModule, 
      ShareMaterialModule, 
      ReactiveFormsModule,
    ],
})
export class DepartmentsModule {}
