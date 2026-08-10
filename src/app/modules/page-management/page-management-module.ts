import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PageManagementRoutingModule } from './page-management-routing-module';
import { PageManagementList } from './page-management-list/page-management-list';

@NgModule({
  declarations: [PageManagementList],
  imports: [CommonModule, PageManagementRoutingModule],
})
export class PageManagementModule {}
