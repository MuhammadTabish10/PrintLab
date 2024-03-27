import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Subject, takeUntil } from 'rxjs';
import { Business, BusinessBranch } from 'src/app/Model/Business';
import { Column } from 'src/app/Model/Column';
import { Customer } from 'src/app/Model/Customer';
import { User } from 'src/app/Model/User';
import { CustomerService } from 'src/app/services/customer.service';

@Component({
  selector: 'app-view-customer',
  templateUrl: './view-customer.component.html',
  styleUrls: ['./view-customer.component.css']
})
export class ViewCustomerComponent implements OnInit {
  buttonName: string = 'Add';
  nameValue: string = '';
  businessValue: string = '';
  statusFlag: boolean = true;
  status: string = 'Active';
  customerId: number | null | undefined;
  customerToUpdate: any = [];
  error: string = '';
  visible: boolean = false;
  isASubCustomer: boolean = false;
  customerArrayOnAdd!: Customer[]
  customer: Customer = {
    id: undefined,
    name: undefined,
    email: undefined,
    whatsApp: undefined,
    showLead: false,
    since: undefined,
    leadOwner: undefined,
    clientStatus: false,
    mobileNo: undefined,
    createdAt: undefined,
    customerBusinessName: [],
    notes: undefined,
    clientPreferred: undefined,
    primaryPaymentMethod: [],
    terms: undefined,
    tax: undefined,
    status: undefined,
    statusId: undefined
  };
  customerArray!: Customer[];
  productField: any[] = [];

  private destroy$ = new Subject<void>();

  asOf: any;
  parentName: any;
  term: any[] = [];
  tax: any[] = [];
  selectedParent: any;
  businessList: Business[] = [];
  openTabIndex: number | number[] | null | undefined;
  cols!: Column[];
  business: Business = {
    businessName: null,
    id: null,
  }
  branch: BusinessBranch = {
    pointOfContact: undefined,
    branchName: undefined,
    phoneNumber: undefined,
    address: undefined,
    city: undefined,
    id: undefined,
  }

  name: string | undefined | null;

  mode: string = 'Business';

  heading: string = 'Business';
  userList: User[] = [];
  constructor(
    private customerService: CustomerService,
    private msgService: MessageService,
    private route: ActivatedRoute,
  ) { }
  ngOnInit(): void {
    this.route.queryParams.pipe(takeUntil(this.destroy$)).subscribe(param => {
      this.customerId = +param['id'];
      this.patchCustomer(this.customerId);
    });
  }

  patchCustomer(id: number): void {
    this.customerService.getCustomerById(id).subscribe(
      (res: Customer) => {
        this.customer = res;
        this.customer.since = new Date(this.customer.since!);
        if (this.customer.primaryPaymentMethod && typeof this.customer.primaryPaymentMethod === 'string') {
          try {
            const parsedArray = JSON.parse(this.customer.primaryPaymentMethod);
            if (Array.isArray(parsedArray)) {
              this.customer.primaryPaymentMethod = parsedArray;
            } else {
              console.error('primaryPaymentMethod is not a valid JSON array:', parsedArray);
            }
          } catch (e) {
            console.error('Error parsing primaryPaymentMethod:', e);
          }
        }
        debugger
        this.businessList = this.customer.customerBusinessName;
        this.cols = [
          { field: 'branchName', header: 'Name' },
          { field: 'address', header: 'Address' },
          { field: 'city', header: 'City' },
          { field: 'pointOfContact', header: 'Point Of Contact' },
          { field: 'phoneNumber', header: 'Contact' },
        ];
        debugger
      }, error => {
        this.showError(error.error.error);
      });
  }

  showError(error: string) {
    this.msgService.add({ severity: 'error', summary: 'Error', detail: error });
  }
}
