import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { CustomerService } from 'src/app/services/customer.service';
import { MessageService } from 'primeng/api';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Customer } from "src/app/Model/Customer";
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css']
})

export class CustomerComponent implements OnInit, OnDestroy {
  visible: boolean = false;
  error: string = '';
  tableData: boolean = true;
  customersArray: Customer[] = [];
  search: string = '';

  private destroy$ = new Subject<void>();

  constructor(
    private customerService: CustomerService,
    private router: Router,
    private messageService: MessageService,
    private datePipe: DatePipe
  ) { }

  ngOnInit(): void {
    this.getCustomers();
  }

  getCustomers(): void {

    this.customerService.getCustomer()
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (res: Customer[]) => {
          this.customersArray = res;
          this.customersArray.forEach((el: any) => {
            const dateArray = el.createdAt;
            const [year, month, day] = dateArray;
            el.createdAt = this.datePipe.transform(new Date(year, month - 1, day), 'EEEE, MMMM d, yyyy');
          });
          this.tableData = this.customersArray.length === 0;
        },
        (error: any) => this.showError(error)
      );
  }

  editCustomer(id: number | undefined | null) {
    this.router.navigate(['/addCustomer'], { queryParams: { id: id!.toString() } });
  }

  deleteCustomer(id: number | undefined | null) {
    this.customerService.deleteCustomer(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        () => this.getCustomers(),
        (error: any) => this.showError(error)
      );
  }

  searchCustomer(name: any) {
    if (!name.value) {
      this.getCustomers();
    } else {
      this.customerService.searchCustomer(name.value)
        .pipe(takeUntil(this.destroy$))
        .subscribe(
          (res: any) => {

            this.customersArray = res as Customer[];
            this.tableData = this.customersArray.length === 0;
          },
          (error: any) => this.showError(error)
        );
    }
  }

  showError(error: any) {
    this.messageService.add({ severity: 'error', summary: 'Error', detail: error.error.error });
    this.visible = true;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}


