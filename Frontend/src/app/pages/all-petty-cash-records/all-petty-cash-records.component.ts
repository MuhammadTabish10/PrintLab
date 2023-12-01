import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { PetyCashService } from 'src/app/services/pety-cash.service';

@Component({
  selector: 'app-all-petty-cash-records',
  templateUrl: './all-petty-cash-records.component.html',
  styleUrls: ['./all-petty-cash-records.component.css']
})
export class AllPettyCashRecordsComponent {
  editMode: boolean = false;
  pettyCashRecords: any[] = [];
  error: boolean = false;
  debit: number[] = [];
  credit: number[] = [];
  recordId: number = 0;
  recordObj: any;
  debitValue: number = 0;
  creditValue: number = 0;
  totalDebit: number = 0;
  totalCredit: number = 0;

  constructor(
    private pettyCashService: PetyCashService,
    private datePipe: DatePipe,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.getAllPettyCash();
  }


  getAllPettyCash(): void {
    debugger
    this.pettyCashService.getAllUserPettyCash().subscribe((res: any) => {
      this.pettyCashRecords = res;
      this.updateCreditAndDebit();
      this.transformDate();
      this.calculateTotal();
    }, error => {
    });
  }



  transformDate(): void {
    this.pettyCashRecords.forEach((el: any) => {
      const dateArray = el.dateAndTime.split(/[ :\-]/);
      el.dateAndTime = new Date(
        parseInt(dateArray[0], 10),
        parseInt(dateArray[1], 10) - 1,
        parseInt(dateArray[2], 10),
        parseInt(dateArray[3], 10),
        parseInt(dateArray[4], 10),
        parseInt(dateArray[5], 10)
      );
      el.dateAndTime = this.datePipe.transform(el.dateAndTime, 'EEEE, MMMM d, yyyy, h:mm a');
    });
  }

  updateCreditAndDebit() {
    this.pettyCashRecords.forEach(element => {
      this.debit.push(element.debit);
      this.credit.push(element.credit);
    });
  }

  debited(settlementObj: any) {
    this.pettyCashService.addPetyCash(settlementObj).subscribe(res => {
      window.location.reload();
    }, error => {
    });
  }

  editPettyCash(settlementId: number): void {
    this.recordId = settlementId;
    this.pettyCashService.getPettyCashById(settlementId).subscribe((res: any) => {
      this.editMode = true;
      this.recordObj = res;
      this.debitValue = res.debit;
      this.creditValue = res.credit;
    }, err => { });
  }

  deleteById(settlementId: number): void {
    this.pettyCashService.deletePettyCashById(settlementId).subscribe(res => {
      this.getAllPettyCash();
    }, error => { });
  }


  onSubmit(form: NgForm) {
    const debitValue = form.value.debit;
    const creditValue = form.value.credit;
    const lastIndex = this.pettyCashRecords.length - 1;
    if (!this.editMode && lastIndex >= 0) {
      const lastElement = this.pettyCashRecords[lastIndex];
      const obj = lastElement;
      obj.debit = debitValue;
      obj.credit = creditValue;
      obj.vendor = { id: obj.vendor.id };
      obj.order = { id: obj.order.id };
      delete obj.dateAndTime;
      delete obj.id;
      this.debited(obj);
    } else {
      this.recordObj.credit = this.creditValue;
      this.recordObj.debit = this.debitValue;
      this.updateSettlementRecord(this.recordId, this.recordObj);
    }
  }

  updateSettlementRecord(recordId: number, obj: any) {
    this.pettyCashService.updatePettyCashRecordById(recordId, obj).subscribe(data => {
      window.location.reload();
    }, error => {
    });
  }

  calculateTotal() {
    for (let i = 0; i < Math.max(this.debit.length, this.credit.length); i++) {

      if (i < this.debit.length) {
        this.totalDebit += this.debit[i];
      }

      if (i < this.credit.length) {
        this.totalCredit += this.credit[i];
      }
    }
  }

  showError(error: any) {
    this.messageService.add({ severity: 'error', summary: 'Error', detail: error.error.error });
  }
}
