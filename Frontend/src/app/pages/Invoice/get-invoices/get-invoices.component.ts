import { Component, OnDestroy, OnInit } from '@angular/core';
import { Invoice } from 'src/app/Model/Invoice';
import { InvoiceService } from '../Service/invoice.service';
import { ErrorHandleService } from 'src/app/services/error-handle.service';
import { Router } from '@angular/router';
import { SuccessMessageService } from 'src/app/services/success-message.service';
import { Observable, Subject, catchError, map, of, takeUntil } from 'rxjs';
import { CustomerService } from 'src/app/services/customer.service';
import { Customer } from 'src/app/Model/Customer';
import { BackendErrorResponse } from 'src/app/Model/BackendErrorResponse';

@Component({
  selector: 'app-get-invoices',
  templateUrl: './get-invoices.component.html',
  styleUrls: ['./get-invoices.component.css']
})
export class GetInvoicesComponent implements OnInit, OnDestroy {
  invoiceList: Invoice[] = [];
  customerName: Customer[] = [];
  private destroy$ = new Subject<void>();

  constructor(
    private successMsgService: SuccessMessageService,
    private errorHandleService: ErrorHandleService,
    private customerService: CustomerService,
    private invoiceService: InvoiceService,
    private router: Router,
  ) { }


  ngOnInit(): void {
    this.getInvoiceList();
  }

  getInvoiceList(): void {
    this.invoiceService.getAllInvoice().pipe(takeUntil(this.destroy$)).subscribe(
      (res: Invoice[]) => {
        debugger
        this.invoiceList = res;
        this.invoiceList.forEach((invoice) => {
          this.getCustomerName(+invoice?.customer!);
        })
      },
      (error: any) => this.errorHandleService.showError(error.error.error)
    );
  }


  edit(id: number) {
    this.router.navigate(['/add-invoice'], { queryParams: { id: id } });
  }

  deleteInvoice(invoice: Invoice) {
    debugger
    this.invoiceService.deleteInvoiceById(invoice.id!)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        () => {
          const result = `Invoice ${invoice.invoiceNo} deleted successfully`;
          this.successMsgService.showSuccess(result);
          this.getInvoiceList();
        },
        (error: any) => this.errorHandleService.showError(error.error.error)
      );
  }


  search(invoiceNo: EventTarget | null) {

    if (!(invoiceNo instanceof HTMLInputElement)) {
      return;
    }

    const inputValue = invoiceNo.value.trim();

    if (!inputValue) {
      this.getInvoiceList();
      return;
    }
    this.invoiceService.searchInvoice(inputValue)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (res: Invoice[]) => {
          this.invoiceList = res;
        },
        (error: any) => this.errorHandleService.showError(error.error.error)
      );
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  generatePdfAndSendToEmail(id: number) {
    this.router.navigate(['/add-invoice'], { queryParams: { id: id, send: true } });
  }

  getCustomerName(customerId: number) {
    debugger
    this.customerService.getCustomerById(customerId).subscribe(
      (res: Customer) => {
        this.customerName.push(res);
      }, (error: BackendErrorResponse) => {

      }
    )
  }

}


