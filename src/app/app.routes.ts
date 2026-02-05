import { Routes } from '@angular/router';
import { ProductListComponent } from './components/product-list/product-list';
import { ShopListComponent } from './components/shop-list/shop-list';
import { ProductDetailComponent } from './components/product-detail/product-detail';
import { ProductDetailBoutiqueComponent } from './components/product-detail-boutique/product-detail-boutique';
import { SignupComponent } from './components/signup/signup.component';

export const routes: Routes = [
  { path: 'boutiques', component: ShopListComponent },
  { path: 'produits/boutique/:id', component: ProductListComponent },
  { path: 'produit-boutique/:id', component:  ProductDetailBoutiqueComponent},
  { path: 'produit/:id', component: ProductDetailComponent, },
  { path: 'signup', component: SignupComponent },
];
