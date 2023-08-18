import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { VendorService } from 'src/app/services/vendor.service';

@Component({
  selector: 'app-vendor',
  templateUrl: './vendor.component.html',
  styleUrls: ['./vendor.component.css']
})
export class VendorComponent implements OnInit {

  tableData: boolean = true
  vendorArray: any = []

  constructor(private vendorService: VendorService, private router: Router) { }

  ngOnInit(): void {
    this.getVendors()
  }

  getVendors() {
    this.vendorService.getVendor().subscribe(res => {
      this.vendorArray = res
      console.log(this.vendorArray);
      this.vendorArray.length == 0 ? this.tableData = true : this.tableData = false
    })
  }

  deleteVendor(id: any) {
    this.vendorService.deleteVendor(id).subscribe(res => {
      this.getVendors()
    })
  }
  editVendor(id: any) { 
    this.router.navigate(['/addVendor'], { queryParams: { id: id } });
  }

  searchVendor(name:any) {
    this.vendorService.searchVendor(name.value).subscribe(res => {
      this.vendorArray = res
      this.vendorArray.length == 0 ? this.tableData = true : this.tableData = false;
    })
  }
}