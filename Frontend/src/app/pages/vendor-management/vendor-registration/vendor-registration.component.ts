import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { MessageService } from "primeng/api";
import { BackendErrorResponse } from "src/app/Model/BackendErrorResponse";
import { ErrorHandleService } from "src/app/services/error-handle.service";
import { FormValidationService } from "src/app/services/form-validation.service";
import { ProductDefinitionService } from "src/app/services/product-definition.service";
import { VendorService } from "src/app/services/vendor.service";

@Component({
  selector: "app-vendor-registration",
  templateUrl: "./vendor-registration.component.html",
  styleUrls: ["./vendor-registration.component.css"],
})
export class VendorRegistrationComponent implements OnInit {
  vendorForm!: FormGroup;
  market: any;
  cities: any;

  constructor(
    private vendorService: VendorService,
    private productFieldService: ProductDefinitionService,
    private formService: FormValidationService,
    private messageService: MessageService,
    private errorHandleService:ErrorHandleService
  ) {}

  ngOnInit(): void {
    this.formSetup();
    this.initializeProductFieldData()
  }

  getProductFieldValues() {}

  private initializeProductFieldData(): void {
    this.getMarketNames("MARKET");
    this.getCityNames("CITY");
  }

  private getMarketNames(productName: string): void {
    this.productFieldService.searchProductField(productName).subscribe(
      (res: any) => {
        this.market = res[0];

      },
      (error: BackendErrorResponse) => {
        this.errorHandleService.showError(error?.error?.error);
      }
    );
  }
  private getCityNames(productName: string): void {
    this.productFieldService.searchProductField(productName).subscribe(
      (res: any) => {
        this.cities = res[0];
      },
      (error: BackendErrorResponse) => {
        this.errorHandleService.showError(error?.error?.error);
      }
    );
  }

  formSetup() {
    this.vendorForm = new FormGroup({
      name: new FormControl(null, Validators.required),
      address: new FormControl(null),
      landmark: new FormControl(null, Validators.required),
      market: new FormControl(null, Validators.required),
      city: new FormControl(null, Validators.required),
      phone: new FormControl(null),
      primaryEmail: new FormControl(null),
      secondaryEmail: new FormControl(null),
    });
  }

  onRegisterVendor(vendorData: any) {
    console.log(vendorData);
    const formValue = vendorData?.value
    let vendorObj = {
      name: formValue?.name,
      market: formValue?.market,
      landmark: formValue?.landmark,
      city: formValue?.city,
      phone: formValue?.phone,
      address: formValue?.address,
      primaryEmail: formValue?.primaryEmail,
      secondaryEmail: formValue?.secondaryEmail,
    };

    if (this.vendorForm.valid) {

    } else {
      this.alert();
      this.formService.markFormGroupTouched(this.vendorForm);
    }
  }

  alert() {
    this.messageService.add({
      severity: "error",
      summary: "Warning",
      detail: "Please ensure that all required details are filled out.",
    });
  }
}
