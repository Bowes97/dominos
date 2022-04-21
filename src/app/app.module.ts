import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { ToastrModule } from 'ngx-toastr';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';


import { AdminComponent } from './admin/admin.component';
import { AdminCategoryComponent } from './admin/admin-category/admin-category.component';
import { AdminOrdersComponent } from './admin/admin-orders/admin-orders.component';
import { AdminProductsComponent } from './admin/admin-products/admin-products.component';
import { AdminDiscountsComponent } from './admin/admin-discounts/admin-discounts.component';
import { ProductComponent } from './pages/product/product.component';
import { BasketComponent } from './pages/basket/basket.component';
import { DiscountComponent } from './pages/discount/discount.component';
import { DiscountsDetailsComponent } from './pages/discounts-details/discounts-details.component';
import { HomeComponent } from './pages/home/home.component';
import { ProductDetailsComponent } from './pages/product-details/product-details.component';

import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getStorage, provideStorage } from '@angular/fire/storage';
import { getAuth, provideAuth } from "@angular/fire/auth";
import { environment } from 'src/environments/environment';

import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';

import { ProfileComponent } from './pages/profile/profile.component';

import {MatInputModule} from '@angular/material/input'
import {MatSelectModule} from '@angular/material/select';
import { NgxMaskModule, IConfig } from 'ngx-mask';
import { HistoryComponent } from './pages/history/history.component';
import { FeedbackComponent } from './pages/feedback/feedback.component';
import { AdminFeedbacksComponent } from './admin/admin-feedbacks/admin-feedbacks.component';
import { SearchPipe } from './shared/pipe/search/search.pipe';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    AdminComponent,
    AdminCategoryComponent,
    AdminOrdersComponent,
    AdminProductsComponent,
    AdminDiscountsComponent,
    ProductComponent,
    BasketComponent,
    DiscountComponent,
    DiscountsDetailsComponent,
    HomeComponent,
    ProductDetailsComponent,
    ProfileComponent,
    HistoryComponent,
    FeedbackComponent,
    AdminFeedbacksComponent,
    SearchPipe,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
    provideFirestore(() => getFirestore()),
    provideStorage(() => getStorage()),
    provideAuth(() => getAuth()),
    BsDatepickerModule.forRoot(),
    CarouselModule.forRoot(),
    BsDropdownModule.forRoot(),
    MatInputModule,
    HttpClientModule,
    MatSelectModule,
    NgxMaskModule.forRoot(),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
