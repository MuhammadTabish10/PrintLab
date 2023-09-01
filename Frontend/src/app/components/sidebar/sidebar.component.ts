import { Component } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {

  options: any = [
    {
      link: "dashboard",
      icon: "fa fa-home fa-2x",
      name: "Dashboard"
    },
    {
      link: "products",
      icon: "fa fa-shopping-bag fa-2x",
      name: "Products"
    },
    {
      link:"customers",
      icon:"fa fa-user fa-2x",
      name:"Customers"
    },
    {
      link: "orders",
      icon: "fa fa-shopping-cart fa-2x",
      name: "Orders"
    },
    {
      link: "123",
      icon: "fa fa-shop fa-2x",
      name: "Sellers"
    },
    {
      link: "addProduct",
      icon: "fa fa-add fa-2x",
      name: "Add Product"
    },
    {
      link: "123",
      icon: "fa fa-book fa-2x",
      name: "Transactions"
    },
    {
      link: "123",
      icon: "fa fa-user fa-2x",
      name: "Accounts"
    },
    {
      link: "123",
      icon: "fa fa-star fa-2x",
      name: "Brands"
    },
    {
      link: "calculator",
      icon: "fa fa-calculator",
      name: "Calculator"
    }
  ]
  configurationOptions: any = [
    {
      link: "productField",
      name: "Product Field"
    },
    {
      link: "paperMarket",
      name: "Paper Market Rate"
    },
    {
      link: "paperSize",
      name: "Paper Size"
    },
    {
      link: "pressMachine",
      name: "Press Machine"
    },
    {
      link: "uping",
      name: "Uping"
    },
    {
      link: "vendor",
      name: "Vendor"
    },
    {
      link: "productProcess",
      name: "Product Process"
    },
    {
      link: "settings",
      name: "Settings"
    },
  ]
  settingFlag: boolean = false

  toggleSettings() {
    this.settingFlag = !this.settingFlag
  }


}
