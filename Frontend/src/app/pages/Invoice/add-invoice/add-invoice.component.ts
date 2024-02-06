import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
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
import { ProductDefinitionService } from 'src/app/services/product-definition.service';
import { BackendErrorResponse } from 'src/app/Model/BackendErrorResponse';


@Component({
  selector: 'app-add-invoice',
  templateUrl: './add-invoice.component.html',
  styleUrls: ['./add-invoice.component.css']
})
export class AddInvoiceComponent implements OnInit {
  private destroy$ = new Subject<void>();

  minDueDate!: Date;
  send: string = 'Send';
  customerList: Customer[] = [];
  termList: ProductField | undefined | null;
  productServiceList: ProductService[] = [];
  showPrintPreview = false;
  hide: boolean = false;
  idFromQueryParam: number | undefined | null;
  mode: string = 'Save';
  balanceDue: number = 50000.00;
  onlySend: boolean = false;

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

  invoice: Invoice = {
    id: undefined,
    invoiceNo: undefined,
    customer: undefined,
    customerEmail: undefined,
    business: undefined,
    sendLater: undefined,
    billingAddress: undefined,
    terms: undefined,
    invoiceDate: undefined,
    dueDate: undefined,
    invoiceProductDtoList: [{
      id: undefined,
      dateRow: undefined,
      productRow: undefined,
      productName: undefined,
      type: undefined,
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
    private productFieldService: ProductDefinitionService
  ) { }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.ctrlKey && event.key === 'p') {
      this.hide = true;
      this.showPrintPreview = true;
      event.preventDefault();
    }

    if (event.key === 'Escape') {
      this.hide = false;
      this.showPrintPreview = false;
    }
  }


  ngOnInit(): void {
    this.initializeData();
    this.handleQueryParams();
  }

  private initializeData(): void {
    this.getCustomerList();
    this.getProdutList();
  }

  private handleQueryParams(): void {
    this.route.queryParams.pipe(takeUntil(this.destroy$)).subscribe(
      (param) => {
        this.idFromQueryParam = +param['id'] || null;
        this.onlySend = param['send'] || false;
        this.mode = this.idFromQueryParam ? 'Update' : 'Save';

        if (this.onlySend) {
          this.setupViewForSend();
        }
        debugger
        if (this.idFromQueryParam) {
          this.getInvoiceNo();
          this.patchValuesIfNeeded(this.idFromQueryParam);
        } else {
          this.getInvoiceNo();
        }

      },
      (error) => {
        this.errorHandleService.showError(error.error.error);
      }
    );
  }

  private setupViewForSend(): void {
    this.hide = true;
    this.showPrintPreview = true;
  }

  private patchValuesIfNeeded(id: number): void {
    this.patchValues(id);
  }


  addRow() {
    this.invoice.invoiceProductDtoList.push({
      id: undefined,
      dateRow: undefined,
      productRow: undefined,
      productName: undefined,
      type: undefined,
      description: undefined,
      qty: undefined,
      rate: undefined,
      amount: undefined,
      status: undefined,
    });
  }

  removeRow(index: number) {
    if (index !== 0) {
      this.invoice.invoiceProductDtoList.splice(index, 1);
    }
  }

  openPrintPreview() {
    this.hide = true;
    this.showPrintPreview = true;
  }

  getCustomerList() {
    this.customerService.getCustomer().subscribe(
      (res: Customer[]) => {
        this.customerList = res;
      },
      error => {
        this.errorHandleService.showError(error.error.error);
      }
    )
  }

  fillData(selectedCustomer: Customer | number) {
    if (!selectedCustomer) {
      this.clearInvoiceDetails();
    } else {
      const customer = this.getCustomerById(selectedCustomer);
      this.updateInvoiceDetails(customer);
    }
  }

  private clearInvoiceDetails() {
    this.invoice.customerEmail = null;
    this.invoice.billingAddress = null;
    this.invoice.terms = null;
    this.invoice.business = null;
  }

  private getCustomerById(selectedCustomer: Customer | number): Customer | undefined {
    if (!this.idFromQueryParam) {
      return selectedCustomer as Customer;
    } else {
      const customerId = selectedCustomer as number;
      return this.customerList.find(c => c.id === customerId);
    }
  }

  private updateInvoiceDetails(customer?: Customer) {
    this.invoice.customerEmail = customer?.email;
    this.invoice.billingAddress = customer?.billingStreetAddress;
    this.invoice.terms = customer?.terms;
    this.invoice.business = customer?.businessName;
  }

  getProdutList() {
    this.productService.getAllProductService().subscribe(
      (res: ProductService[]) => {
        this.productServiceList = res;
      },
      error => {
        this.errorHandleService.showError(error.error.error);
      }
    )
  }

  submit() {
    this.updateCustomerId();
    this.updateInvoiceProductStatus();

    if (!this.invoice.sendLater && !this.idFromQueryParam) {
      this.openPrintPreview()
    }

    console.log(this.invoice);

    const serviceToCall = this.idFromQueryParam
      ? this.invoiceService.updateInvoice(this.idFromQueryParam, this.invoice)
      : this.invoiceService.postInvoice(this.invoice);

    serviceToCall.subscribe(
      (res: Invoice) => {
        const successMsg = `Invoice NO: ${this.invoice.invoiceNo} is successfully ${this.mode}d.`;
        this.successMsg.showSuccess(successMsg);
        if (!this.showPrintPreview) {
          setTimeout(() => {
            this.router.navigate(['/get-invoices']);
          }, 2000);
        }
      },
      (error: BackendErrorResponse) => {
        this.errorHandleService.showError(error.error.error);
      }
    );
  }

