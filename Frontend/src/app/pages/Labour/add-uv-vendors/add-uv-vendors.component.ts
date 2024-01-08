import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { ProductField } from 'src/app/Model/ProductField';
import { UV_Vendor } from 'src/app/Model/UV_Vendor';
import { ErrorHandleService } from 'src/app/services/error-handle.service';
import { VendorService } from 'src/app/services/vendor.service';
import { LabourService } from '../service/labour.service';
import { SuccessMessageService } from 'src/app/services/success-message.service';
import { ProductDefinitionService } from 'src/app/services/product-definition.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-add-uv-vendors',
  templateUrl: './add-uv-vendors.component.html',
  styleUrls: ['./add-uv-vendors.component.css']
})
export class AddUvVendorsComponent {
  buttonName: string = 'Add';
  idFromQueryParam: number | null | undefined;
  uV_VendorList: UV_Vendor[] = [];
  uVTypes: ProductField | undefined | null;

  uV_Vendor: UV_Vendor = {
    id: undefined,
    timeStamp: undefined,
    name: undefined,
    createdBy: undefined,
    type: undefined,
    rate: undefined,
    status: undefined,
  };

  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private errorHandlingService: ErrorHandleService,
    private vendorService: VendorService,
    private labourService: LabourService,
    private successService: SuccessMessageService,
    private router: Router,
    private productFieldService: ProductDefinitionService,
    private datePipe: DatePipe,
  ) { }


  ngOnInit(): void {
    this.getUvVendors();
    this.getUvType();
    this.route.queryParams.pipe(takeUntil(this.destroy$)).subscribe(param => {
      this.idFromQueryParam = +param['id'] || null;
      this.buttonName = this.idFromQueryParam ? 'Update' : 'Save';
      if (this.idFromQueryParam) {
        this.patchValues(this.idFromQueryParam);
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getUvVendors() {
    const process = "Uv";
    this.vendorService.getVendorByProductProcessName(process).subscribe(
      (res: any) => {
        this.uV_VendorList = res;
      }, err => {
      })
  }
  getUvType() {
    const fieldName = 'Uv Vendor Type';
    this.productFieldService.searchProductField(fieldName).subscribe(
      (res: any) => {
        this.uVTypes = res[0];
      }, err => {
      });
  }

  submit() {
    const serviceToCall = !this.idFromQueryParam ? this.labourService.postUvVendor(this.uV_Vendor)
      : this.labourService.updateUvVendor(this.idFromQueryParam, this.uV_Vendor);

    serviceToCall.subscribe(
      (res: UV_Vendor) => {
        const successMsg = `Uv vendor ${this.uV_Vendor.name} is successfully ${this.buttonName}d.`;
        this.successService.showSuccess(successMsg);
        setTimeout(() => {
          this.router.navigate(['/get-uv-vendors']);
        }, 2000);
      }, error => {
        if (error.status === 400) {
          this.errorHandlingService.showError("Bad Request. Please check your inputs.");
        } else {
          this.errorHandlingService.showError(error.error.error);
        }
      }
    );
  }

  patchValues(id: number): void {
    this.labourService.getUvVendorById(id).subscribe(
      (res: UV_Vendor) => {
        this.uV_Vendor = res;
      }, error => {
        this.errorHandlingService.showError(error.error.error);
      });
  }
}
