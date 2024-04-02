import { Vendor } from './../../../Model/Vendor';
import { Component, OnInit } from '@angular/core';
import { BusinessUnitProcessDto } from 'src/app/Model/BusinessUnit';
import { ProductionJob } from 'src/app/Model/ProductionJob';
import { JobService } from '../Service/job.service';
import { BackendErrorResponse } from 'src/app/Model/BackendErrorResponse';
import { JobProcessedDetails } from 'src/app/Model/ProcessDetails';
import { MenuItem } from 'primeng/api';
import { EventItem } from 'src/app/Model/EventItem';
import { ErrorHandleService } from 'src/app/services/error-handle.service';
import { SuccessMessageService } from 'src/app/services/success-message.service';
import { AuthguardService } from 'src/app/services/authguard.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-job-requests',
  templateUrl: './job-requests.component.html',
  styleUrls: ['./job-requests.component.css']
})
export class JobRequestsComponent implements OnInit {

  openTabIndex: number | number[] | null | undefined;

  events: EventItem[] = [];

  disabledTabs: boolean[] = [];

  jobById: ProductionJob | undefined | null;

  isCurrentTabFilled: boolean = false;

  items: MenuItem[] | undefined;

  activeIndex: number = 0;


  paymentMethods: any[] = [
    {
      name: 'Cash'
    },
    {
      name: 'Credit'
    }
  ]
  // disableCheck: boolean = false;
  processedJobList: JobProcessedDetails[] = [];
  constructor(
    private datePipe: DatePipe,
    private jobService: JobService,
    private authGuardSerivce: AuthguardService,
    private errorHandleService: ErrorHandleService,
    private successMsgService: SuccessMessageService,
  ) { }

  onActiveIndexChange(event: number) {
    this.activeIndex = event;
  }

  overviewActive: boolean = true;
  jobProcessedActive: boolean = false;
  paymentActive: boolean = false;
  confirmationActive: boolean = false;
  ngOnInit() {
    this.getProcessList().then(() => {
      this.handleRoles();
    });
    if (this.overviewActive) {
      this.getUpdatedTimeLine();
    }
    this.items = [
      {
        label: 'Overview',
        command: (event: any) => this.toggleTab('overview')
      },
      {
        label: 'JOB Processed',
        command: (event: any) => this.toggleTab('jobProcessed')
      },
      {
        label: 'Payment',
        command: (event: any) => this.toggleTab('payment')
      },
      {
        label: 'Confirmation',
        command: (event: any) => this.toggleTab('confirmation')
      }
    ];
  }

  private toggleTab(tabName: string) {
    this.overviewActive = tabName === 'overview';
    this.jobProcessedActive = tabName === 'jobProcessed';
    this.paymentActive = tabName === 'payment';
    this.confirmationActive = tabName === 'confirmation';
    if (this.overviewActive) {
      this.getUpdatedTimeLine();
    }else{
      this.events = [];
    }
  }

  private async getProcessList() {
    return new Promise<void>((resolve, reject) => {
      this.jobService.getProductionJobById(19).subscribe(
        (res: ProductionJob) => {
          this.jobById = res;
          debugger
          if (this.jobById.processList && this.jobById.processedDetailList.length === 0) {
            this.jobById.processedDetailList = [];
            for (let i = 0; i < this.jobById.processList.length; i++) {
              this.jobById.processedDetailList?.push({
                id: undefined,
                amount: undefined,
                vendor: undefined,
                payment: undefined,
                jobProcessed: undefined,
                status: undefined,
                processName: undefined,
                timeStamp: undefined
              });
            }
          } else if (
            this.jobById.processList &&
            this.jobById.processedDetailList.length !== this.jobById.processList.length
          ) {
            const remainingLength = this.jobById.processList.length - this.jobById.processedDetailList.length;
            for (let i = 0; i < remainingLength; i++) {
              this.jobById.processedDetailList?.push({
                id: undefined,
                amount: undefined,
                vendor: undefined,
                payment: undefined,
                jobProcessed: undefined,
                status: undefined,
                processName: undefined,
                timeStamp: undefined
              });
            }
          }
          resolve();
        },
        (error: BackendErrorResponse) => {
          this.errorHandleService.showError(error.error.error);
          reject();
        }
      );
    });
  }

