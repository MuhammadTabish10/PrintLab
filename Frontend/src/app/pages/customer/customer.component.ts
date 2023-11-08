import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { CustomerService } from 'src/app/services/customer.service';
import { MessageService } from 'primeng/api';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

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
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.getCustomers();
  }

  getCustomers() {

    this.customerService.getCustomer()
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (res: any) => {
          this.customersArray = res as Customer[];
          this.tableData = this.customersArray.length === 0;
        },
        (error: any) => this.showError(error)
      );
  }

  editCustomer(id: number) {
    this.router.navigate(['/addCustomer'], { queryParams: { id: id.toString() } });
  }

  deleteCustomer(id: number) {
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

interface Customer {
  id: number;
  name: string;
  businessName: string;
}
