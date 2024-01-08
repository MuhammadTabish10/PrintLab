import { DatePipe } from '@angular/common';
import { LabourService } from './../service/labour.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { BindingLabour } from 'src/app/Model/BindingLabour';
import { Subject, takeUntil } from 'rxjs';
import { Router } from '@angular/router';
import { ErrorHandleService } from 'src/app/services/error-handle.service';
import { SuccessMessageService } from 'src/app/services/success-message.service';

@Component({
  selector: 'app-get-binding-labours',
  templateUrl: './get-binding-labours.component.html',
  styleUrls: ['./get-binding-labours.component.css']
})
export class GetBindingLaboursComponent implements OnInit, OnDestroy {
  bindingLabourList: BindingLabour[] = [];

  private destroy$ = new Subject<void>();

  constructor(
    private labourService: LabourService,
    private errorHandleService: ErrorHandleService,
    private router: Router,
    private successMsgService: SuccessMessageService,
    private datePipe: DatePipe,
  ) { }

  ngOnInit(): void {
    this.getBindingLabours();
  }

  getBindingLabours(): void {
    this.labourService.getAllBindingLabours().pipe(takeUntil(this.destroy$)).subscribe(
      (res: BindingLabour[]) => {
        this.bindingLabourList = res;
        this.bindingLabourList.forEach((el: any) => {
          const dateArray = el.timeStamp;
          let timeStamp = new Date(dateArray[0], dateArray[1] - 1, dateArray[2], dateArray[3], dateArray[4]);
          timeStamp.setHours(timeStamp.getHours() + 5);
          el.timeStamp = this.datePipe.transform(timeStamp, 'EEEE, MMMM d, yyyy, h:mm a');
        });
      },
      (error: any) => this.errorHandleService.showError(error.error.error)
    );
  }

  editBindingLabour(id: number) {
    this.router.navigate(['/add-binding-labour'], { queryParams: { id: id } });
  }

  deleteBindingLabour(labour: BindingLabour) {
    debugger
    this.labourService.deleteBindingLabourById(labour.id!)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        () => {
          const result = `Vendor ${labour.name} deleted successfully`;
          this.successMsgService.showSuccess(result);
          this.getBindingLabours();
        },
        (error: any) => this.errorHandleService.showError(error.error.error)
      );
  }

  searchLabour(name: any) {
    if (!name.value) {
      this.getBindingLabours();
    } else {
      this.labourService.searchBindingLabourByName(name.value)
        .pipe(takeUntil(this.destroy$))
        .subscribe(
          (res: BindingLabour[]) => {

            this.bindingLabourList = res;
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
