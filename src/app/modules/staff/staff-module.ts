import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StaffRoutingModule } from './staff-routing-module';
import { StaffList } from './staff-list/staff-list';

@NgModule({
  declarations: [StaffList],
  imports: [CommonModule, StaffRoutingModule],
})
export class StaffModule {}
