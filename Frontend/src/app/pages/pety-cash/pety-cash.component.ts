import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { PetyCashService } from 'src/app/services/pety-cash.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-pety-cash',
  templateUrl: './pety-cash.component.html',
  styleUrls: ['./pety-cash.component.css']
})
export class PetyCashComponent implements OnInit {
  editMode: boolean = false;
  petyCashRecords: any[] = [];
  userName: string = '';
  idFromQueryParam: number = 0;
  error: boolean = false;
  debit: number[] = [];
  credit: number[] = [];
  debitValue: number = 0;
  creditValue: number = 0;
  recordId: number = 0;
  recordObj: any;
  total: any;
  totalCredit: number = 0;
  totalDebit: number = 0;

  constructor(
    private pettyCashService: PetyCashService,
    private userService: UserService,
    private route: ActivatedRoute,
    private messageService: MessageService,
    private datePipe: DatePipe
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(param => {
      this.idFromQueryParam = +param['id'];
    }, error => {
      this.showError(error);
      this.error = true;
    });
    this.getUserPettyCashById(this.idFromQueryParam);
    this.getUserById(this.idFromQueryParam);
  }

  getUserById(id: number): void {
    this.userService.getUserById(id).subscribe((user: any) => {
      this.userName = user.name;
    }, error => { });
  }

  getUserPettyCashById(userId: number): void {
    this.pettyCashService.getUserPettyCashById(userId).subscribe((res: any) => {
      this.petyCashRecords = res;
      this.updateCreditAndDebit();
      this.transformDate();
      this.calculateTotal();
    }, error => {
    });
  }



  transformDate(): void {
    this.petyCashRecords.forEach((el: any) => {
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
    this.petyCashRecords.forEach(element => {
      this.debit.push(element.debit);
      this.credit.push(element.credit);
    });
  }

  debited(userObj: any) {
    this.pettyCashService.addPetyCash(userObj).subscribe(res => {
      window.location.reload();
    }, error => {
    });
  }

  editPettyCash(pettyCashId: number): void {
    this.recordId = pettyCashId;
    this.pettyCashService.getPettyCashById(pettyCashId).subscribe((res: any) => {
      this.editMode = true;
      this.recordObj = res;
      this.debitValue = res.debit;
      this.creditValue = res.credit;
    }, err => { });
  }

  deleteById(pettyCashId: number): void {
    this.pettyCashService.deletePettyCashById(pettyCashId).subscribe(res => {
      window.location.reload();
    }, error => { });
  }


  onSubmit(form: NgForm) {
    const debitValue = form.value.debit;
    const creditValue = form.value.credit;
    const lastIndex = this.petyCashRecords.length - 1;
    if (!this.editMode && lastIndex >= 0) {
      const lastElement = this.petyCashRecords[lastIndex];
      const obj = lastElement;
      obj.debit = debitValue;
      obj.credit = creditValue;
      obj.user = { id: obj.user.id };
      // obj.order = { id: obj.order.id };
      delete obj.order;
      delete obj.dateAndTime;
      delete obj.id;
      debugger
      this.debited(obj);
    } else {
      this.recordObj.credit = this.creditValue;
      this.recordObj.debit = this.debitValue;
      this.updatepettyCashRecord(this.recordId, this.recordObj);
    }
  }

  updatepettyCashRecord(recordId: number, obj: any) {
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

  // getPetyCashById(pettyCashId: number) {

  // }

  showError(error: any) {
    this.messageService.add({ severity: 'error', summary: 'Error', detail: error.error.error });
  }
}
