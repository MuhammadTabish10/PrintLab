import { Component, HostListener, OnInit } from '@angular/core';
import { Customer } from 'src/app/Model/Customer';
import { Invoice, InvoiceProduct } from 'src/app/Model/Invoice';
import { ProductField } from 'src/app/Model/ProductField';
import { CustomerService } from 'src/app/services/customer.service';
import { ErrorHandleService } from 'src/app/services/error-handle.service';
import { SuccessMessageService } from 'src/app/services/success-message.service';
import { ServiceService } from '../../Product/Service/service.service';
import { ProductService } from 'src/app/Model/ProductService';
import { InvoiceService } from '../Service/invoice.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';


@Component({
  selector: 'app-add-invoice',
  templateUrl: './add-invoice.component.html',
  styleUrls: ['./add-invoice.component.css']
})
export class AddInvoiceComponent implements OnInit {
  private destroy$ = new Subject<void>();

  minDueDate!: Date;
  customerList: any[] = [];
  tempCustomer: Customer = {
    id: undefined,
    title: undefined,
    name: undefined,
    middleName: undefined,
    lastName: undefined,
    email: undefined,
    phoneNo: undefined,
    mobileNo: undefined,
    website: undefined,
    createdAt: undefined,
    businessName: undefined,
    subCustomer: false,
    billParentCustomer: false,
    parentCustomerId: undefined,
    billingStreetAddress: undefined,
    billingCity: undefined,
    billingProvince: undefined,
    billingPostalCode: undefined,
    billingCountry: undefined,
    sameAsBilling: false,
    shippingStreetAddress: undefined,
    shippingCity: undefined,
    shippingProvince: undefined,
    shippingPostalCode: undefined,
    shippingCountry: undefined,
    openingBalance: undefined,
    asOf: undefined,
    primaryPaymentMethod: undefined,
    terms: undefined,
    tax: undefined,
    status: undefined,
  }
  termList: ProductField | undefined | null;
  productServiceList: any[] = [];
  showPrintPreview = false;
  hide: boolean = false;
  idFromQueryParam: number | undefined | null;
  mode: string = 'Save';
  rows: InvoiceProduct[] = [
    {
      id: undefined,
      dateRow: undefined,
      productRow: undefined,
      description: undefined,
      qty: undefined,
      rate: undefined,
      amount: undefined,
      status: undefined,
    }
  ];
  invoice: Invoice = {
    id: undefined,
    invoiceNo: undefined,
    customer: undefined,
    customerEmail: undefined,
    sendLater: undefined,
    billingAddress: undefined,
    terms: undefined,
    invoiceDate: undefined,
    dueDate: undefined,
    invoiceProductDtoList: [{
      id: undefined,
      dateRow: undefined,
      productRow: undefined,
      description: undefined,
      qty: undefined,
      rate: undefined,
      amount: undefined,
      status: undefined,
    }],
    message: undefined,
    statement: undefined,
    status: undefined,
  };

