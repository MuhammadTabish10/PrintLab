import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
// import { Transactions } from 'src/app/Model/transactions';
import { OrderProcessService } from 'src/app/services/order-process.service';
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


  constructor(
    private orderProcessService: OrderProcessService,
    private route: ActivatedRoute,
    private messageService: MessageService,
    // private pettyCashService: PetyCashService,
    public sessionStorageService: SessionStorageService,
    private userService: UserService
  ) { }

  ngOnInit(): void {
    this.paymentMode = [{ name: 'Cash' }, { name: 'Credit' }];
    this.route.queryParams.subscribe(param => {
      this.idFromQueryParam = +param['id']
    }, error => {
      this.showError(error);
      this.error = true;
    });
    this.getCtpProcess(this.idFromQueryParam, this.ctp);
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
      // this.markAsDone = process.orderTransactions[lastIndex].markAsDone ? process.orderTransactions[lastIndex].markAsDone : false;
      // this.showAccepted = process.orderTransactions[lastIndex].accepted ? process.orderTransactions[lastIndex].accepted : false;
      // this.showRejected = process.orderTransactions[lastIndex].rejected ? process.orderTransactions[lastIndex].rejected : false;
      this.transactions.push(process);
      this.variance = process.unitPrice * process.quantity;
      this.plateDimension = process.plateDimension;
      this.quantity = process.quantity;
      this.amount = process.amount;
      this.unitPrice = process.unitPrice;
    }, error => {
    });
  }

  addCreditOnVendor(order: any): void {
    // this.showAccepted = true;
    // this.showRejected = false;
    this.orderProcessService.addTransaction(order).subscribe(data => {
      this.getCtpProcess(this.idFromQueryParam,this.ctp);
     }, error => { });
  }

  cash(order: any): boolean {
    const lastIndex = order.orderTransactions.length - 1;
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
    debugger
    order["orderTransactions"][lastIndex]["isAccepted"] = true;
    debugger
    this.addUserPetyCash(order);
    return this.options;
  }

  addUserPetyCash(order: any): void {
    // this.showAccepted = true;
    // this.showRejected = false;
    this.orderProcessService.addTransaction(order).subscribe(data => {
      this.getCtpProcess(this.idFromQueryParam, this.ctp);
    }, error => { });
  }

  credit(order: any): boolean {
    const lastIndex = order.orderTransactions.length - 1;
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
    order["orderTransactions"][lastIndex]["isAccepted"] = true;
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
    this.showRejected = true;
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

  markToDone(order: any) {

  }

}
