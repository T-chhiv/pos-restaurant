import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MenuItemLayout } from './menu-item-layout/menu-item-layout';

const routes: Routes = [
  {
    path: '',
    component: MenuItemLayout,
    children: [
      {
        path : '',
        redirectTo: 'item',
        pathMatch: 'full'
      },
      {
        path : 'item',
        loadChildren: () =>
            import('../menu-item/items/items-routing-module')
                .then(m => m.ItemsRoutingModule)
      },
      {
        path: 'menu-category',
        loadChildren: () => 
            import('../menu-item/menu-category/menu-category-routing-module')
                .then(m => m.MenuCategoryRoutingModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MenuItemRoutingModule {}
