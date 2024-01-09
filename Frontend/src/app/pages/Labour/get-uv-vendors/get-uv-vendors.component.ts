import { Component } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { UV_Vendor } from 'src/app/Model/UV_Vendor';
import { LabourService } from '../service/labour.service';
import { ErrorHandleService } from 'src/app/services/error-handle.service';
import { Router } from '@angular/router';
import { SuccessMessageService } from 'src/app/services/success-message.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-get-uv-vendors',
  templateUrl: './get-uv-vendors.component.html',
  styleUrls: ['./get-uv-vendors.component.css']
})
export class GetUvVendorsComponent {
  uV_VendorList: UV_Vendor[] = [];

  private destroy$ = new Subject<void>();

  constructor(
    private labourService: LabourService,
    private errorHandleService: ErrorHandleService,
    private router: Router,
    private successMsgService: SuccessMessageService,
    private datePipe: DatePipe,
  ) { }

  ngOnInit(): void {
    this.getUvVendors();
  }

  getUvVendors(): void {
    this.labourService.getAllUvVendors().pipe(takeUntil(this.destroy$)).subscribe(
      (res: UV_Vendor[]) => {

        this.uV_VendorList = res;

        this.uV_VendorList.forEach((el: UV_Vendor) => {
          const dateArray = el.timeStamp;
          if (Array.isArray(dateArray)) {
            let timeStamp = new Date(dateArray[0], dateArray[1] - 1, dateArray[2], dateArray[3], dateArray[4]);
            timeStamp.setHours(timeStamp.getHours() + 5);
            el.timeStamp = this.datePipe.transform(timeStamp, 'EEEE, MMMM d, yyyy, h:mm a');
          }
        });

      },
      (error: any) => this.errorHandleService.showError(error.error.error)
    );
  }


  editUvVendor(id: number) {
    this.router.navigate(['/add-uv-vendor'], { queryParams: { id: id } });
  }

  deleteUvVendor(vendor: UV_Vendor) {
    this.labourService.deleteUvVendorById(vendor.id!)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        () => {
          const result = `Vendor ${vendor.name} deleted successfully`;
          this.successMsgService.showSuccess(result);
          this.getUvVendors();
        },
        (error: any) => this.errorHandleService.showError(error.error.error)
      );
  }


  searchVendor(name: any) {
    if (!name.value) {
      this.getUvVendors();
    } else {
      this.labourService.searchUvVendorByName(name.value)
        .pipe(takeUntil(this.destroy$))
        .subscribe(
          (res: UV_Vendor[]) => {

            this.uV_VendorList = res;

            this.uV_VendorList.forEach((el: UV_Vendor) => {
              const dateArray = el.timeStamp;
              if (Array.isArray(dateArray)) {
                let timeStamp = new Date(dateArray[0], dateArray[1] - 1, dateArray[2], dateArray[3], dateArray[4]);
                timeStamp.setHours(timeStamp.getHours() + 5);
                el.timeStamp = this.datePipe.transform(timeStamp, 'EEEE, MMMM d, yyyy, h:mm a');
              }
            });
            
          },
          (error: any) => this.errorHandleService.showError(error.error.error)
        );
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
