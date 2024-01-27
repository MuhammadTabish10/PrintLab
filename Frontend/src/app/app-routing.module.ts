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
import { OrderProcessComponent } from './pages/order-process/order-process.component';
import { TransactionsComponent } from './pages/transactions/transactions.component';
import { TransactionRecordComponent } from './pages/transaction-record/transaction-record.component';
import { PetyCashComponent } from './pages/pety-cash/pety-cash.component';
import { VendorSettlementComponent } from './pages/vendor-settlement/vendor-settlement.component';
import { AllSettlementsComponent } from './pages/all-settlements/all-settlements.component';
import { AllPettyCashRecordsComponent } from './pages/all-petty-cash-records/all-petty-cash-records.component';
import { OrderTimeLineComponent } from './pages/order-process/order-time-line/order-time-line.component';
import { GetBindingLaboursComponent } from './pages/Labour/get-binding-labours/get-binding-labours.component';
import { AddBindingLaboursComponent } from './pages/Labour/add-binding-labours/add-binding-labours.component';
import { LaminationVendorsComponent } from './pages/Labour/lamination-vendors/lamination-vendors.component';
import { AddLaminationVendorsComponent } from './pages/Labour/add-lamination-vendors/add-lamination-vendors.component';
import { GetUvVendorsComponent } from './pages/Labour/get-uv-vendors/get-uv-vendors.component';
import { AddUvVendorsComponent } from './pages/Labour/add-uv-vendors/add-uv-vendors.component';
import { ProductCategoriesComponent } from './pages/Product/product-categories/product-categories.component';
import { ProductServicesComponent } from './pages/Product/product-services/product-services.component';
import { GetInvoicesComponent } from './pages/Invoice/get-invoices/get-invoices.component';
import { AddInvoiceComponent } from './pages/Invoice/add-invoice/add-invoice.component';
import { InvoicePrintComponent } from './pages/Invoice/invoice-print/invoice-print.component';

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
  },
  {
    path: 'orderProcess',
    component: OrderProcessComponent,
    canActivate: [AuthguardService]
  },
  {
    path: 'transactions',
    component: TransactionsComponent,
    canActivate: [AuthguardService]
  },
  {
    path: 'transactionRecord',
    component: TransactionRecordComponent,
    canActivate: [AuthguardService]
  },
  {
    path: 'userPetyCash',
    component: PetyCashComponent,
    canActivate: [AuthguardService]
  },
  {
    path: 'vendorSettlement',
    component: VendorSettlementComponent,
    canActivate: [AuthguardService]
  },
  {
    path: 'allSettlements',
    component: AllSettlementsComponent,
    canActivate: [AuthguardService]
  },
  {
    path: 'allPettyCashRecords',
    component: AllPettyCashRecordsComponent,
    canActivate: [AuthguardService]
  },
  {
    path: 'order-timeline',
    component: OrderTimeLineComponent,
    canActivate: [AuthguardService]
  },
  {
    path: 'get-binding-labours',
    component: GetBindingLaboursComponent,
    canActivate: [AuthguardService]
  },
  {
    path: 'add-binding-labour',
    component: AddBindingLaboursComponent,
    canActivate: [AuthguardService]
  },
  {
    path: 'get-lamination-vendors',
    component: LaminationVendorsComponent,
    canActivate: [AuthguardService]
  },
  {
    path: 'add-lamination-vendor',
    component: AddLaminationVendorsComponent,
    canActivate: [AuthguardService]
  },
  {
    path: 'get-uv-vendors',
    component: GetUvVendorsComponent,
    canActivate: [AuthguardService]
  },
  {
    path: 'add-uv-vendor',
    component: AddUvVendorsComponent,
    canActivate: [AuthguardService]
  },
  {
    path: 'product-categories',
    component: ProductCategoriesComponent,
    canActivate: [AuthguardService]
  },
  {
    path: 'get-invoices',
    component: GetInvoicesComponent,
    canActivate: [AuthguardService]
  },
  {
    path: 'add-invoice',
    component: AddInvoiceComponent,
    canActivate: [AuthguardService]
  },
  {
    path: 'print-invoice',
    component: InvoicePrintComponent,
    canActivate: [AuthguardService]
  },
  {
    path: 'product-services',
    component: ProductServicesComponent,
    canActivate: [AuthguardService]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

