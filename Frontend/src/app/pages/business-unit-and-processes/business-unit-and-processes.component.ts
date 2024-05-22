import { Component, OnInit } from '@angular/core';
import { BusinessUnitService } from './Service/business-unit.service';
import { BusinessUnit, BusinessUnitProcessDto } from 'src/app/Model/BusinessUnit';
import { BackendErrorResponse } from 'src/app/Model/BackendErrorResponse';
import { ErrorHandleService } from 'src/app/services/error-handle.service';
import { VendorService } from 'src/app/services/vendor.service';
import { Vendor } from 'src/app/Model/Vendor';
import { SuccessMessageService } from 'src/app/services/success-message.service';
import { MessageService } from 'primeng/api';
import { Column } from 'src/app/Model/Column';
import { ProductField } from 'src/app/Model/ProductField';
import { ProductDefinitionService } from 'src/app/services/product-definition.service';

@Component({
  selector: 'app-business-unit-and-processes',
  templateUrl: './business-unit-and-processes.component.html',
  styleUrls: ['./business-unit-and-processes.component.css']
})

export class BusinessUnitAndProcessesComponent implements OnInit {

  categoryList: BusinessUnit[] = [];
  selectedProcess: BusinessUnitProcessDto = {
    process: undefined,
    vendors: undefined,
    type: undefined,
    id: undefined,
  };
  types: ProductField | undefined | null;
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
      type: undefined,
      process: undefined,
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
    private productFieldService: ProductDefinitionService,
    private messageService: MessageService,
    private vendorService: VendorService,
  ) { }

  ngOnInit() {
    this.getCategoryList();
    this.getAllVendors();
    this.getAllProcessTypes("PROCESS_TYPES");
  }
  private getCategoryList(): void {
    this.businessService.getBusinessUnits().subscribe(
      (res: BusinessUnit[]) => {

        this.categoryList = res;

        this.cols = [
          { field: 'process', header: 'Process' },
          { field: 'type', header: 'Type' },
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

        const indexOfUpdatedCategory = this.categoryList.findIndex(category => category.id === this.category.id);
        this.openTabIndex = [indexOfUpdatedCategory];
        this.category = {
          id: null,
          name: null,
          processList: undefined,
        }
        this.selectedProcess = {
          vendors: undefined,
          process: null,
          type: null,
          id: null,
        }
        this.selectedVendors = [];
        this.getCategoryList();
      },
      (error: BackendErrorResponse) => {

        this.onToastClose();
        this.errorHandleService.showError(error.error.error);
      }
    );
  }


  deleteProcessAndItsVendors(categoryId: number): void {

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

        this.selectedProcess.id = process.id;
        this.selectedProcess.process = process.process;
        this.selectedProcess.type = process.type;
        this.selectedVendors = process.vendors!;
      }
    } if (id) {

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
      type: null,
      process: null,
      vendors: undefined,
    }
    this.selectedVendors = [];
  }
  onToastClose() {
    this.messageService.clear();
  }

  public onReorder(category: BusinessUnit): void {
    this.businessService.reorderProcessList(category).subscribe(
      (res: BusinessUnit) => {
        this.getCategoryList();
      },
      (error: BackendErrorResponse) => {
        this.onToastClose();
        this.errorHandleService.showError(error.error.error);
      }
    )
  }
  private getAllProcessTypes(field: string) {
    this.productFieldService.searchProductField(field)
      .subscribe(
        (data: any) => {
          this.types = data[0];
        }, (error: BackendErrorResponse) => {
          this.errorHandleService.showError(error.error.error);
        })
  }
}
