import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CustomerService } from 'src/app/services/customer.service';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css']
})
export class CustomerComponent implements OnInit {

  tableData: boolean = true
  customersArray: any = []

  constructor(private customerService: CustomerService, private router: Router) { }

  ngOnInit(): void {
    this.getcustomers()
  }

  getcustomers() {
    this.customerService.getCustomer().subscribe(res => {
      this.customersArray = res
      console.log(this.customersArray);
      this.customersArray.length == 0 ? this.tableData = true : this.tableData = false
    })
  }

  deleteCustomer(id: any) {
    this.customerService.deleteCustomer(id).subscribe()
    this.getcustomers()
  }

  editCustomer(id: any) {
    this.router.navigate(['/addCustomer'], { queryParams: { id: id } });
  }

  searchCustomer(name: any) {
    this.customerService.searchCustomer(name.value).subscribe(res => {
      this.customersArray = res
      this.customersArray.length == 0 ? this.tableData = true : this.tableData = false;
    })
  }
}