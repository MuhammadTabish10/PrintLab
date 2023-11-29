import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import { VendorSettlementService } from 'src/app/services/vendor-settlement.service';

@Component({
  selector: 'app-vendor-settlement',
  templateUrl: './vendor-settlement.component.html',
  styleUrls: ['./vendor-settlement.component.css']
})
export class VendorSettlementComponent implements OnInit {
  editMode: boolean = false;
  idFromQueryParam: number = 0;
  vendorSettlementArray: any[] = []
  visible!: boolean

  constructor(
    private route: ActivatedRoute,
    private vendorSettlement: VendorSettlementService,
    private messageService: MessageService,
    private datePipe: DatePipe
  ) { }
  ngOnInit(): void {
    this.route.queryParams.subscribe((param) => {
      this.idFromQueryParam = +param['id'];

    });
    this.getVendorSettlementById(this.idFromQueryParam);
  }

  getVendorSettlementById(id: number) {
    this.vendorSettlement.getVendorSettlementById(id).subscribe(response => {
      this.vendorSettlementArray.push(response);
      console.log(this.vendorSettlementArray);
      this.vendorSettlementArray.forEach((el: any) => {
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
      this.showError(error);
      this.visible = true

    })
  }
  showError(error: any) {
    this.messageService.add({ severity: 'error', summary: 'Error', detail: error.error.error });
  }

}
