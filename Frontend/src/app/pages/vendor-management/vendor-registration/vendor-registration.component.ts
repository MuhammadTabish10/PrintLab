import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { MessageService } from "primeng/api";
import { BackendErrorResponse } from "src/app/Model/BackendErrorResponse";
import { AuthguardService } from "src/app/services/authguard.service";
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
  currentUserDetail:any;

  constructor(
    private vendorService: VendorService,
    private productFieldService: ProductDefinitionService,
    private formService: FormValidationService,
    private messageService: MessageService,
    private errorHandleService: ErrorHandleService,
    private router: Router,
    private authService: AuthguardService
  ) {}

  ngOnInit(): void {
    this.formSetup();
    this.initializeProductFieldData();
    this.getUserDetails()
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

  getUserDetails() {
    this.currentUserDetail = JSON.parse(this.authService.token).userDetails;
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

    if (this.vendorForm.valid) {
      const formValue = vendorData;

      const vendorObj = {
        name: formValue?.name,
        market: formValue?.market?.name,
        landmark: formValue?.landmark,
        city: formValue?.city?.name,
        phone: formValue?.phone,
        address: formValue?.address,
        primaryEmail: formValue?.primaryEmail,
        secondaryEmail: formValue?.secondaryEmail,
        vendorProcessList: [],
        productionUserList: [],
        isLock: false,
        isActive: false,
        isVerified: false,
        rating: null,
        addedBy:this.currentUserDetail?.username
      };

      this.vendorService.postVendor(vendorObj).subscribe((res: any) => {
        this.vendorForm.reset();
        this.router.navigateByUrl("vendors-list")
      });
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
