import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { NavbarComponent } from './navbar/navbar.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { HttpClientModule } from "@angular/common/http";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { FormsModule } from "@angular/forms";
import { MatIconModule } from "@angular/material/icon";
import {
  NbAccordionModule,
  NbAlertModule,
  NbButtonGroupModule,
  NbButtonModule,
  NbCardModule,
  NbContextMenuModule, NbDialogModule,
  NbFormFieldModule,
  NbIconModule,
  NbInputModule,
  NbLayoutModule,
  NbListModule, NbMenuModule, NbSelectModule,
  NbSidebarModule,
  NbTableModule,
  NbTabsetModule,
  NbThemeModule,
  NbToastrModule, NbToggleModule
} from "@nebular/theme";
import {NbEvaIconsModule} from "@nebular/eva-icons";
import {UserService} from "./services/user.service";
import {HttpService} from "./services/http.service";
import { FooterComponent } from './footer/footer.component';
import { AdministrationComponent } from './administration/administration.component';
import { ProductManagementComponent } from './administration/product-management/product-management.component';
import { ProductEditComponent } from './administration/product-management/product-edit/product-edit.component';
import { ProductsComponent } from './products/products.component';
import { ProductListComponent } from './product-list/product-list.component';
import { CartComponent } from './cart/cart.component';
import { OrdersComponent } from './orders/orders.component';
import { OrderListComponent } from './order-list/order-list.component';
import { AccountManagementComponent } from './administration/account-management/account-management.component';
import { AccountCreateComponent } from './account-create/account-create.component';
import { AccountManagementDialogComponent } from './administration/account-management/account-management-dialog/account-management-dialog.component';
import { ProfileComponent } from './profile/profile.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    NavbarComponent,
    PageNotFoundComponent,
    FooterComponent,
    AdministrationComponent,
    ProductManagementComponent,
    ProductEditComponent,
    ProductsComponent,
    ProductListComponent,
    CartComponent,
    OrdersComponent,
    OrderListComponent,
    AccountManagementComponent,
    AccountCreateComponent,
    AccountManagementDialogComponent,
    ProfileComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    NbThemeModule.forRoot({name: 'dark'}),
    NbButtonModule,
    NbIconModule,
    NbEvaIconsModule,
    NbLayoutModule,
    NbToastrModule.forRoot({limit: 3}),
    NbAlertModule,
    FormsModule,
    MatIconModule,
    NbButtonGroupModule,
    NbCardModule,
    NbAccordionModule,
    NbInputModule,
    NbListModule,
    NbTabsetModule,
    NbSidebarModule.forRoot(),
    NbTableModule,
    NbFormFieldModule,
    NbContextMenuModule,
    NbMenuModule.forRoot(),
    NbSelectModule,
    NbToggleModule,
    NbDialogModule.forRoot()
  ],
  providers: [UserService, HttpService],
  bootstrap: [AppComponent]
})
export class AppModule { }
