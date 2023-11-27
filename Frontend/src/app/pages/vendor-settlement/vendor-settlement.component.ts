import { Component } from '@angular/core';
import { VendorSettlement } from 'src/app/Model/vendorSettlement';

@Component({
  selector: 'app-vendor-settlement',
  templateUrl: './vendor-settlement.component.html',
  styleUrls: ['./vendor-settlement.component.css']
})
export class VendorSettlementComponent {
  editMode: boolean = false;
  vendorSettlementRecords: VendorSettlement[] = [];
}
