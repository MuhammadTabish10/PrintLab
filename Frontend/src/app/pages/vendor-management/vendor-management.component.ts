import { Vendor } from "./../../Model/Vendor";
import { Component, ElementRef, ViewChild } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import {
  debounceTime,
  distinctUntilChanged,
  map,
  Subject,
  switchMap,
  takeUntil,
} from "rxjs";
import { ErrorHandleService } from "src/app/services/error-handle.service";
import { LeadService } from "../Leads/Service/lead.service";
import { VendorService } from "src/app/services/vendor.service";
import { MessageService } from "primeng/api";
import { AuthguardService } from "src/app/services/authguard.service";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Table } from "primeng/table";
import { ProductDefinitionService } from "src/app/services/product-definition.service";
import { FormValidationService } from "src/app/services/form-validation.service";
import { BackendErrorResponse } from "src/app/Model/BackendErrorResponse";

@Component({
  selector: "app-vendor-management",
  templateUrl: "./vendor-management.component.html",
  styleUrls: ["./vendor-management.component.css"],
})
export class VendorManagementComponent {
  vendorForm!: FormGroup;
  contactForm!: FormGroup;
  market: any = [];
  cities: any = [];
  idFromQueryParam: any;
  private destroy$ = new Subject<void>();
  vendor: any;
  vendors: Vendor[] = [];
  activeItem: any;
  num: number = 0;
  items: any;
  userRole: any;
  checked: boolean = false;
  contactLockChecked: boolean = true;
  currentDate = new Date();
  readonly: boolean = false;
  contacts: any;
  contactDialog: boolean = false;
  paymentDialog: boolean = false;
  loading: any;
  destinations: any;
  fromDate: any;
  toDate: any;
  vendorNotes: string | undefined;
  // Management
  vendorLockStatus: boolean = false;
  vendorActiveStatus: boolean = false;
  vendorVerifiedStatus: boolean = false;
  vendorRating: any;
  vendorTimeStamp: any;
  vendorsData: any;

  // vendorUpdate

  @ViewChild("filter") filter!: ElementRef;
  @ViewChild("copiedContent", { static: false }) textToCopy!: ElementRef;
  private notesSubject = new Subject<string>();
  constructor(
    private errorHandleService: ErrorHandleService,
    private leadService: LeadService,
    private roleService: AuthguardService,
    private route: ActivatedRoute,
    private vendorService: VendorService,
    private messageService: MessageService,
    private formService: FormValidationService,
    private productFieldService: ProductDefinitionService
  ) {
    this.notesSubject
      .pipe(
        debounceTime(300), // Wait for 300ms pause in events
        distinctUntilChanged(), // Only emit if value is different from the last
        switchMap((notes) => {
          this.onSaveNotes(notes);
          return [];
        })
      )
      .subscribe();
  }

  ngOnInit(): void {
    this.vendorForm = new FormGroup({
      name: new FormControl(null, Validators.required),
      address: new FormControl(null),
      landmark: new FormControl(null, Validators.required),
      market: new FormControl(null, Validators.required),
      city: new FormControl(null, Validators.required),
      phone: new FormControl(null),
      email: new FormControl(null),
      secondaryEmail: new FormControl(null),
    });

    this.contactForm = new FormGroup({
      name: new FormControl(null),
      vendor: new FormControl(this.vendor?.contactName),
      whatsApp: new FormControl(null),
      phone: new FormControl(null),
      destination: new FormControl(null),
    });

    this.initializeProductFieldData();

    this.route.queryParams.pipe(takeUntil(this.destroy$)).subscribe(
      (param: any) => {
        this.idFromQueryParam = +param["id"] || null;
        console.log("hello");

        if (this.idFromQueryParam) {
          this.getVendorById(this.idFromQueryParam);
        }
      },
      (error: any) => {
        this.errorHandleService.showError(error?.error?.error);
      }
    );

    this.items = [
      {
        label: "Dashboard",
      },
      {
        label: "Contact Details",
      },
      {
        label: "Contacts",
      },
      {
        label: "Vendor Statement",
      },
      {
        label: "Payments",
      },
      {
        label: "Notes",
      },
      {
        label: "Management",
      },
    ];

    this.activeItem = this.items[this.num]?.label;
    this.userRole = this.roleService.getRole();
  }

  // Get Product Field Values

  private initializeProductFieldData(): void {
    this.getMarketNames("MARKET");
    this.getCityNames("CITY");
  }

