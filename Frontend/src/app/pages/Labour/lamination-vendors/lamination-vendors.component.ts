import { Component } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { LaminationVendor } from 'src/app/Model/LaminationVendor';
import { LabourService } from '../service/labour.service';
import { ErrorHandleService } from 'src/app/services/error-handle.service';
import { Router } from '@angular/router';
import { SuccessMessageService } from 'src/app/services/success-message.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-lamination-vendors',
  templateUrl: './lamination-vendors.component.html',
  styleUrls: ['./lamination-vendors.component.css']
})
export class LaminationVendorsComponent {
  laminationVendorList: LaminationVendor[] = [];

  private destroy$ = new Subject<void>();

  constructor(
    private labourService: LabourService,
    private errorHandleService: ErrorHandleService,
    private router: Router,
    private successMsgService: SuccessMessageService,
    private datePipe: DatePipe,
  ) { }

  ngOnInit(): void {
    this.getLaminationVendors();
  }

  getLaminationVendors(): void {
    this.labourService.getAllLaminationVendors().pipe(takeUntil(this.destroy$)).subscribe(
      (res: LaminationVendor[]) => {

        this.laminationVendorList = res;

        this.laminationVendorList.forEach((el: LaminationVendor) => {
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

  editLaminationVendor(id: number) {
    this.router.navigate(['/add-lamination-vendor'], { queryParams: { id: id } });
  }

  deleteLaminationVendor(vendor: LaminationVendor) {
    this.labourService.deleteLaminationVendorById(vendor.id!)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        () => {
          const result = `Vendor ${vendor.name} deleted successfully`;
          this.successMsgService.showSuccess(result);
          this.getLaminationVendors();
        },
        (error: any) => this.errorHandleService.showError(error.error.error)
      );
  }


  searchVendor(name: EventTarget | null) {

    if (!(name instanceof HTMLInputElement)) {
      return;
    }

    const inputValue = name.value.trim();

    if (!inputValue) {
      this.getLaminationVendors();
      return;
    }

    this.labourService.searchLaminationVendorByName(inputValue)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (res: LaminationVendor[]) => {
          this.laminationVendorList = res;

          this.laminationVendorList.forEach((el: LaminationVendor) => {
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


  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
