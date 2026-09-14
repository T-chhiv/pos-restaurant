import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatTabsModule } from '@angular/material/tabs';

import { StockManagementRoutingModule } from './stock-management-routing-module';
import { ShareMaterialModule } from '../../../shareComponents/share-material/share-material-module';

import { Layout } from './layout/layout';

@NgModule({
    declarations: [
        Layout
    ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        StockManagementRoutingModule,
        ShareMaterialModule,
        MatTabsModule
    ]
})
export class StockManagementModule {}