  // onNextTabClick(obj: any) {
  //   debugger
  //   // const keys = Object.keys(obj);
  //   // const allKeysExist = keys.every(key => obj[key] !== undefined);

  //   this.isCurrentTabFilled = true;

  //   if (this.isCurrentTabFilled) {
  //     this.openTabIndex! += 1;
  //   }
  // }

  submit(category: BusinessUnitProcessDto, index: number, event: EventTarget) {
    // const isChecked = this.returnIfNotChecked(event);

    // if (!isChecked) {
    //   return;
    // }

    if (this.jobById?.processedDetailList) {
      this.jobById.processedDetailList[index].processName = category.process;

      // Get current timestamp
      const currentTimeStamp = new Date().getTime();

      // Add 5 hours in milliseconds
      const increasedTimeStamp = currentTimeStamp + (5 * 60 * 60 * 1000);

      // Create a new Date object with the increased timestamp
      const newTimeStamp = new Date(increasedTimeStamp);

      // Assign the new timestamp to the processed detail
      this.jobById.processedDetailList[index].timeStamp = newTimeStamp;

      const filteredList = this.filterProcessDetailList(this.jobById.processedDetailList);
      if (filteredList.length > 0) {
        this.jobById.processedDetailList = filteredList;
        this.jobService.updateProductionJob(19, this.jobById).subscribe(
          (res: ProductionJob) => {
            this.handleRoles();
            this.getProcessList();
            if (this.overviewActive) {
              this.getUpdatedTimeLine();
            }
            this.successMsgService.showSuccess(`Job ${category.process!} processed successfully`);
          },
          (error: BackendErrorResponse) => {
            this.errorHandleService.showError(error.error.error);
          }
        );
      }
    }

  }


  private filterProcessDetailList(details: JobProcessedDetails[]): JobProcessedDetails[] {
    return details.filter(detail => detail.amount !== null && detail.amount !== undefined);
  }

  // private returnIfNotChecked(event: EventTarget) {
  //   return (event as HTMLInputElement).checked;
  // }


  private decodeToken(): string {
    const token = localStorage.getItem('token');
    const decodedToken = this.authGuardSerivce.getDecodedAccessToken(token!);
    return decodedToken.ROLES[0];
  }

  private handleRoles() {
    debugger
    const role = this.decodeToken();
    if (role == 'ADMIN' && this.jobById?.processedDetailList && this.jobById?.processedDetailList?.length > 0) {
      // this.disableCheck = true;
      this.disabledTabs = this.jobById?.processedDetailList?.map(process => !!process.jobProcessed) || [];
    }
  }
  private getUpdatedTimeLine() {
    this.jobService.getProcessedJobDetailsByProductionId(19).subscribe((res: JobProcessedDetails[]) => {
      this.processedJobList = res;
      debugger
      this.events = [];

      this.processedJobList.forEach(job => {
        const event: EventItem = {
          status: job.processName,
          date: job.timeStamp ? this.formatDate(job.timeStamp) : null,
          icon: null,
          color: null,
          routerLink: null,
          queryParams: null,
          red: null
        };
        this.events.push(event);
      });
    }, (error: BackendErrorResponse) => {
      this.errorHandleService.showError(error.error.error);
    });
  }
  private formatDate(dateArray: number[] | Date): string | null {
    if (!Array.isArray(dateArray) || dateArray.length < 5) {
      return ''; // Invalid date format, return empty string
    }

    // Create a Date object from the array
    const date = new Date(dateArray[0], dateArray[1] - 1, dateArray[2], dateArray[3], dateArray[4]);

    // Format the Date object using DatePipe
    debugger
    return this.datePipe.transform(date, 'EEEE, MMMM d, yyyy, h:mm a');
  }

}
