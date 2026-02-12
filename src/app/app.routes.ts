import { Routes } from '@angular/router';
// import { ProductListComponent } from './components/product-list/product-list';
import { ShopListComponent } from './components/shop-list/shop-list';
// import { ProductDetailComponent } from './components/product-detail/product-detail';
// import { ProductDetailBoutiqueComponent } from './components/product-detail-boutique/product-detail-boutique';
import { SignupComponent } from './components/signup/signup.component';
import { LoginComponent } from './components/login/login';
import { HomeComponent } from './components/home/home';
import { ShopManagementComponent } from './components/shop-management/shop-management';
import { ShopDetailComponent } from './components/shop-detail/shop-detail';
import { ShopDetailUserComponent } from './components/shop-detail-user/shop-detail-user';

export const routes: Routes = [
  { path: 'boutiques', component: ShopListComponent },
  { path: 'boutiques/:id', component: ShopDetailUserComponent },
//   { path: 'produits/boutique/:id', component: ProductListComponent },
//   { path: 'produit-boutique/:id', component:  ProductDetailBoutiqueComponent},
//   { path: 'produit/:id', component: ProductDetailComponent, },
  { path: 'signup', component: SignupComponent },
  { path: 'login', component: LoginComponent },
  { path: 'admin/boutiques', component: ShopManagementComponent },
  { path: 'admin/boutique-details/:id', component: ShopDetailComponent },
  { path: '', component: HomeComponent },
];
