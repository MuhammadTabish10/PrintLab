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
import { CalculatorComponent } from './pages/calculator/calculator.component';
import { CtpComponent } from './pages/ctp/ctp.component';
import { AddCtpComponent } from './pages/add-ctp/add-ctp.component';
import { InventoryComponent } from './pages/inventory/inventory.component';
import { AddInventoryComponent } from './pages/add-inventory/add-inventory.component';
import { PermisionComponent } from './pages/permision/permision.component';
import { AddProductRuleComponent } from './pages/add-product-rule/add-product-rule.component';
import { ProductRuleComponent } from './pages/product-rule/product-rule.component';
import { PaperStockComponent } from './pages/paper-stock/paper-stock.component';
import { AddPaperStockComponent } from './pages/add-paper-stock/add-paper-stock.component';
import { ViewProductRuleComponent } from './pages/view-product-rule/view-product-rule.component';
import { UserComponent } from './pages/user/user.component';
import { AddUsersComponent } from './pages/add-users/add-users.component';
import { JobDesignerOrdersComponent } from './pages/job-designer-orders/job-designer-orders.component';
import { JobProductionOrdersComponent } from './pages/job-production-orders/job-production-orders.component';
import { JobPlateSetterOrdersComponent } from './pages/job-plate-setter-orders/job-plate-setter-orders.component';

export const routes: Routes = [
  {
    path: '',
    component: LoginFormComponent
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthguardService]
  },
  {
    path: 'user',
    component: UserComponent,
    canActivate: [AuthguardService]
  },
  {
    path: 'addUser',
    component: AddUsersComponent,
    canActivate: [AuthguardService]
  },
  {
    path: 'orders',
    component: OrdersComponent,
    canActivate: [AuthguardService]
  },
  {
    path: 'jobDesignerOrders',
    component: JobDesignerOrdersComponent,
    canActivate: [AuthguardService]
  },
  {
    path: 'jobProductionOrders',
    component: JobProductionOrdersComponent,
    canActivate: [AuthguardService]
  },
  {
    path: 'jobPlateSetterOrders',
    component: JobPlateSetterOrdersComponent,
    canActivate: [AuthguardService]
  },
  {
    path: 'login',
    component: LoginFormComponent
  },
  {
    path: 'addOrder',
    component: AddOrderComponent,
    canActivate: [AuthguardService]
  },
  // {
  //   path: 'products',
  //   component: ProductsComponent,
  //   canActivate: [AuthguardService]
  // },
  {
    path: 'ProductRule',
    component: ProductRuleComponent,
    canActivate: [AuthguardService]
  },
  {
    path: 'viewProductRule',
    component: ViewProductRuleComponent,
    canActivate: [AuthguardService]
  },
  {
    path: 'addProductRule',
    component: AddProductRuleComponent,
    canActivate: [AuthguardService]
  },
  {
    path: 'addProduct',
    component: AddProductComponent,
    canActivate: [AuthguardService]
  },
  {
    path: 'viewProduct',
    component: ViewProductComponent,
    canActivate: [AuthguardService]
  },
  {
    path: 'addProductField',
    component: AddProductDefintionComponent,
    canActivate: [AuthguardService]
  },
  {
    path: 'productField',
    component: ProductDefintionComponent,
    canActivate: [AuthguardService]
  },
  {
    path: 'paperMarket',
    component: PaperMarketComponent,
    canActivate: [AuthguardService]
  },
  {
    path: 'addPaperMarket',
    component: AddPaperMarketComponent,
    canActivate: [AuthguardService]
  },
  {
    path: 'paperSize',
    component: PaperSizeComponent,
    canActivate: [AuthguardService]
  },
  {
    path: 'addPaperSize',
    component: AddPaperSizeComponent,
    canActivate: [AuthguardService]
  },
  {
    path: 'pressMachine',
    component: PressMachineComponent,
    canActivate: [AuthguardService]
  },
  {
    path: 'addPressMachine',
    component: AddPressMachineComponent,
    canActivate: [AuthguardService]
  },
  {
    path: 'uping',
    component: UpingComponent,
    canActivate: [AuthguardService]
  },
  {
    path: 'addUping',
    component: AddUpingComponent,
    canActivate: [AuthguardService]
  },
  {
    path: 'vendor',
    component: VendorComponent,
    canActivate: [AuthguardService]
  },
  {
    path: 'addVendor',
    component: AddVendorComponent,
    canActivate: [AuthguardService]
  },
  {
    path: 'productProcess',
    component: ProductProcessComponent,
    canActivate: [AuthguardService]
  },
  {
    path: 'addProductProcess',
    component: AddProductProcessComponent,
    canActivate: [AuthguardService]
  },
  {
    path: 'customers',
    component: CustomerComponent,
    canActivate: [AuthguardService]
  },
  {
    path: 'addCustomer',
    component: AddCustomerComponent,
    canActivate: [AuthguardService]
  },
  {
    path: 'settings',
    component: SettingsComponent,
    canActivate: [AuthguardService]
  },
  {
    path: 'addSettings',
    component: AddSettingsComponent,
    canActivate: [AuthguardService]
  },
  {
    path: 'viewOrder',
    component: ViewOrderComponent,
    canActivate: [AuthguardService]
  },
  {
    path: 'calculator',
    component: CalculatorComponent,
    canActivate: [AuthguardService]
  },
  {
    path: 'paperStock',
    component: PaperStockComponent,
    canActivate: [AuthguardService]
  },
  {
    path: 'addPaperStock',
    component: AddPaperStockComponent,
    canActivate: [AuthguardService]
  },
  {
    path: 'permission',
    component: PermisionComponent,
    canActivate: [AuthguardService]
  },
  {
    path: 'ctp',
    component: CtpComponent,
    canActivate: [AuthguardService]
  },
  {
    path: 'addCtp',
    component: AddCtpComponent,
    canActivate: [AuthguardService]
  },
  {
    path: 'inventory',
    component: InventoryComponent,
    canActivate: [AuthguardService]
  },
  {
    path: 'addInventory',
    component: AddInventoryComponent,
    canActivate: [AuthguardService]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

