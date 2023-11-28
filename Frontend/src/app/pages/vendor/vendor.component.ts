import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { VendorService } from 'src/app/services/vendor.service';
import { MessageService } from 'primeng/api';
import { DatePipe } from '@angular/common';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-vendor',
  templateUrl: './vendor.component.html',
  styleUrls: ['./vendor.component.css']
})
export class VendorComponent implements OnInit, OnDestroy {
  tableData: boolean = true;
  vendorArray: Vendor[] = [];
  search: string = '';
  visible: boolean = false;
  error: string = '';
  process: any = [];
  currentIndex: number = 0;


  private destroy$ = new Subject<void>();

  constructor(
    private vendorService: VendorService,
    private router: Router,
    private messageService: MessageService,
    private datePipe: DatePipe
  ) { }

  ngOnInit(): void {
    this.getVendors();
  }

  getVendors() {
    this.vendorService.getVendor()
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (res) => {
          this.vendorArray = res as Vendor[];
          this.process = this.processVendorData(this.vendorArray);
          this.tableData = this.vendorArray.length === 0;
        },
        (error: any) => this.showError(error)
      );
  }

  processVendorData(vendors: any[]): any[] {
    return vendors.map((vendor) => {
      vendor.date = this.datePipe.transform(vendor.date, 'EEEE, MMMM d, yyyy');
      return vendor.vendorProcessList.map((process: any) => process.productProcess.name);
    });
  }

  deleteVendor(id: any) {
    this.vendorService.deleteVendor(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        () => this.getVendors(),
        (error: any) => this.showError(error)
      );
  }

  editVendor(id: number) {
    this.router.navigate(['/addVendor'], { queryParams: { id: id } });
  }

  vendorSettlement(id: number) {
    this.router.navigate(['/vendorSettlement'], { queryParams: { id: id } });
  }

  searchVendor(name: any) {
    if (!name.value) {
      this.getVendors();
    } else {

      this.vendorService.searchVendor(name.value)
        .pipe(takeUntil(this.destroy$))
        .subscribe(
          (res) => {

            this.vendorArray = res as Vendor[];
            this.process = this.processVendorData(this.vendorArray);
            this.tableData = this.vendorArray.length === 0;
          },
          (error: any) => this.showError(error)
        );
    }
  }

  showError(error: any) {
    this.messageService.add({ severity: 'error', summary: 'Error', detail: error.error.error });
    this.visible = true;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

interface Vendor {
  id: number;
  date: Date;
  name: string;
  contactName: string;
  contactNumber: string;
  email: string;
  address: string;
  notes: string;
  status: boolean;
  vendorProcessList: VendorProcess[];
}

interface VendorProcess {
  id: number;
  materialType: string;
  notes: string;
  rateSqft: string;
  contactNumber: string;
  productProcess: ProductProcess[];
}

interface ProductProcess {
  id: number;
  name: string;
  status: string
}
