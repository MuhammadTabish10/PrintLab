import { Component } from '@angular/core';
import { Observable, Subject, takeUntil } from 'rxjs';
import { BindingLabour } from 'src/app/Model/BindingLabour';
import { ProductField } from 'src/app/Model/ProductField';
import { LabourService } from '../service/labour.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { ProductDefinitionService } from 'src/app/services/product-definition.service';
import { ErrorHandleService } from 'src/app/services/error-handle.service';
import { VendorService } from 'src/app/services/vendor.service';
import { UpingService } from 'src/app/services/uping.service';
import { SuccessMessageService } from 'src/app/services/success-message.service';

@Component({
  selector: 'app-add-binding-labours',
  templateUrl: './add-binding-labours.component.html',
  styleUrls: ['./add-binding-labours.component.css']
})
export class AddBindingLaboursComponent {
  buttonName: string = 'Add';
  idFromQueryParam: number | null | undefined;
  uppingArray: any[] = [];
  bindingLabourList: BindingLabour[] = [];
  bindingTypes: ProductField | undefined | null;
  sizeCategory: ProductField | undefined | null;

  bindingLabour: BindingLabour = {
    id: undefined,
    timeStamp: undefined,
    name: undefined,
    createdBy: undefined,
    type: undefined,
    category: undefined,
    size: undefined,
    rate: undefined,
    status: undefined,
  };

  private destroy$ = new Subject<void>();
  private uppingArraySubject = new Subject<any[]>();
  uppingArray$: Observable<any[]> = this.uppingArraySubject.asObservable();

  constructor(
    private route: ActivatedRoute,
    private errorHandlingService: ErrorHandleService,
    private vendorService: VendorService,
    private labourService: LabourService,
    private successService: SuccessMessageService,
    private router: Router,
    private productFieldService: ProductDefinitionService,
    private upingService: UpingService,
    private datePipe: DatePipe,
  ) { }


  ngOnInit(): void {
    this.getBindingLabours();
    this.getBindingType();
    this.getSizeCategory();
    this.route.queryParams.pipe(takeUntil(this.destroy$)).subscribe(param => {
      this.idFromQueryParam = +param['id'] || null;
      this.buttonName = this.idFromQueryParam ? 'Update' : 'Save';
      if (this.idFromQueryParam) {
        this.patchValues(this.idFromQueryParam)
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getBindingLabours() {
    const process = "Binding";
    this.vendorService.getVendorByProductProcessName(process).subscribe(
      (res: any) => {
        this.bindingLabourList = res;
      }, err => {
      })
  }
  getBindingType() {
    const fieldName = 'Binding Labour Type';
    this.productFieldService.searchProductField(fieldName).subscribe(
      (res: any) => {
        this.bindingTypes = res[0];
      }, err => {
      });
  }

  getSizeCategory() {
    const fieldName = 'Category';
    this.productFieldService.searchProductField(fieldName).subscribe(
      (res: any) => {
        this.sizeCategory = res[0];
      }, err => {
      });
  }
  onCategoryChange(value: any) {
    if (!this.idFromQueryParam) {
      this.bindingLabour.size = null;
    }
    this.upingService.searchUpingByCategory(value).subscribe(
      (response: any) => {
        this.uppingArray = response;
        this.uppingArraySubject.next(this.uppingArray);
      },
      (error: any) => {
        console.log(error);
      }
    );
  }
  submit() {
    const serviceToCall = !this.idFromQueryParam ? this.labourService.postBindingLabour(this.bindingLabour)
      : this.labourService.updateBindingLabour(this.idFromQueryParam, this.bindingLabour);

    serviceToCall.subscribe(
      (res: BindingLabour) => {
        const successMsg = `Binding labour ${this.bindingLabour.name} is successfully ${this.buttonName}d.`;
        this.successService.showSuccess(successMsg);
        setTimeout(() => {
          this.router.navigate(['/get-binding-labours']);
        }, 2000);
      }, error => {
        if (error.status === 400) {
          this.errorHandlingService.showError("Bad Request. Please check your input.");
        } else {
          this.errorHandlingService.showError(error.error.error);
        }
      }
    );
  }

  patchValues(id: number): void {
    this.labourService.getBindingLabourById(id).subscribe(
      (res: BindingLabour) => {
        this.bindingLabour = res;
        if (this.idFromQueryParam) {

          this.onCategoryChange(res.category)
        }
      }, error => {
        this.errorHandlingService.showError(error.error.error);
      });
  }

}
