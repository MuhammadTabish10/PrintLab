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
      link: "customers",
      icon: "fa fa-user fa-2x",
      name: "Customers"
    },
    {
      link: "orders",
      icon: "fa fa-shopping-cart fa-2x",
      name: "Orders"
    },
    // {
    //   link: "addProduct",
    //   icon: "fa fa-add fa-2x",
    //   name: "Add Product"
    // },
    {
      link: "calculator",
      icon: "fa fa-calculator",
      name: "Calculator"
    }
  ]
  process: any = [
    {
      link: "ctp",
      name: "CTP"
    },
    {
      link: "paperMarket",
      name: "Paper Market Rate"
    },
    {
      link: "pressMachine",
      name: "Press Machine"
    }
  ]
  configurationOptions: any = [
    {
      link: "paperSize",
      name: "Paper Size"
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
    {
      link: "inventory",
      name: "Inventory"
    }
  ]
  flags: any = {
    settingFlag: false,
    processFlag: false,
  };

  toggleDropdown(flagName: string) {
    for (const key in this.flags) {
      if (key !== flagName) {
        this.flags[key] = false;
      }
    }
    this.flags[flagName] = !this.flags[flagName];
  }
}
