import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SessionStorageService } from 'src/app/session-storage.service';

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {

    permissions1!: String[]

    constructor(private router: Router, public sessionStorageService: SessionStorageService) {

    }

    ngOnInit(): void {

    }

    dashboard() {
        this.router.navigateByUrl('/dashboard');
    }
    products() {
        this.router.navigateByUrl('/products');
    }
    customer() {
        this.router.navigateByUrl('/customers');
    }

    order() {
        this.router.navigateByUrl('/orders');
    }
    addProduct() {
        this.router.navigateByUrl('/addProduct');
    }
    calculator() {
        this.router.navigateByUrl('/calculator');
    }
    permission() {
        this.router.navigateByUrl('/permission');
    }
    region() {
        this.router.navigateByUrl('region/view')
    }
    salesReports() {
        this.router.navigateByUrl('reports')
    }
    permissions() {
        this.router.navigateByUrl('permissions')
    }
    sheetHistory() {
        this.router.navigateByUrl('sheetHistory')
    }

    // options: any = [
    //     {
    //         link: "dashboard",
    //         icon: "fa fa-home fa-2x",
    //         name: "Dashboard"
    //     },
    //     {
    //         link: "products",
    //         icon: "fa fa-shopping-bag fa-2x",
    //         name: "Products"
    //     },
    //     {
    //         link: "customers",
    //         icon: "fa fa-user fa-2x",
    //         name: "Customers"
    //     },
    //     {
    //         link: "orders",
    //         icon: "fa fa-shopping-cart fa-2x",
    //         name: "Orders"
    //     },
    //     {
    //         link: "addProduct",
    //         icon: "fa fa-add fa-2x",
    //         name: "Add Product"
    //     },
    //     {
    //         link: "calculator",
    //         icon: "fa fa-calculator",
    //         name: "Calculator"
    //     },
    //     {
    //         link: "permission",
    //         icon: "fa fa-plus",
    //         name: "Permissions"
    //     }
    // ]
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
        {
            link: "ctp",
            name: "CTP"
        },
        {
            link: "inventory",
            name: "Inventory"
        }
    ]
    settingFlag: boolean = false

    toggleSettings() {
        this.settingFlag = !this.settingFlag
    }

}
