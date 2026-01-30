import { Routes } from '@angular/router';
import { ProductListComponent } from './components/product-list/product-list';
import { ShopListComponent } from './components/shop-list/shop-list';

export const routes: Routes = [
  { path: 'boutiques', component: ShopListComponent },
  { path: 'produits/boutique/:id', component: ProductListComponent },
];
