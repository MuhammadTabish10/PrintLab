import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomerService } from 'src/app/services/customer.service';
import { MessageService } from 'primeng/api';
import { Subject, takeUntil } from 'rxjs';
import { Customer } from "src/app/Model/Customer";
import { DatePipe } from '@angular/common';
import { ProductDefinitionService } from 'src/app/services/product-definition.service';

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
  isASubCustomer: boolean = false;
  customerArrayOnAdd!: Customer[]
  customer: Customer = {
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
  };
  customerArray!: Customer[];
  productField: any[] = [];

  private destroy$ = new Subject<void>();

  asOf: any;
  parentName: any;
  term: any[] = [];
  tax: any[] = [];
  selectedParent: any;

  constructor(
    private customerService: CustomerService,
    private route: ActivatedRoute,
    private router: Router,
    private messageService: MessageService,
    private datePipe: DatePipe,
    private productFieldService: ProductDefinitionService
  ) { }


  ngOnInit(): void {
    this.getAllCustomers();
    this.getPrimaryPaymentMethod();
    this.getTerms();
    this.getTax();
    this.route.queryParams.pipe(takeUntil(this.destroy$)).subscribe(param => {
      this.idFromQueryParam = +param['id'] || 0;
      this.buttonName = this.idFromQueryParam ? 'Update' : 'Save';
      this.patchCustomer();
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  addCustomer() {
    // if (this.idFromQueryParam) {
    //   this.customer.parentCustomerId = this.parentId;
    // }
    this.customer.parentCustomerId = this.selectedParent.id
    
    const request = this.idFromQueryParam ?
      this.customerService.updateCustomer(this.idFromQueryParam, this.customer) :
      this.customerService.postCustomer(this.customer);

    request.pipe(takeUntil(this.destroy$)).subscribe(
      () => this.router.navigateByUrl('/customers'),
      (error: any) => {
        this.showError(error.error.error);
        this.visible = true;
      }
    );
  }


  getStatusValue() {
    this.statusFlag = !this.statusFlag;
    this.status = this.statusFlag ? 'Active' : 'Inactive';
  }

  showError(error: string) {
    this.messageService.add({ severity: 'error', summary: 'Error', detail: error });
  }

  getAllCustomers(): void {
    this.customerService.getCustomer().subscribe(
      (res: Customer[]) => {
        // if (this.idFromQueryParam) {
        
        this.customerArray = res.filter(customer => customer.parentCustomerId !== this.idFromQueryParam && customer.parentCustomerId !== null);
        this.customerArray = res.filter(customer => customer.id !== this.idFromQueryParam);
        const check = this.customerArray.filter(customer => customer.parentCustomerId === this.idFromQueryParam);
        this.customerArray = this.customerArray.filter(customer => !check.includes(customer));
        // } else {
        //   this.customerArrayOnAdd = res;
        // }
      }, error => {
      })
  }

  patchCustomer(): void {
    if (this.idFromQueryParam) {
      this.customerService.getCustomerById(this.idFromQueryParam).subscribe(
        (res: Customer) => {
          this.customer = res;
          this.selectedParent = this.customerArray.find(customerArray => customerArray.id === this.customer.parentCustomerId);
          if (this.customer && this.customer.asOf) {
            const dateObject = this.customer.asOf;
            const datePipe = new DatePipe('en-US');
            const formattedDate = datePipe.transform(dateObject, 'yyyy-MM-dd');
            const asOfDate = formattedDate ? new Date(formattedDate) : undefined;
            this.customer.asOf = asOfDate;
          } else {
            console.error('Invalid date');
          }
        }, error => {
          this.showError(error.error.error);
        });
    }
  }
  // parentCustomer(parentId: any) {

  //   if (this.idFromQueryParam) {
  //     this.customer.parentCustomerId = null;
  //     this.parentId = parentId.id;
  //   } else {
  //     this.customer.parentCustomerId = parentId.id;
  //   }
  // }
  sameAs() {
    if (this.customer.sameAsBilling) {
      this.customer.shippingStreetAddress = this.customer.billingStreetAddress;
      this.customer.shippingCity = this.customer.billingCity;
      this.customer.shippingProvince = this.customer.billingProvince;
      this.customer.shippingPostalCode = this.customer.billingPostalCode;
      this.customer.shippingCountry = this.customer.billingCountry;
    } else {

      this.customer.shippingStreetAddress = null;
      this.customer.shippingCity = null;
      this.customer.shippingProvince = null;
      this.customer.shippingPostalCode = null;
      this.customer.shippingCountry = null;
    }
  }

  getPrimaryPaymentMethod() {
    this.productFieldService.searchProductField("Customer Primary Payment Method").subscribe(
      (res: any) => {
        this.productField = res;
        
      }, error => {
      }
    )
  }
  getTerms() {
    this.productFieldService.searchProductField("Customer Term").subscribe(
      (res: any) => {
        this.term = res;
        
      }, error => {
      }
    )
  }
  getTax() {
    this.productFieldService.searchProductField("Customer Tax").subscribe(
      (res: any) => {
        this.tax = res;
        
      }, error => {
      }
    )
  }
}
