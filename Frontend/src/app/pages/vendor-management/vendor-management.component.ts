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
import { Editor } from "primeng/editor";
import { DatePipe } from "@angular/common";

@Component({
  selector: "app-vendor-management",
  templateUrl: "./vendor-management.component.html",
  styleUrls: ["./vendor-management.component.css"],
  providers: [DatePipe],
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
  designations: any;
  fromDate: any;
  toDate: any;
  vendorNotes: any = `<p>dasdasdasda</p>`;
  notes: any;
  vendorStatement: any;
  // Management
  vendorLockStatus: boolean = false;
  vendorActiveStatus: boolean = false;
  vendorVerifiedStatus: boolean = false;
  vendorRating: any;
  vendorTimeStamp: any;
  vendorSinceDate:any
  vendorsData: any;

  // vendorUpdate

  @ViewChild("filter") filter!: ElementRef;
  @ViewChild("copiedContent", { static: false }) textToCopy!: ElementRef;
  @ViewChild("editor") editor!: Editor;
  constructor(
    private errorHandleService: ErrorHandleService,
    private leadService: LeadService,
    private roleService: AuthguardService,
    private route: ActivatedRoute,
    private vendorService: VendorService,
    private messageService: MessageService,
    private formService: FormValidationService,
    private productFieldService: ProductDefinitionService,
    private datePipe: DatePipe
  ) {}

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
      name: new FormControl(null, Validators.required),
      vendor: new FormControl(null, Validators.required),
      whatsApp: new FormControl(null, Validators.required),
      phone: new FormControl(null, Validators.required),
      designation: new FormControl(null, Validators.required),
    });

    this.initializeProductFieldData();

    this.route.queryParams.pipe(takeUntil(this.destroy$)).subscribe(
      (param: any) => {
        this.idFromQueryParam = +param["id"] || null;

        if (this.idFromQueryParam) {
          this.getVendorById(this.idFromQueryParam);
          this.getVendorContactsByVendorId(this.idFromQueryParam);
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
    this.getDesinationsNames("DESIGNATION");
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
  private getDesinationsNames(productName: string): void {
    this.productFieldService
      .searchProductField(productName)
      .pipe(
        map((res: any) =>
          res[0]?.productFieldValuesList.map((item: any) => item.name)
        )
      )
      .subscribe(
        (designationNames: any[]) => {
          this.designations = designationNames;
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

  onNotesChange() {
    const updatedObj = this.updateVendorFields(this.vendor, {
      notes: this.vendorNotes,
    });
    this.vendorService
      .updateVendor(this.idFromQueryParam, updatedObj)
      .subscribe((res: any) => {
        this.getVendorById(this.idFromQueryParam);
      });
  }

  openContactDialog() {
    this.contactDialog = true;
    this.contactForm.patchValue({
      vendor: this.vendor?.contactName,
    });
  }

  // Management
  onChangeVendorLockStatus(value: any) {
    const updatedObj = this.updateVendorFields(this.vendor, {
      isLock: value?.checked,
    });
    this.vendorService
      .updateVendor(this.idFromQueryParam, updatedObj)
      .subscribe((res: any) => {
        this.getVendorById(this.idFromQueryParam);
      });
  }

  onChangeVendorActiveStatus(value: any) {
    const updatedObj = this.updateVendorFields(this.vendor, {
      isActive: value?.checked,
    });
    this.vendorService
      .updateVendor(this.idFromQueryParam, updatedObj)
      .subscribe((res: any) => {
        this.getVendorById(this.idFromQueryParam);
      });
  }

  onChangeVendorVerifiedStatus(value: any) {
    const updatedObj = this.updateVendorFields(this.vendor, {
      isVerified: value?.checked,
    });
    this.vendorService
      .updateVendor(this.idFromQueryParam, updatedObj)
      .subscribe((res: any) => {
        this.getVendorById(this.idFromQueryParam);
      });
  }

  onChangeVendorRating(data: any) {

    const updatedObj = this.updateVendorFields(this.vendor, {
      rating: data?.value,
    });
    this.vendorService
      .updateVendor(this.idFromQueryParam, updatedObj)
      .subscribe((res: any) => {
        this.getVendorById(this.idFromQueryParam);
      });
  }

  onSelectVendorDate(data: any) {
    const selectedDate = new Date(data);
    const currentTime = new Date();

    // Set the current time to the selected date
    selectedDate.setHours(currentTime.getHours());
    selectedDate.setMinutes(currentTime.getMinutes());
    selectedDate.setSeconds(currentTime.getSeconds());

    
    
    const updatedObj = this.updateVendorFields(this.vendor, {
      timeStamp: selectedDate.toISOString(),
    });
    this.vendorService
      .updateVendor(this.idFromQueryParam, updatedObj)
      .subscribe((res: any) => {
        this.vendorSinceDate = null
        this.getVendorById(this.idFromQueryParam);
      });
  }

onChangeContactLockStatus(value: any,data:any,id:any) {
  
    const updatedObj = this.updateVendorFields(data, {
      isLock: value?.checked,
    });
    this.vendorService
      .updateVendorContact(id, updatedObj)
      .subscribe((res: any) => {
        this.getVendorContactsByVendorId(this.idFromQueryParam);
      });
  }

  onChangeContactActiveStatus(value: any,data:any,id:any) {
    const updatedObj = this.updateVendorFields(data, {
      status: value?.checked,
    });
    this.vendorService
      .updateVendorContact(id, updatedObj)
      .subscribe((res: any) => {
        this.getVendorContactsByVendorId(this.idFromQueryParam);
      });
  }

  onChangeContactVerifiedStatus(value: any,data:any,id:any) {
    const updatedObj = this.updateVendorFields(data, {
      isVerified: value?.checked,
    });
    this.vendorService
      .updateVendorContact(id, updatedObj)
      .subscribe((res: any) => {
        this.getVendorContactsByVendorId(this.idFromQueryParam);
      });
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

    if (this.vendorForm.valid) {
      const updatedVendor = this.updateVendorFields(this.vendor, value);
      this.vendorService
        .updateVendor(this.idFromQueryParam, updatedVendor)
        .subscribe((res: any) => {
          this.getVendorById(this.idFromQueryParam);
        });
    } else {
      this.formService.markFormGroupTouched(this.vendorForm);
      this.alert();
    }
  }

  onSubmitContact(contactDetails: any) {
    if (this.contactForm.valid) {
      const contactObj = {
        name: contactDetails?.name,
        designation: contactDetails?.designation,
        whatsapp: contactDetails?.whatsApp,
        phone: contactDetails?.phone,
        vendor: {
          id: this.idFromQueryParam,
        },
      };

      this.vendorService.postVendorContact(contactObj).subscribe((res: any) => {
        this.getVendorContactsByVendorId(this.idFromQueryParam);
        this.contactDialog = false;
      });
    } else {
      this.formService.markFormGroupTouched(this.contactForm);
      this.alert();
    }
  }

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
     if (this.vendor.timeStamp && Array.isArray(this.vendor.timeStamp)) {
       this.vendorTimeStamp = new Date(
         this.vendor.timeStamp[0], // Year
         this.vendor.timeStamp[1] - 1, // Month (0-based in JavaScript Date)
         this.vendor.timeStamp[2], // Day
         this.vendor.timeStamp[3], // Hour
         this.vendor.timeStamp[4], // Minute
         this.vendor.timeStamp[5] // Second
       );
     }
      
      this.checked = this.vendorsData?.isVerified;
      this.vendorNotes = this.vendorsData?.notes;
      this.vendorRating = this.vendorsData?.rating;
      this.vendorLockStatus = this.vendorsData?.isLock;
      this.vendorActiveStatus = this.vendorsData?.isActive;
      this.vendorVerifiedStatus = this.vendorsData?.isVerified;
    });
  }

  getVendorContactsByVendorId(id: any) {
    this.vendorService.getVendorContactsByVendorId(id).subscribe((res: any) => {
      this.contacts = res;
      
    });
  }

  showError(error: any) {
    this.messageService.add({
      severity: "error",
      summary: "Error",
      detail: error.error.error,
    });
  }

  success() {
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
