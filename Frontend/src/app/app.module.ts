import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { DashboardHeadComponent } from './components/dashboard-head/dashboard-head.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { OrdersComponent } from './pages/orders/orders.component';
import { LoginFormComponent } from './pages/login-form/login-form.component';
import { AddOrderComponent } from './pages/add-order/add-order.component';
import { ProductsComponent } from './pages/products/products.component';
import { AddProductComponent } from './pages/add-product/add-product.component';
import { ViewProductComponent } from './pages/view-product/view-product.component';
import { ProductDefintionComponent } from './pages/product-defintion/product-defintion.component'
import { PaperMarketComponent } from './pages/paper-market/paper-market.component';
import { AddPaperMarketComponent } from './pages/add-paper-market/add-paper-market.component';
import { AddProductDefintionComponent } from './pages/add-product-defintion/add-product-defintion.component'
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MultiSelectModule } from 'primeng/multiselect';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DropdownModule } from 'primeng/dropdown';
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
import { CalculatorComponent } from './pages/calculator/calculator.component';
import { CalculatorHeaderComponent } from './pages/calculator-header/calculator-header.component';
import { ConfigurationTableComponent } from './pages/configuration-table/configuration-table.component';
import { ViewOrderComponent } from './pages/view-order/view-order.component';
import { DialogModule } from 'primeng/dialog';
import { LoaderComponent } from './components/loader/loader.component';
import { AuthInterceptorProvider, InterceptorService } from './services/interceptor.service';
import { CtpComponent } from './pages/ctp/ctp.component';
import { AddCtpComponent } from './pages/add-ctp/add-ctp.component';
import { InventoryComponent } from './pages/inventory/inventory.component';
import { AddInventoryComponent } from './pages/add-inventory/add-inventory.component';
import { DatePipe } from '@angular/common';
import { provideRouter, withHashLocation } from '@angular/router';
import { routes } from './app-routing.module';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { DashboardCardsComponent } from './components/dashboard-cards/dashboard-cards.component';
import { CardModule } from 'primeng/card';
import { DashboardChartComponent } from './components/dashboard-chart/dashboard-chart.component';
import { ChartModule } from 'primeng/chart';
import { DashboardChartPieComponent } from './components/dashboard-chart-pie/dashboard-chart-pie.component';
import { PermisionComponent } from './pages/permision/permision.component';
import { ProductRuleComponent } from './pages/product-rule/product-rule.component';
import { AddProductRuleComponent } from './pages/add-product-rule/add-product-rule.component';
import { PaperStockComponent } from './pages/paper-stock/paper-stock.component';
import { AddPaperStockComponent } from './pages/add-paper-stock/add-paper-stock.component';
import { ViewProductRuleComponent } from './pages/view-product-rule/view-product-rule.component';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';
import {ProgressBarModule} from 'primeng/progressbar';
import { SliderModule } from 'primeng/slider';
import { PaginatorModule } from 'primeng/paginator';
import { CalendarModule } from 'primeng/calendar';
import { FileUploadModule } from 'primeng/fileupload';
import { UserComponent } from './pages/user/user.component';
import { AddUsersComponent } from './pages/add-users/add-users.component';

@NgModule({
  declarations: [
    AppComponent,
    SidebarComponent,
    DashboardHeadComponent,
    DashboardComponent,
    OrdersComponent,
    LoginFormComponent,
    AddOrderComponent,
    ProductsComponent,
    AddProductComponent,
    ViewProductComponent,
    ProductDefintionComponent,
    PaperMarketComponent,
    AddPaperMarketComponent,
    AddProductDefintionComponent,
    PaperSizeComponent,
    AddPaperSizeComponent,
    PressMachineComponent,
    AddPressMachineComponent,
    UpingComponent,
    AddUpingComponent,
    VendorComponent,
    AddVendorComponent,
    ProductProcessComponent,
    AddProductProcessComponent,
    SettingsComponent,
    AddSettingsComponent,
    CustomerComponent,
    AddCustomerComponent,
    ViewOrderComponent,
    CalculatorComponent,
    CalculatorHeaderComponent,
    ConfigurationTableComponent,
    LoaderComponent,
    CtpComponent,
    AddCtpComponent,
    InventoryComponent,
    AddInventoryComponent,
    DashboardCardsComponent,
    DashboardChartComponent,
    DashboardChartPieComponent,
    PermisionComponent,
    ProductRuleComponent,
    AddProductRuleComponent,
    PaperStockComponent,
    AddPaperStockComponent,
    ViewProductRuleComponent,
    UserComponent,
    AddUsersComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    MultiSelectModule,
    BrowserAnimationsModule,
    DropdownModule,
    DialogModule,
    ToastModule,
    CardModule,
    ChartModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    TagModule,
    ProgressBarModule,
    SliderModule,
    PaginatorModule,
    CalendarModule,
    FileUploadModule
  ],
  providers: [AuthInterceptorProvider, InterceptorService,MessageService,
    provideRouter(routes, withHashLocation()), DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule {  }
