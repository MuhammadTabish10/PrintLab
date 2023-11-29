import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { PetyCash } from 'src/app/Model/petyCash';
import { PetyCashService } from 'src/app/services/pety-cash.service';

@Component({
  selector: 'app-pety-cash',
  templateUrl: './pety-cash.component.html',
  styleUrls: ['./pety-cash.component.css']
})
export class PetyCashComponent implements OnInit {
  editMode: boolean = false;
  petyCashRecords: any[] = [];
  idFromQueryParam: number = 0;
  error: boolean = false;

  constructor(
    private pettyCashService: PetyCashService,
    private route: ActivatedRoute,
    private messageService: MessageService,
    private datePipe: DatePipe
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(param => {
      this.idFromQueryParam = +param['id']
    }, error => {
      this.showError(error);
      this.error = true;
    });
    this.getUserPettyCashById(this.idFromQueryParam);
  }
  getUserPettyCashById(userId: number): void {
    debugger
    this.pettyCashService.getUserPettyCashById(userId).subscribe((res: any) => {
      this.petyCashRecords.push(res);
      debugger
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
    }, error => {

    });
  }

  showError(error: any) {
    this.messageService.add({ severity: 'error', summary: 'Error', detail: error.error.error });
  }
}
