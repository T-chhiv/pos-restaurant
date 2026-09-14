import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { Layout } from './layout/layout';
import { StockTransaction } from './stock-transaction/stock-transaction';

const routes: Routes = [
    {
        path: '',
        component: Layout,
        children: [
            {
                path: '',
                redirectTo: 'stock',
                pathMatch: 'full'
            },
            {
                path: 'stock',
                loadChildren: () =>
                    import('../stock-management/stock/stock-routing-module')
                        .then(m => m.StockRoutingModule)
            },
            {
                path: 'ingredient',
                loadChildren: () =>
                    import('../stock-management/ingredient-management/ingredient-management-routing-module')
                        .then(m => m.IngredientManagementRoutingModule)
            },
            {
                path: 'stock-transaction',
                component: StockTransaction
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class StockManagementRoutingModule {}