  private getMarketNames(productName: string): void {
    this.productFieldService
      .searchProductField(productName)
      .pipe(
        map((res: any) =>
          res[0]?.productFieldValuesList.map((item: any) => item.name)
        )
      )
      .subscribe(
        (marketNames: any[]) => {
          this.market = marketNames;
        },
        (error: any) => {
          this.errorHandleService.showError(error?.error?.error);
        }
      );
  }
  private getCityNames(productName: string): void {
    this.productFieldService
      .searchProductField(productName)
      .pipe(
        map((res: any) =>
          res[0]?.productFieldValuesList.map((item: any) => item.name)
        )
      )
      .subscribe(
        (cityNames: any[]) => {
          this.cities = cityNames;
        },
        (error: any) => {
          this.errorHandleService.showError(error?.error?.error);
        }
      );
  }

  onPay() {
    this.paymentDialog = true;
  }

  onClosePaymentDialog() {
    this.paymentDialog = false;
  }

  onNotesChange(notes: string) {
    this.notesSubject.next(notes);
  }

  onSaveNotes(notes: string) {
    console.log(notes);
  }

  openContactDialog() {
    this.contactDialog = true;
  }

  // Management
  onChangeVendorLockStatus(value: any) {
    console.log(value);
    this.vendorLockStatus = value.checked;
  }

  onChangeVendorActiveStatus(value: any) {
    console.log(value);
  }

  onChangeVendorVerifiedStatus(value: any) {
    console.log(value);
  }

  onChangeVendorRating(value: any) {
    console.log(value);
  }

  onSelectVendorDate(value: any) {
    console.log(value);
  }

  onChangeContactLockStatus(value: any) {
    console.log(value);
  }

  onChangeContactActiveStatus(value: any) {
    console.log(value);
  }

  onChangeContactVerifiedStatus(value: any) {
    console.log(value);
  }

  // Management End

  //   For table filtering purpose
  onGlobalFilter(table: Table, event: any) {
    table.filterGlobal((event.target as HTMLInputElement).value, "contains");
  }

  toggleReadonly() {
    this.readonly = !this.readonly;
  }

  // Edit Vendor Form
  onEditVendor(value: any) {
    console.log(value);
    console.log(this.updateVendorFields(this.vendor,value));
    console.log(this.vendor);

    if (this.vendorForm.valid) {
      const updatedVendor = this.updateVendorFields(this.vendor, value);
      this.vendorService.updateVendor(this.idFromQueryParam,updatedVendor).subscribe((res:any)=>{
        this.getVendorById(this.idFromQueryParam)
        
      })
    } else {
      this.formService.markFormGroupTouched(this.vendorForm);
      this.alert();
    }
  }

  onSubmitContact(value: any) {}

  updateVendorFields<T>(obj: T, updates: Partial<T>): T {
    return {
      ...obj,
      ...updates,
    };
  }

  copyToClipboard() {
    const textToCopy =
      this.textToCopy.nativeElement.textContent ||
      this.textToCopy.nativeElement.innerText;
    const dummyElement = document.createElement("textarea");

    dummyElement.value = textToCopy;

    document.body.appendChild(dummyElement);

    dummyElement.select();
    dummyElement.setSelectionRange(0, 99999); // For mobile devices

    document.execCommand("copy");

    document.body.removeChild(dummyElement);

    this.errorHandleService.showSuccess();
  }

  getVendorById(id: number) {
    this.vendorService.getVendorById(id).subscribe((res: any) => {
      this.vendor = res;
      this.vendorsData = res;
      this.vendorForm.patchValue({
        name: this.vendorsData?.contactName,
        address: this.vendorsData?.address,
        landmark: this.vendorsData?.landmark,
        market: this.vendorsData?.market,
        city: this.vendorsData?.city,
        phone: this.vendorsData?.phone,
        primaryEmail: this.vendorsData?.email,
        secondaryEmail: this.vendorsData?.secondaryEmail,
      });
      this.checked = this.vendorsData?.isVerified;
      this.vendorRating = this.vendorsData?.rating;
      this.vendorLockStatus = this.vendorsData?.isLock;
      this.vendorActiveStatus = this.vendorsData?.isActive;
      this.vendorVerifiedStatus = this.vendorsData?.isVerified;
      console.log(res);
    });
  }

  showError(error: any) {
    this.messageService.add({
      severity: "error",
      summary: "Error",
      detail: error.error.error,
    });
  }

  success(){
    this.messageService.add({
      severity: "success",
      summary: "Success",
      detail: "Successfully Updated.",
    });
  }

  alert() {
    this.messageService.add({
      severity: "error",
      summary: "Warning",
      detail: "Please ensure that all required details are filled out.",
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
