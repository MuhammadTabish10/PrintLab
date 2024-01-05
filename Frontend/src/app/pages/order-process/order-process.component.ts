import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
// import { Transactions } from 'src/app/Model/transactions';
import { OrderProcessService } from 'src/app/services/order-process.service';
import { OrdersService } from 'src/app/services/orders.service';
import { ProductRuleService } from 'src/app/services/product-rule.service';
// import { PetyCashService } from 'src/app/services/pety-cash.service';
import { SessionStorageService } from 'src/app/services/session-storage.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-order-process',
  templateUrl: './order-process.component.html',
  styleUrls: ['./order-process.component.css']
})
export class OrderProcessComponent implements OnInit {

  transactions: any = [];
  plateDimension: string = '';
  vendor: string = '';
  quantity: number = 0;
  unitPrice: number = 0;
  amount: number = 0;
  paymentMode: any;
  visible: boolean = false;
  tID!: number
  showRejected: boolean = false;
  showAccepted: boolean = false;
  options: boolean = false;
  idFromQueryParam: number = 0;
  error: boolean = false;
  ctp: string = 'CTP';
  variance: number = 0;
  selectedMode: any
  selectedVendor: any
  users: any;
  selectedUser: any;
  markAsDone: boolean = false;

  // History

  order: any
  size: any;
  productRule: any;
  gsm: any;
  material: string[] = [];



  constructor(
    private orderProcessService: OrderProcessService,
    private route: ActivatedRoute,
    private messageService: MessageService,
    public sessionStorageService: SessionStorageService,
    private userService: UserService,
    private orderService: OrdersService,
    private productRuleService: ProductRuleService
  ) { }

  ngOnInit(): void {
    this.paymentMode = [{ name: 'Cash' }, { name: 'Credit' }];
    this.route.queryParams.subscribe(param => {
      this.idFromQueryParam = +param['id']
      this.getOrderById()
    }, error => {
      this.showError(error);
      this.error = true;
    });
    this.getAllUsers();
  }

  getAllUsers(): void {
    this.userService.getUsers().subscribe(users => {
      this.users = users;
    }, error => { });
  }
  getCtpProcess(orderId: number, ctp: string) {
    this.transactions = [];
    this.orderProcessService.getOrderProcess(orderId, ctp).subscribe((process: any) => {
      const lastIndex = process.orderTransactions.length - 1;
      this.showAccepted = process?.orderTransactions[lastIndex]?.isAccepted ? process?.orderTransactions[lastIndex]?.isAccepted : false;
      this.showRejected = process?.isRejected ? process?.isRejected : false;
      this.markAsDone = process.markAsDone;
      this.transactions.push(process);
      this.variance = process.unitPrice * process.quantity;
      this.plateDimension = process.plateDimension;
      this.quantity = process.quantity;
      this.amount = process.amount;
      this.unitPrice = process.unitPrice;
      debugger
    }, error => {
    });
  }

  addCreditOnVendor(order: any): void {
    // this.showAccepted = true;
    // this.showRejected = false;
    this.orderProcessService.addTransaction(order).subscribe(data => {
      this.getCtpProcess(this.idFromQueryParam, this.ctp);
    }, error => { });
  }

  cash(order: any): boolean {
    this.options = false;
    order["paymentMode"] = "Cash";
    order["order"] = {
      id: this.idFromQueryParam
    };
    if (order && order.vendor) {
      const vendorValue = order.vendor.name;
      delete order.vendor;
      order['vendor'] = vendorValue;
    }
    
    this.addUserPetyCash(order);
    return this.options;
  }

  addUserPetyCash(order: any): void {
    this.orderProcessService.addTransaction(order).subscribe(data => {
      this.getCtpProcess(this.idFromQueryParam, this.ctp);
    }, error => { });
  }

  credit(order: any): boolean {
    this.options = false;
    order["paymentMode"] = "Credit";
    order["order"] = {
      id: this.idFromQueryParam
    };
    if (order && order.vendor) {
      const vendorValue = order.vendor.name;
      delete order.vendor;
      order['vendor'] = vendorValue;
    }
    this.addCreditOnVendor(order);
    return this.options;
  }

  addToTransaction(): void {
    this.showRejected = false;
    this.showAccepted = true;
    let orderObj = {
      plateDimension: this.plateDimension,
      vendor: this.selectedVendor.vendor.name,
      quantity: this.quantity,
      unitPrice: this.unitPrice,
      amount: this.amount,
      markAsDone: this.markAsDone,
      accepted: this.showAccepted,
      rejected: this.showRejected,
      paymentMode: this.selectedMode.name,
      user: { id: this.selectedUser?.id },
      order: {
        id: this.idFromQueryParam
      }
    }
    this.orderProcessService.addTransaction(orderObj).subscribe(transaction => {
      this.getCtpProcess(this.idFromQueryParam, this.ctp);
    }, error => {

    });
  }

  reject(): boolean {
    this.orderProcessService.rejectOrder(this.idFromQueryParam, this.ctp, true).subscribe(res => {
      this.getCtpProcess(this.idFromQueryParam, this.ctp);
    }, error => { });
    return this.showRejected;
  }

  showDialog(): boolean {
    this.visible = true;
    return this.visible;
  }

  close(): boolean {
    this.addToTransaction();
    this.visible = false;
    return this.visible;
  }

  creditOrCash(): boolean {
    this.options = true;
    return this.options;
  }

  showError(error: any) {
    this.messageService.add({ severity: 'error', summary: 'Error', detail: error.error.error });
  }

  markToDone() {
    this.orderProcessService.markCtpAsDone(this.idFromQueryParam, this.markAsDone).subscribe(res => {
      
      this.getCtpProcess(this.idFromQueryParam, this.ctp);
    }, error => {
      this.showError(error);
    });
  }

  getOrderById() {
    this.orderService.getOrderById(this.idFromQueryParam).subscribe(res => {
      this.order = res
      this.size = JSON.parse(this.order.size);
      this.getProductRuleById(this.order.productRule);
    }, error => {
      this.showError(error);
      this.visible = true
    })
  }
  getProductRuleById(id: number) {
    this.productRuleService.getProductRuleById(id).subscribe(res => {
      this.getCtpProcess(this.idFromQueryParam, this.ctp);
      this.productRule = res;
      this.productRule.ctp.vendor.vendorProcessList.forEach((element: any) => {
        this.material.push(element.materialType);
      });

    }, error => { });
  }

  getFormattedMaterials(): string {
    return this.material
      .filter(material => material !== null)
      .join(', ');
  }
}
