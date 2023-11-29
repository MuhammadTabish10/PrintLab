import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import { VendorSettlement } from 'src/app/Model/vendorSettlement';
import { VendorSettlementService } from 'src/app/services/vendor-settlement.service';

@Component({
  selector: 'app-vendor-settlement',
  templateUrl: './vendor-settlement.component.html',
  styleUrls: ['./vendor-settlement.component.css']
})
export class VendorSettlementComponent implements OnInit{
  editMode: boolean = false;
  vendorSettlementRecords: VendorSettlement[] = [];
  idFromQueryParam: number = 0;
  vendorSettlementArray: any = []
  visible!: boolean
  
  constructor(
    private route: ActivatedRoute,
    private vendorSettlement: VendorSettlementService,
    private messageService:MessageService
  ) { }
ngOnInit(): void {
  this.route.queryParams.subscribe((param) => {
    this.idFromQueryParam = +param['id'];

  });
  this.getVendorSettlementById(this.idFromQueryParam);
}

getVendorSettlementById(id: number){
  debugger
  this.vendorSettlement.getVendorSettlementById(id).subscribe(response => {
    this.vendorSettlementArray =response;
    console.log(this.vendorSettlementArray);
  }, error => {
    this.showError(error);
    this.visible = true
  
})
}
showError(error:any) {
  this.messageService.add({ severity: 'error', summary: 'Error', detail: error.error.error });
}

}
