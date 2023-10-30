import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomerService } from 'src/app/services/customer.service';
import { MessageService } from 'primeng/api';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-add-customer',
  templateUrl: './add-customer.component.html',
  styleUrls: ['./add-customer.component.css']
})
export class AddCustomerComponent implements OnInit {
  buttonName: string = 'Add';
  nameValue: string = '';
  businessValue: string = '';
  statusFlag: boolean = true;
  status: string = 'Active';
  idFromQueryParam!: number;
  customerToUpdate: any = [];
  error: string = '';
  visible: boolean = false;

  private destroy$ = new Subject<void>();
  
  constructor(
    private customerService: CustomerService,
    private route: ActivatedRoute,
    private router: Router,
    private messageService: MessageService
  ) { }


  ngOnInit(): void {
    this.route.queryParams.pipe(takeUntil(this.destroy$)).subscribe(param => {
      this.idFromQueryParam = +param['id'] || 0;
      this.buttonName = this.idFromQueryParam ? 'Update' : 'Add';
      
      if (this.idFromQueryParam) {
        this.customerService.getCustomerById(this.idFromQueryParam).subscribe(
          (res: any) => {
            this.customerToUpdate = res;
            this.nameValue = this.customerToUpdate.name;
            this.businessValue = this.customerToUpdate.businessName;
            this.status = this.customerToUpdate.status;
            this.statusFlag = this.status === 'Active';
          },
          (error: any) => {
            this.showError(error);
            this.visible = true;
          }
        );
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }



  addCustomer() {
    const obj = {
      name: this.nameValue,
      businessName: this.businessValue,
      status: this.status
    };
    
    const request = this.idFromQueryParam ?
    this.customerService.updateCustomer(this.idFromQueryParam, obj) :
    this.customerService.postCustomer(obj);

    request.pipe(takeUntil(this.destroy$)).subscribe(
      () => this.router.navigateByUrl('/customers'),
      (error: any) => {
        this.showError(error);
        this.visible = true;
      }
    );
  }


  getStatusValue() {
    this.statusFlag = !this.statusFlag;
    this.status = this.statusFlag ? 'Active' : 'Inactive';
  }

  showError(error:any) {
    this.messageService.add({ severity: 'error', summary: 'Error', detail: error.error.error }); 
  }

}
