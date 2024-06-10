import { Component, ElementRef, ViewChild } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { debounceTime, distinctUntilChanged, Subject, switchMap, takeUntil } from "rxjs";
import { ErrorHandleService } from "src/app/services/error-handle.service";
import { LeadService } from "../Leads/Service/lead.service";
import { VendorService } from "src/app/services/vendor.service";
import { Vendor } from "src/app/Model/Vendor";
import { MessageService } from "primeng/api";
import { AuthguardService } from "src/app/services/authguard.service";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Table } from "primeng/table";

@Component({
  selector: "app-vendor-management",
  templateUrl: "./vendor-management.component.html",
  styleUrls: ["./vendor-management.component.css"],
})
export class VendorManagementComponent {
  vendorForm!: FormGroup;
  contactForm!: FormGroup;
  market: any;
  cities: any;
  idFromQueryParam: number | null | undefined;
  private destroy$ = new Subject<void>();
  vendor: any;
  activeItem: any;
  num: number = 0;
  items: any;
  userRole: any;
  checked: boolean = true;
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
  vendorTimeSamp: any;
  @ViewChild("filter") filter!: ElementRef;
  @ViewChild("copiedContent", { static: false }) textToCopy!: ElementRef;
  private notesSubject = new Subject<string>();
  constructor(
    private errorHandleService: ErrorHandleService,
    private leadService: LeadService,
    private roleService: AuthguardService,
    private route: ActivatedRoute,
    private vendorService: VendorService
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
      primaryEmail: new FormControl(null),
      secondaryEmail: new FormControl(null),
    });

    this.contactForm = new FormGroup({
      name: new FormControl(null),
      vendor: new FormControl("Nadeem & Sons"),
      whatsApp: new FormControl(null),
      phone: new FormControl(null),
      destination: new FormControl(null),
    });

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

  onEditVendor(value: any) {}

  onSubmitContact(value: any) {}

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
      console.log(res);
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
