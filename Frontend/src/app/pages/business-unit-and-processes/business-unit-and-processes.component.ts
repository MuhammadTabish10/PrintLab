import { Component, OnInit } from '@angular/core';
import { ProductService } from 'src/app/services/product.service';
import { BusinessUnitService } from './Service/business-unit.service';
import { BusinessUnit, BusinessUnitProcessDto } from 'src/app/Model/BusinessUnit';
import { BackendErrorResponse } from 'src/app/Model/BackendErrorResponse';
import { ErrorHandleService } from 'src/app/services/error-handle.service';
import { VendorService } from 'src/app/services/vendor.service';
import { Vendor } from 'src/app/Model/Vendor';
import { SuccessMessageService } from 'src/app/services/success-message.service';
import { MessageService } from 'primeng/api';
import { Column } from 'src/app/Model/Column';

@Component({
  selector: 'app-business-unit-and-processes',
  templateUrl: './business-unit-and-processes.component.html',
  styleUrls: ['./business-unit-and-processes.component.css']
})

export class BusinessUnitAndProcessesComponent implements OnInit {

  categoryList: BusinessUnit[] = [];
  selectedProcess: BusinessUnitProcessDto = {
    id: undefined,
    process: undefined,
    billable: false,
    vendors: undefined,
  };
  name: string | undefined | null
  position: string = 'top';
  openTabIndex: number | number[] | null | undefined;
  selectedVendors: Vendor[] = [];

  cols!: Column[];
  //


  category: BusinessUnit = {
    id: undefined,
    name: undefined,
    processList: [{
      id: undefined,
      process: undefined,
      billable: false
    }],
  };
  visible: boolean = false;
  mode: string = 'Category';
  heading: string = 'Category';
  vendorList: Vendor[] = [];
  restrict: boolean | undefined | null;
  success: string | undefined | null;
  constructor(
    private errorHandleService: ErrorHandleService,
    private successService: SuccessMessageService,
    private businessService: BusinessUnitService,
    private messageService: MessageService,
    private vendorService: VendorService,
  ) { }

  ngOnInit() {
    this.getCategoryList();
    this.getAllVendors();
  }
  private getCategoryList(): void {
    this.businessService.getBusinessUnits().subscribe(
      (res: BusinessUnit[]) => {
        debugger
        this.categoryList = res;

        this.cols = [
          { field: 'process', header: 'Process' },
          { field: 'billable', header: 'Billable' },
          { field: 'vendors', header: 'Vendors' }
        ];

      }, (error: BackendErrorResponse) => {
        this.onToastClose();
        this.errorHandleService.showError(error.error.error);
      }
    );
  }

  submit(): void {
    if (this.name) {
      this.category.name = this.name;
    }
    this.category.processList = [];
    this.selectedProcess.vendors = this.selectedVendors;
    if (this.selectedProcess.process) {
      this.category.processList?.push(this.selectedProcess);
    }
    debugger
    const serviceToCall = this.category.id
      ? this.businessService.putBusinessUnit(this.category.id!, this.category)
      : this.businessService.postBusinessUnit(this.category);
    serviceToCall.subscribe(
      (res: BusinessUnit) => {
        const saveOrUpdate = this.mode === 'Category' ? 'Saved' : 'Updated';
        const msg = `Category: ${this.category.name} is successfully ${saveOrUpdate}.`;
        this.onToastClose();
        this.successService.showSuccess(msg);
        this.visible = false;
        this.mode = 'Category';
        this.heading = 'Category';
        debugger
        const indexOfUpdatedCategory = this.categoryList.findIndex(category => category.id === this.category.id);
        this.openTabIndex = [indexOfUpdatedCategory];
        this.category = {
          id: null,
          name: null,
          processList: undefined,
        }
        this.selectedProcess = {
          id: null,
          process: null,
          billable: null,
          vendors: undefined,
        }
        this.selectedVendors = [];
        this.getCategoryList();
      },
      (error: BackendErrorResponse) => {
        debugger
        this.onToastClose();
        this.errorHandleService.showError(error.error.error);
      }
    );
  }


  deleteProcessAndItsVendors(categoryId: number): void {
    debugger
    this.businessService.deleteProcess(+categoryId).subscribe(
      () => {
        this.getCategoryList();
      },
      (error: BackendErrorResponse) => {
        this.onToastClose();
        this.errorHandleService.showError(error.error.error);
      }
    );
  }

  deleteCategory(categoryId: number): void {
    this.businessService.deleteBusinessUnit(categoryId).subscribe(
      () => {
        this.getCategoryList();
      },
      (error: BackendErrorResponse) => {
        this.onToastClose();
        this.errorHandleService.showError(error.error.error);
      }
    );
  }

  showModal(process?: BusinessUnitProcessDto, category?: BusinessUnit, id?: number) {
    this.visible = true;
    if (category?.id) {
      this.category = category;
      this.mode = 'Update';
      this.heading = 'Process';
      if (process) {
        debugger
        this.selectedProcess.id = process.id;
        this.selectedProcess.process = process.process;
        this.selectedProcess.billable = process.billable;
        this.selectedVendors = process.vendors!;
      }
    } if (id) {
      debugger
      this.name = category?.name;
      this.mode = 'Category';
      this.heading = 'Category';
    }
  }

  private getAllVendors(): void {
    this.vendorService.getVendor().subscribe(
      (res: any) => {
        this.vendorList = res;
      }, (error: BackendErrorResponse) => {
        this.onToastClose();
        this.errorHandleService.showError(error.error.error);
      }
    );
  }
  clear() {
    this.mode = 'Category';
    this.heading = 'Category';
    this.name = null;
    this.category = {
      id: null,
      name: null,
      processList: undefined,
    }
    this.selectedProcess = {
      id: null,
      process: null,
      billable: null,
      vendors: undefined,
    }
    this.selectedVendors = [];
  }
  // onBlur(category?: string) {
  //   this.businessService.getBusinessUnitByName(category?.trim()).subscribe((result: Boolean) => {
  //     if (result === true) {
  //       debugger
  //       const error = { error: { error: "A similar category already exists." } }
  //       this.restrict = true;
  //       this.onToastClose();
  //       this.errorHandleService.showError(error.error.error);
  //     } else {
  //       this.success = 'This is a new product';
  //       this.restrict = false;
  //     }
  //   }, err => {
  //     debugger
  //     err
  //   });
  // }
  onToastClose() {
    this.messageService.clear();
  }

  // editCategory(category: BusinessUnit) {
  //   this.businessService.putBusinessUnit(category?.id!, category).subscribe(
  //     (res: BusinessUnit) => {
  //       debugger
  //     }, (err: BackendErrorResponse) => {
  //       this.errorHandleService.showError(err.error.error);
  //     });
  // }
}
