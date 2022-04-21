import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
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
import { ProfileComponent } from './pages/profile/profile.component';
import { ProductDetailsComponent } from './pages/product-details/product-details.component';
import { AuthGuard } from './shared/guards/auth/auth.guard';
import { ProfileGuard } from './shared/guards/profile/profile.guard';
import { HistoryComponent } from './pages/history/history.component';
import { FeedbackComponent } from './pages/feedback/feedback.component'
import { AdminFeedbacksComponent } from './admin/admin-feedbacks/admin-feedbacks.component'

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'discounts', component: DiscountComponent },
  { path: 'discounts/:path', component: DiscountsDetailsComponent },
  { path: 'menu/:category', component: ProductComponent },
  { path: 'menu/:category/:name', component: ProductDetailsComponent },
  { path: 'basket', component: BasketComponent },
  { path: 'profile', component: ProfileComponent , canActivate: [ProfileGuard]},
  { path: 'history', component: HistoryComponent , canActivate: [ProfileGuard]},
  { path: 'feedback', component: FeedbackComponent},
  { path: 'admin', component: AdminComponent, canActivate: [AuthGuard] ,children: [
    { path: '', pathMatch: 'full', redirectTo: 'admin-category' },
    { path: 'admin-discounts', component: AdminDiscountsComponent},
    { path: 'admin-products', component: AdminProductsComponent},
    { path: 'admin-category', component: AdminCategoryComponent},
    { path: 'admin-orders', component: AdminOrdersComponent},
    { path: 'admin-feedbacks', component: AdminFeedbacksComponent},
  ]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
