import { BackendErrorResponse } from 'src/app/Model/BackendErrorResponse';
import { RequestBodyCustomer } from './../RequestBody';
import { Component, Input, OnInit } from '@angular/core';
import { Business, BusinessBranch } from 'src/app/Model/Business';
import { Column } from 'src/app/Model/Column';
import { Customer } from 'src/app/Model/Customer';
import { CustomerService } from 'src/app/services/customer.service';
import { ErrorHandleService } from 'src/app/services/error-handle.service';
import { ActivatedRoute, Params } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { SuccessMessageService } from 'src/app/services/success-message.service';


@Component({
  selector: 'app-add-customer-businesses',
  templateUrl: './add-customer-businesses.component.html',
  styleUrls: ['./add-customer-businesses.component.css']
})
export class AddCustomerBusinessesComponent implements OnInit {
  customer: Customer = { ...RequestBodyCustomer.class }
  visible: boolean = false;
  mode: string = "Business";
  heading: string = "Business";
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
  name: string | null | undefined;
  businessList: Business[] = [];
  openTabIndex: number | number[] | null | undefined;
  cols!: Column[];
  customerId: number | undefined | null;
  private destroy$ = new Subject<void>();
  buttonName: string = 'Save';

  constructor(
    private successMsgService: SuccessMessageService,
    private errorHandleService: ErrorHandleService,
    private customerService: CustomerService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.accessParams();
  }

  private accessParams() {
    this.route.queryParams.subscribe(
      (params: Params) => {
        this.customerId = +params['id'];
        this.getCustomerById(this.customerId);
      })
  }

  private getCustomerById(id: number) {
    this.customerService.getCustomerById(id).subscribe(
      (res: Customer) => {
        this.customer = res;
        this.businessList = this.customer.customerBusinessName;
        this.cols = [
          { field: 'branchName', header: 'Name' },
          { field: 'address', header: 'Address' },
          { field: 'city', header: 'City' },
          { field: 'pointOfContact', header: 'Point Of Contact' },
          { field: 'phoneNumber', header: 'Contact' },
        ];
      }, (error: BackendErrorResponse) => {
        this.errorHandleService.showError(error.error.error);
      })
  }
  public showModal(branch?: BusinessBranch, business?: Business, id?: number): void {
    this.visible = true;
    debugger
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

  public deleteBusiness(id: number): void {
    const index = this.businessList.findIndex(business => business.id === id);
    if (index) {
      this.businessList?.splice(index, 1);
    }
  }

  public deleteBranchById(id: number): void {
    this.businessList.forEach(business => {
      const branchIndexToRemove = business.businessBranchList?.findIndex(branch => branch.id === id);
      if (branchIndexToRemove !== undefined && branchIndexToRemove !== -1) {
        business.businessBranchList?.splice(branchIndexToRemove, 1);
      }
    });
  }

  public addToList(): void {
    if (this.mode === 'Business' && this.name) {
      // Check if the business already exists
      const existingBusinessIndex = this.businessList.findIndex(business => business.id === this.business.id);

      if (existingBusinessIndex !== -1) {
        // Update the existing business
        this.businessList[existingBusinessIndex].businessName = this.name;
      } else {
        // Add a new business
        const newId = this.businessList.length > 0 ? Math.max(...this.businessList.map(business => business.id!)) + 1 : 1;
        this.businessList.push({
          id: newId,
          businessName: this.name,
          businessBranchList: []
        });
      }
    } else {
      if (this.business) {
        if (this.branch) {
          const businessIndex = this.businessList.findIndex(business => business.id === this.business.id);

          if (businessIndex !== -1) {
            const branchIndex = this.businessList[businessIndex].businessBranchList?.findIndex(branch => branch.id === this.branch.id);

            if (branchIndex !== -1) {
              // Update the existing branch
              this.businessList[businessIndex].businessBranchList![branchIndex!] = { ...this.branch };
            } else {
              // Add a new branch
              const newBranchId = this.businessList[businessIndex].businessBranchList!.length > 0 ? Math.max(...this.businessList[businessIndex].businessBranchList!.map(branch => branch.id!)) + 1 : 1;
              this.businessList[businessIndex].businessBranchList?.push({
                ...this.branch,
                id: newBranchId
              });
            }
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
      businessBranchList: []
    };
    this.branch = {
      id: null,
      branchName: null,
      address: null,
      city: null,
      pointOfContact: null,
      phoneNumber: null
    };
  }


  public onModalClose(): void {
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

  addCustomer() {
    this.customer.customerBusinessName = this.businessList;
    this.customerService.updateCustomer(this.customerId, this.customer)
      .pipe(takeUntil(this.destroy$)).subscribe(
        (res: any) => {
          const successMsg = "Business added successfully";
          this.successMsgService.showSuccess(successMsg);
          this.buttonName = "Update";
          this.getCustomerById(res.id);
        },
        (error: BackendErrorResponse) => {
          this.errorHandleService.showError(error.error.error);
        }
      );
  }

}
