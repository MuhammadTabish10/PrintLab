import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { Subject, takeUntil } from 'rxjs';
import { VendorService } from 'src/app/services/vendor.service';

@Component({
  selector: "app-vendor-list",
  templateUrl: "./vendor-list.component.html",
  styleUrls: ["./vendor-list.component.css"],
})
export class VendorListComponent implements OnInit, OnDestroy {
  vendorsData: any;

  loading: any;
  @ViewChild("filter") filter!: ElementRef;
  private destroy$ = new Subject<void>();
  constructor(
    private vendorService: VendorService,
    private router: Router,
    private messageService: MessageService,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    this.getVendors()
  }



  getVendors() {
    this.vendorService
      .getVendor()
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (res) => {
          this.vendorsData = res;
          console.log(res);

        },
        (error: any) => this.showError(error)
      );
  }

  registerVendor() {
    this.router.navigate(["/vendor-registration"]);
  }

  onClickVendor(id: number) {
    this.router.navigate(["/vendor-management"], { queryParams: { id: id } });
  }

  onGlobalFilter(table: Table, event: any) {
    table.filterGlobal((event.target as HTMLInputElement).value, "contains");
  }

  showError(error: any) {
    this.messageService.add({
      severity: "error",
      summary: "Error",
      detail: error.error.error,
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