  private updateCustomerId(): void {
    if (this.idFromQueryParam) {
      const customerObj = this.customerList.find((c) => c.id === this.tempCustomer.id);
      this.invoice.customer = customerObj?.id;
    } else {
      this.invoice.customer = this.tempCustomer?.id;
    }
  }

  private updateInvoiceProductStatus(): void {
    this.invoice.invoiceProductDtoList.forEach((invoice: InvoiceProduct) => {
      invoice.status = true;
    });
  }


  patchValues(id: number): void {
    this.invoiceService.getInvoiceById(id).subscribe(
      (res: Invoice) => {

        const customer = this.customerList.find(c => c.id === res.customer as number);
        this.tempCustomer.id = customer?.id;

        this.parseDateFields(res);

        const productList = res.invoiceProductDtoList.filter(
          invoice => invoice.status !== false && invoice.status !== null
        );
        productList.forEach((invoice: InvoiceProduct) => {
          const matchingProduct = this.productServiceList.find((product: ProductService) => product.id === invoice.productRow);

          if (matchingProduct) {
            invoice.productName = matchingProduct.name;
          }
        });

        this.invoice = { ...res, invoiceProductDtoList: productList };

      },
      (error: BackendErrorResponse) => {
        this.errorHandleService.showError(error.error.error);
      }
    );
  }

  private parseDateFields(invoice: Invoice): void {

    const parseDateField = (field: Date | null | undefined) => {
      if (field) {
        return new Date(field);
      }
      return null;
    };

    invoice.invoiceDate = parseDateField(invoice.invoiceDate);
    invoice.dueDate = parseDateField(invoice.dueDate);

    invoice.invoiceProductDtoList.forEach((product: InvoiceProduct) => {
      product.dateRow = parseDateField(product.dateRow);
    });
  }

  AutoFillOthers(productId: number, i: number): void {
    const selectedProduct = this.productServiceList.find(p => p.id === productId);
    const productDto = this.invoice.invoiceProductDtoList![i];

    if (selectedProduct) {
      this.getDataForOtherFields(selectedProduct, productDto);
    } else {
      this.emptyAutoFilledFields(productDto);
    }

    this.calculateAmount(this.invoice, i);
  }

  getDataForOtherFields(selectedProduct: ProductService, productDto: InvoiceProduct) {
    productDto.type = selectedProduct.type;
    productDto.description = selectedProduct.description;
    productDto.productRow = selectedProduct.id;
    productDto.productName = selectedProduct.name;
    productDto.rate = selectedProduct.cost;
  }

  emptyAutoFilledFields(productDto: InvoiceProduct) {
    productDto.type = null;
    productDto.description = null;
    productDto.productRow = null;
    productDto.productName = null;
    productDto.rate = null;
  }

  updateDueDateMinDate() {
    if (this.invoice.invoiceDate) {
      this.minDueDate = new Date(this.invoice.invoiceDate);
    }
  }

  calculateAmount(value: Invoice, i: number) {
    if (this.invoice.invoiceProductDtoList![i].productRow && value.invoiceProductDtoList![i].rate) {
      this.invoice.invoiceProductDtoList![i].amount = value.invoiceProductDtoList![i].qty! * value.invoiceProductDtoList![i].rate!;
    } else {
      this.invoice.invoiceProductDtoList![i].amount = 0;
    }
  }

  generatePdfAndSendToEmail() {
    const printPreviewElement = document.getElementById('print-preview');
    const htmlContent = printPreviewElement!.innerHTML;
    const email = this.invoice.customerEmail;

    this.invoiceService.saveInvoiceAndGeneratePdf(htmlContent, email!).subscribe(
      (res: Blob) => {
        const blob = new Blob([res], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'print.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      },
      error => {

        this.errorHandleService.showError(error.error);
      }
    );
  }

  closeModal() {
    this.showPrintPreview = false;
    this.hide = false;
  }

  getInvoiceNo() {
    const fieldName = "Invoice_No";
    this.productFieldService.searchProductField(fieldName).subscribe(
      (res: any) => {
        debugger
        if (this.mode === "Update") {
          this.invoice.invoiceNo = +(res[0].productFieldValuesList[0].name);
        } else {
          this.getAllInvoices();
        }
      }, error => {
        this.errorHandleService.showError(error.error.error);
      });
  }

  getAllInvoices() {
    this.invoiceService.getAllInvoice().subscribe(
      (res: Invoice[]) => {
        if (res.length > 0) {
          const lastInvoiceNo = res[res.length - 1].invoiceNo;
          this.invoice.invoiceNo = lastInvoiceNo! + 1;
        }
      }, error => {
        this.errorHandleService.showError(error.error.error);
      }
    );
  }

  calculateTotal(): number {
    if (this.invoice?.invoiceProductDtoList) {
      return this.invoice.invoiceProductDtoList.reduce((total, row) => total + row.amount!, 0);
    }
    return 0;
  }

  calculateBalance(): number {
    const receivedAmount = 3000;
    return receivedAmount - this.calculateTotal();
  }

  saveFile() {
    window.print();
  }

}
