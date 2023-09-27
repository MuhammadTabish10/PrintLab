import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomerService } from 'src/app/services/customer.service';
import { MessageService } from 'primeng/api';
@Component({
  selector: 'app-add-customer',
  templateUrl: './add-customer.component.html',
  styleUrls: ['./add-customer.component.css']
})
export class AddCustomerComponent implements OnInit {

  buttonName: String = 'Add'
  nameValue: String = ''
  businessValue: String = ''
  statusFlag: boolean = true
  status: string = 'Active'
  idFromQueryParam!: number
  customerToUpdate: any = []
  error: string = ''
  visible!: boolean

  constructor(private customerService: CustomerService, private route: ActivatedRoute, private router: Router
  ,private messageService: MessageService) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(param => {
      this.idFromQueryParam = +param['id']
      if (Number.isNaN(this.idFromQueryParam)) {
        this.buttonName = 'Add'
      } else {
        this.customerService.getCustomerById(this.idFromQueryParam).subscribe(res => {
          this.buttonName = 'Update'
          this.customerToUpdate = res
          this.nameValue = this.customerToUpdate.name
          this.businessValue = this.customerToUpdate.businessName
          this.status = this.customerToUpdate.status
          this.status == 'Active' ? this.statusFlag = true : this.statusFlag = false
        }, error => {
          
          this.showError(error);
          this.visible = true;
        })
      }
    }, err => {
      let error = err.er
    })
  }

  addCustomer() {
    let obj = {
      name: this.nameValue,
      businessName: this.businessValue,
      status: this.status
    }
    if (Number.isNaN(this.idFromQueryParam)) {
      this.customerService.postCustomer(obj).subscribe(() => {
        this.router.navigateByUrl('/customers')
      }, error => {
        this.showError(error);
        this.visible = true;
      })
    } else {
      this.customerService.updateCustomer(this.idFromQueryParam, obj).subscribe(() => {
        this.router.navigateByUrl('/customers')
      }, error => {
        this.showError(error);
        this.visible = true;
      })
    }
  }

  getStatusValue() {
    this.statusFlag = !this.statusFlag
    this.statusFlag ? this.status = 'Active' : this.status = 'Inactive'
  }
  showError(error:any) {
    this.messageService.add({ severity: 'error', summary: 'Error', detail: error.error.error }); 
  }

}