  constructor(
    private errorHandleService: ErrorHandleService,
    private successMsg: SuccessMessageService,
    private customerService: CustomerService,
    private productService: ServiceService,
    private invoiceService: InvoiceService,
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.ctrlKey && event.key === 'p') {
      this.hide = true;
      this.openPrintPreview();
    }
  }

  ngOnInit(): void {
    this.getCustomerList();
    this.getProdutList();
    this.route.queryParams.pipe(takeUntil(this.destroy$)).subscribe(param => {
      this.idFromQueryParam = +param['id'] || null;
      this.mode = this.idFromQueryParam ? 'Update' : 'Save';
      if (this.idFromQueryParam) {
        this.patchValues(this.idFromQueryParam);
      }
    });
  }

  addRow() {
    debugger
    this.invoice.invoiceProductDtoList.push({
      id: undefined,
      dateRow: undefined,
      productRow: undefined,
      description: undefined,
      qty: undefined,
      rate: undefined,
      amount: undefined,
      status: undefined,
    });
  }

  removeRow(index: number) {
    debugger
    if (index !== 0) {
      this.invoice.invoiceProductDtoList.splice(index, 1);
    }
  }

  openPrintPreview() {
    this.hide = true;
    this.showPrintPreview = true;
    window.addEventListener('afterprint', () => {
      this.hide = false;
      this.showPrintPreview = false;
    });
    setTimeout(() => {
      window.print();
    }, 100);
  }

  getCustomerList() {
    this.customerService.getCustomer().subscribe(
      (res: Customer[]) => {
        this.customerList = res;
      },
      error => {
      }
    )
  }
  fillData(customer: Customer) {
    if (!this.idFromQueryParam) {
      this.invoice.customerEmail = customer.email;
      this.invoice.billingAddress = customer.billingStreetAddress;
      this.invoice.terms = customer.terms;
    } else {
      debugger
      customer = this.customerList.find(c => c.id === customer);
      this.invoice.customerEmail = customer.email;
      this.invoice.billingAddress = customer.billingStreetAddress;
      this.invoice.terms = customer.terms;
    }
  }
  getProdutList() {
    this.productService.getAllProductService().subscribe(
      (res: ProductService[]) => {
        this.productServiceList = res;
      },
      error => { }
    )
  }

  submit() {
    if (!this.idFromQueryParam) {
      this.invoice.customer = this.tempCustomer.name;
    } else {
      const customerObj = this.customerList.find(c => c.id === this.tempCustomer);
      this.invoice.customer = customerObj.name;
    }
    this.invoice.invoiceProductDtoList.forEach((invoice => {
      invoice.status = true;
    }));
    console.log(this.invoice);
    const serviceToCall = !this.idFromQueryParam ? this.invoiceService.postInvoice(this.invoice)
      : this.invoiceService.updateInvoice(this.idFromQueryParam, this.invoice);
    debugger
    serviceToCall.subscribe(
      (res: Invoice) => {
        const successMsg = `Invoice NO: ${this.invoice.invoiceNo} is successfully ${this.mode}d.`;
        this.successMsg.showSuccess(successMsg);
        setTimeout(() => {
          this.router.navigate(['/get-invoices']);
        }, 2000);
      }, error => {
        if (error.status === 400) {
          this.errorHandleService.showError("Bad Request. Please check your inputs.");
        } else {
          this.errorHandleService.showError(error.error.error);
        }
      }
    );
  }

  patchValues(id: number): void {
    debugger
    this.invoiceService.getInvoiceById(id).subscribe(
      (res: Invoice) => {
        const customer = this.customerList.find(c => c.name === res.customer);
        debugger
        this.tempCustomer = customer.id;
        if (res.invoiceDate) {
          res.invoiceDate = new Date(res.invoiceDate);
        }

        if (res.dueDate) {
          res.dueDate = new Date(res.dueDate);
        }
        res.invoiceProductDtoList.forEach((product: InvoiceProduct) => {
          if (product.dateRow) {
            product.dateRow = new Date(product.dateRow);
          }
        });
        this.invoice = res;
        const productList = res.invoiceProductDtoList.filter(
          invoice => invoice.status !== false && invoice.status !== null
        );
        this.invoice.invoiceProductDtoList = productList;
      }, error => {
        this.errorHandleService.showError(error.error.error);
      });
  }
  getDesc(product: ProductService, i: number) {
    product = this.productServiceList.find(p => p.name === product);
    if (product.description) {
      this.invoice.invoiceProductDtoList![i].description = product.description;
      this.invoice.invoiceProductDtoList![i].productRow = product.name;
    }
  }

  updateDueDateMinDate() {
    if (this.invoice.invoiceDate) {
      this.minDueDate = new Date(this.invoice.invoiceDate);
    }
  }

  calculateAmount(value: Invoice, i: number) {
    debugger
    if (value.invoiceProductDtoList![i].qty && value.invoiceProductDtoList![i].rate) {
      this.invoice.invoiceProductDtoList![i].amount = value.invoiceProductDtoList![i].qty! * value.invoiceProductDtoList![i].rate!;
    } else {
      this.invoice.invoiceProductDtoList![i].amount = 0;
    }
  }
}
