import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CustomerService } from 'src/app/services/customer.service';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css']
})
export class CustomerComponent implements OnInit {

  visible!: boolean
  error: string = ''
  tableData: boolean = true
  customersArray: any = []
  search: string = ''

  constructor(private customerService: CustomerService, private router: Router) { }

  ngOnInit(): void {
    this.getcustomers()
  }

  getcustomers() {
    this.customerService.getCustomer().subscribe(res => {
      this.customersArray = res
      this.customersArray.length == 0 ? this.tableData = true : this.tableData = false
    }, error => {
      this.error = error.error.error
      this.visible = true;
    })
  }

  deleteCustomer(id: any) {
    this.customerService.deleteCustomer(id).subscribe(res => {
      this.getcustomers()
    })
  }

  editCustomer(id: any) {
    this.router.navigate(['/addCustomer'], { queryParams: { id: id } });
  }

  searchCustomer(name: any) {
    if (this.search == '') {
      this.getcustomers()
    } else {
      this.customerService.searchCustomer(name.value).subscribe(res => {
        this.customersArray = res
        this.customersArray.length == 0 ? this.tableData = true : this.tableData = false;
      })
    }
  }
}
