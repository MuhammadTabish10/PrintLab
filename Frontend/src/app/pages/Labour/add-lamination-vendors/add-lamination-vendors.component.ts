import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { LaminationVendor } from 'src/app/Model/LaminationVendor';
import { ProductField } from 'src/app/Model/ProductField';
import { ErrorHandleService } from 'src/app/services/error-handle.service';
import { VendorService } from 'src/app/services/vendor.service';
import { LabourService } from '../service/labour.service';
import { SuccessMessageService } from 'src/app/services/success-message.service';
import { ProductDefinitionService } from 'src/app/services/product-definition.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-add-lamination-vendors',
  templateUrl: './add-lamination-vendors.component.html',
  styleUrls: ['./add-lamination-vendors.component.css']
})
export class AddLaminationVendorsComponent {
  buttonName: string = 'Add';
  idFromQueryParam: number | null | undefined;
  laminationVendorList: LaminationVendor[] = [];
  laminationTypes: ProductField | undefined | null;
  processTypes: ProductField | undefined | null;

  laminationVendor: LaminationVendor = {
    id: undefined,
    timeStamp: undefined,
    name: undefined,
    createdBy: undefined,
    process: undefined,
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
    this.getLaminationVendors();
    this.getProcessTypes();
    this.getLaminationType();
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

  getLaminationVendors() {
    const process = "Lamination";
    this.vendorService.getVendorByProductProcessName(process).subscribe(
      (res: any) => {
        this.laminationVendorList = res;
      }, err => {
      })
  }
  getLaminationType() {
    const fieldName = 'Lamination Vendor Type';
    this.productFieldService.searchProductField(fieldName).subscribe(
      (res: any) => {
        this.laminationTypes = res[0];
      }, err => {
      });
  }

  getProcessTypes() {
    const fieldName = 'Lamiation Vendor Process Type';
    this.productFieldService.searchProductField(fieldName).subscribe(
      (res: any) => {
        this.processTypes = res[0];
      }, err => {
      });
  }

  submit() {
    const serviceToCall = !this.idFromQueryParam ? this.labourService.postLaminationVendor(this.laminationVendor)
      : this.labourService.updateLaminationVendor(this.idFromQueryParam, this.laminationVendor);

    serviceToCall.subscribe(
      (res: LaminationVendor) => {
        const successMsg = `Lamination vendor ${this.laminationVendor.name} is successfully ${this.buttonName}d.`;
        this.successService.showSuccess(successMsg);
        setTimeout(() => {
          this.router.navigate(['/get-lamination-vendors']);
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
    this.labourService.getLaminationVendorById(id).subscribe(
      (res: LaminationVendor) => {
        this.laminationVendor = res;
      }, error => {
        this.errorHandlingService.showError(error.error.error);
      });
  }

}
