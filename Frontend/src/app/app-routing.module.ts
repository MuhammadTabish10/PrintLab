import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AuthguardService } from './services/authguard.service';
import { OrdersComponent } from './pages/orders/orders.component';
import { LoginFormComponent } from './pages/login-form/login-form.component';
import { AddOrderComponent } from './pages/add-order/add-order.component';
import { ProductsComponent } from './pages/products/products.component';
import { AddProductComponent } from './pages/add-product/add-product.component';
import { ViewProductComponent } from './pages/view-product/view-product.component';
import { ProductDefintionComponent } from './pages/product-defintion/product-defintion.component';
import { PaperMarketComponent } from './pages/paper-market/paper-market.component';
import { AddPaperMarketComponent } from './pages/add-paper-market/add-paper-market.component';
import { AddProductDefintionComponent } from './pages/add-product-defintion/add-product-defintion.component';
import { PaperSizeComponent } from './pages/paper-size/paper-size.component';
import { AddPaperSizeComponent } from './pages/add-paper-size/add-paper-size.component';
import { PressMachineComponent } from './pages/press-machine/press-machine.component';
import { AddPressMachineComponent } from './pages/add-press-machine/add-press-machine.component';
import { UpingComponent } from './pages/uping/uping.component';
import { AddUpingComponent } from './pages/add-uping/add-uping.component';
import { VendorComponent } from './pages/vendor/vendor.component';
import { AddVendorComponent } from './pages/add-vendor/add-vendor.component';
import { ProductProcessComponent } from './pages/product-process/product-process.component';
import { AddProductProcessComponent } from './pages/add-product-process/add-product-process.component';
import { SettingsComponent } from './pages/settings/settings.component';
import { AddSettingsComponent } from './pages/add-settings/add-settings.component';
import { CustomerComponent } from './pages/customer/customer.component';
import { AddCustomerComponent } from './pages/add-customer/add-customer.component';
import { ViewOrderComponent } from './pages/view-order/view-order.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthguardService]
  },
  {
    path: 'orders',
    component: OrdersComponent
  },
  {
    path: 'login',
    component: LoginFormComponent
  },
  {
    path: 'addOrder',
    component: AddOrderComponent
  },
  {
    path: 'products',
    component: ProductsComponent
  },
  {
    path: 'addProduct',
    component: AddProductComponent
  },
  {
    path: 'viewProduct',
    component: ViewProductComponent
  },
  {
    path: 'addProductField',
    component: AddProductDefintionComponent
  },
  {
    path: 'productField',
    component: ProductDefintionComponent
  },
  {
    path: 'paperMarket',
    component: PaperMarketComponent
  },
  {
    path: 'addPaperMarket',
    component: AddPaperMarketComponent
  },
  {
    path: 'paperSize',
    component: PaperSizeComponent
  },
  {
    path: 'addPaperSize',
    component: AddPaperSizeComponent
  },
  {
    path: 'pressMachine',
    component: PressMachineComponent
  },
  {
    path: 'addPressMachine',
    component: AddPressMachineComponent
  },
  {
    path: 'uping',
    component: UpingComponent
  },
  {
    path: 'addUping',
    component: AddUpingComponent
  },
  {
    path: 'vendor',
    component: VendorComponent
  },
  {
    path: 'addVendor',
    component: AddVendorComponent
  },
  {
    path: 'productProcess',
    component: ProductProcessComponent
  },
  {
    path: 'addProductProcess',
    component: AddProductProcessComponent
  },
  {
    path: 'customers',
    component: CustomerComponent
  },
  {
    path: 'addCustomer',
    component: AddCustomerComponent
  },
  {
    path: 'settings',
    component: SettingsComponent
  },
  {
    path: 'addSettings',
    component: AddSettingsComponent
  },
  {
    path: 'viewOrder',
    component: ViewOrderComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
