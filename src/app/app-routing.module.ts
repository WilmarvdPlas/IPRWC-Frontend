import { NgModule } from '@angular/core';
import {RouterModule, Routes, UrlMatchResult, UrlSegment} from '@angular/router';
import {LoginComponent} from "./login/login.component";
import {RegisterComponent} from "./register/register.component";
import {PageNotFoundComponent} from "./page-not-found/page-not-found.component";
import {AdministrationComponent} from "./administration/administration.component";
import {ProductsComponent} from "./products/products.component";
import {CartComponent} from "./cart/cart.component";
import {OrdersComponent} from "./orders/orders.component";
import {ProfileComponent} from "./profile/profile.component";
import {ProductComponent} from "./products/product/product.component";

export function uuidMatcher(urlSegments: UrlSegment[]): UrlMatchResult | null {
  const path = urlSegments[0].path
  const id = urlSegments[1].path;

  let regex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

  return regex.test(id) && path == 'product'  && urlSegments.length == 2 ? {
    consumed: urlSegments,
    posParams: { id: new UrlSegment(id, {})}
  } : null;
}

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'administration', component: AdministrationComponent },
  { path: 'products', component: ProductsComponent },
  { path: 'cart', component: CartComponent },
  { path: 'orders', component: OrdersComponent},
  { path: 'profile', component: ProfileComponent},
  { matcher: uuidMatcher, pathMatch: 'full' , component: ProductComponent },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
