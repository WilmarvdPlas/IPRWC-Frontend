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
  NbAlertModule, NbButtonGroupModule, NbButtonModule, NbCardModule, NbIconModule, NbInputModule,
  NbLayoutModule, NbListModule,
  NbThemeModule,
  NbToastrModule
} from "@nebular/theme";
import {NbEvaIconsModule} from "@nebular/eva-icons";
import {UserService} from "./services/user.service";
import {HttpService} from "./services/http.service";
import { FooterComponent } from './footer/footer.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    NavbarComponent,
    PageNotFoundComponent,
    FooterComponent
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
    NbListModule
  ],
  providers: [UserService, HttpService],
  bootstrap: [AppComponent]
})
export class AppModule { }
