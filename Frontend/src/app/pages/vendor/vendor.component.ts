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
  search: string = ''
  visible!: boolean
  error: string = ''

  constructor(private vendorService: VendorService, private router: Router) { }

  ngOnInit(): void {
    this.getVendors()
  }

  getVendors() {
    this.vendorService.getVendor().subscribe(res => {
      this.vendorArray = res
      this.vendorArray.length == 0 ? this.tableData = true : this.tableData = false
      }, error => {
        this.error = error.error.error
        this.visible = true
    })
  }

  deleteVendor(id: any) {
    this.vendorService.deleteVendor(id).subscribe(() => {
      this.getVendors()
    }, error => {
      this.error = error.error.error
      this.visible = true
    })
  }
  editVendor(id: any) {
    this.router.navigate(['/addVendor'], { queryParams: { id: id } });
  }

  searchVendor(name: any) {
    if (this.search == '') {
      this.getVendors()
    } else {
      this.vendorService.searchVendor(name.value).subscribe(res => {
        this.vendorArray = res
        this.vendorArray.length == 0 ? this.tableData = true : this.tableData = false;
      }, error => {
        this.error = error.error.error
        this.visible = true
      })
    }
  }
}
