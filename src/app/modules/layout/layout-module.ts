import { NgModule, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LayoutRoutingModule } from './layout-routing-module';
import { Layout } from './layout/layout';
import { ShareMaterialModule } from '../../shareComponents/share-material/share-material-module';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';

@NgModule({
  declarations: [Layout],
  imports: [CommonModule, LayoutRoutingModule, ShareMaterialModule,  MatSidenavModule, MatToolbarModule],
})
export class LayoutModule {}

