import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomerService } from 'src/app/services/customer.service';
import { MessageService } from 'primeng/api';
import { Observable, Subject, takeUntil } from 'rxjs';
import { Customer } from "src/app/Model/Customer";
import { DatePipe } from '@angular/common';
import { ProductDefinitionService } from 'src/app/services/product-definition.service';
import { Business, BusinessBranch } from 'src/app/Model/Business';
import { Column } from 'src/app/Model/Column';
import { BackendErrorResponse } from 'src/app/Model/BackendErrorResponse';
import { SuccessMessageService } from 'src/app/services/success-message.service';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/Model/User';

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
    private productFieldService: ProductDefinitionService,
    private customerService: CustomerService,
    private messageService: MessageService,
    private successService: SuccessMessageService,
    private route: ActivatedRoute,
    private userService: UserService,
    private datePipe: DatePipe,
    private router: Router,
  ) { }


  ngOnInit(): void {
    this.getAllCustomers();
    this.getPrimaryPaymentMethod();
    this.getUserList();
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
    // this.customer.parentCustomerId = this.selectedParent ? this.selectedParent.id : null;
    // const formattedDate = this.datePipe.transform(this.customer.asOf, 'yyyy-MM-dd');
    // this.customer.asOf = formattedDate;
    this.customer.customerBusinessName = this.businessList;
    debugger
    this.customer.primaryPaymentMethod = JSON.stringify(this.customer.primaryPaymentMethod);
    const validated = this.validateEmail(this.customer.email)
    if (validated) {
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
  }
  validateEmail(email: string | null | undefined): Boolean {
    if (email && !email.match(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)) {
      this.error = "Invalid Email Address";
      this.showError('Please enter a valid email address');
      return false;
    }
    this.error = "Valid";
    return true;
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
        // this.customerArray = res.filter(customer => customer.parentCustomerId !== this.idFromQueryParam && customer.parentCustomerId !== null);
        // this.customerArray = res.filter(customer => customer.id !== this.idFromQueryParam);
        // const check = this.customerArray.filter(customer => customer.parentCustomerId === this.idFromQueryParam);
        // this.customerArray = this.customerArray.filter(customer => !check.includes(customer));
      }, error => {
      })
  }

  patchCustomer(): void {
    if (this.idFromQueryParam) {
      this.customerService.getCustomerById(this.idFromQueryParam).subscribe(
        (res: Customer) => {
          this.customer = res;
          debugger
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

          this.customer.since = new Date(this.customer.since!);
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
  }



  sameAs() {
    // if (this.customer.sameAsBilling) {
    //   this.customer.shippingStreetAddress = this.customer.notes;
    //   this.customer.shippingCity = this.customer.billingCity;
    //   this.customer.shippingProvince = this.customer.billingProvince;
    //   this.customer.shippingPostalCode = this.customer.billingPostalCode;
    //   this.customer.shippingCountry = this.customer.billingCountry;
    // } else {

    //   this.customer.shippingStreetAddress = null;
    //   this.customer.shippingCity = null;
    //   this.customer.shippingProvince = null;
    //   this.customer.shippingPostalCode = null;
    //   this.customer.shippingCountry = null;
    // }
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
  clear() {
    // if (!this.customer.subCustomer) {
    //   this.selectedParent = null;
    //   this.customer.billParentCustomer = null;
    // }
  }

  showModal(branch?: BusinessBranch, business?: Business, id?: number): void {
    this.visible = true;

    if (business && business.id) {
      this.business = business;
      this.mode = 'Update';
      this.heading = 'Branch';

      if (branch) {
        this.copyBranchData(branch);
      }
    }
    if (id) {
      this.name = business?.businessName;
      this.mode = 'Business';
      this.heading = 'Business';
    }
  }

  private copyBranchData(branch: BusinessBranch): void {
    this.branch.pointOfContact = branch.pointOfContact;
    this.branch.phoneNumber = branch.phoneNumber;
    this.branch.branchName = branch.branchName;
    this.branch.address = branch.address;
    this.branch.city = branch.city;
    this.branch.id = branch.id;
  }



  deleteBranchById(id: number): void {
    this.businessList.forEach(business => {
      debugger
      const branchIndexToRemove = business.businessBranchList?.findIndex(branch => branch.id === id);
      if (branchIndexToRemove !== undefined && branchIndexToRemove !== -1) {
        business.businessBranchList?.splice(branchIndexToRemove, 1);
      }
    });
  }
  deleteBusiness(id: number): void {
    debugger
    const index = this.businessList.findIndex(business => business.id === id);
    if (index) {
      this.businessList?.splice(index, 1);
    }
  }

  addToList(): void {
    debugger
    if (this.mode === 'Business' && this.name) {
      // Find the highest existing id
      let maxId = 0;
      this.businessList.forEach(business => {
        if (business.id && business.id > maxId) {
          maxId = business.id;
        }
      });

      // Increment the maxId to get a new unique id
      const newId = maxId + 1;

      // Push the new business object to the businessList
      this.businessList.push({
        id: newId,
        businessName: this.name,
        businessBranchList: []
      });
    } else {
      if (this.business) {
        if (this.branch) {
          // Check if the branch to be edited exists
          const branchIndex = this.business.businessBranchList?.findIndex(branch => branch.id === this.branch.id);

          if (branchIndex !== -1) {
            // Update the properties of the existing branch
            const tempBranch = {
              ...this.branch // Copy branch properties
            };
            this.business.businessBranchList![branchIndex!] = tempBranch;
          } else {
            // Increment the id of each branch in businessBranchList
            this.business.businessBranchList?.forEach(branch => {
              if (branch.id) {
                branch.id++;
              }
            });

            // Push the new branch object to the businessBranchList of the selected business
            this.business.businessBranchList?.push({
              ...this.branch, // Copy branch properties
              id: this.business.businessBranchList.length + 1 // Assign a new id
            });
          }
        }
      }
    }

    this.cols = [
      { field: 'branchName', header: 'Name' },
      { field: 'address', header: 'Address' },
      { field: 'city', header: 'City' },
      { field: 'pointOfContact', header: 'Point Of Contact' },
      { field: 'phoneNumber', header: 'Contact' },
    ];
    this.visible = false;
    this.mode = 'Business';
    this.heading = 'Business';
    const indexOfUpdatedBusiness = this.businessList.findIndex(business => business.id === this.business.id);
    this.openTabIndex = [indexOfUpdatedBusiness];
    this.name = null;
    this.business = {
      id: null,
      businessName: null,
      businessBranchList: undefined,
    }
    this.branch = {
      id: null,
      branchName: null,
      address: null,
      city: null,
      pointOfContact: null,
      phoneNumber: null,
    }
  }

  onModalClose(): void {
    this.mode = 'Business';
    this.heading = 'Business';
    this.business = {
      id: null,
      businessName: null,
      businessBranchList: undefined,
    }
    this.branch = {
      id: null,
      branchName: null,
      address: null,
      city: null,
      pointOfContact: null,
      phoneNumber: null,
    }
  }

  onToastClose() {
    this.messageService.clear();
  }
  private getUserList() {
    this.userService.getUsers().subscribe((users: User[]) => {
      this.userList = users.filter(user => this.hasUserRole(user, 'ROLE_USER'));
      debugger;
    }, (error: BackendErrorResponse) => {
      this.showError(error.error.error);
    });
  }

  // Function to check if a user has a specific role
  private hasUserRole(user: User, role: string): boolean | undefined {
    return user.roles?.some(userRole => userRole.name === role);
  }

}
