import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomerService } from 'src/app/services/customer.service';

@Component({
  selector: 'app-add-customer',
  templateUrl: './add-customer.component.html',
  styleUrls: ['./add-customer.component.css']
})
export class AddCustomerComponent implements OnInit {

  buttonName: String = 'Add'
  nameValue: String = ''
  businessValue: String = ''
  idFromQueryParam!: number
  customerToUpdate: any = []

  constructor(private customerService: CustomerService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(param => {
      this.idFromQueryParam = +param['id']
      console.log(this.idFromQueryParam);
      if (Number.isNaN(this.idFromQueryParam)) {
        this.buttonName = 'Add'
      } else {
        this.customerService.getCustomerById(this.idFromQueryParam).subscribe(res => {
          this.buttonName = 'Update'
          this.customerToUpdate = res
          this.nameValue = this.customerToUpdate[0].name
          this.businessValue = this.customerToUpdate[0].business
        })
      }
    })
  }

  addCustomer() {
    debugger
    let obj = {
      name: this.nameValue,
      business: this.businessValue
    }
    if (Number.isNaN(this.idFromQueryParam)) {
      this.customerService.postCustomer(obj).subscribe(() => {
        this.router.navigateByUrl('/customers')
      })
    } else {
      this.customerService.updateCustomer(this.idFromQueryParam, obj).subscribe(() => {
        this.router.navigateByUrl('/customers')
      })
    }
  }
}
