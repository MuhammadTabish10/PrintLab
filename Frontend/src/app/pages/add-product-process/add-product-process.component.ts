import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductProcessService } from 'src/app/services/product-process.service';

@Component({
  selector: 'app-add-product-process',
  templateUrl: './add-product-process.component.html',
  styleUrls: ['./add-product-process.component.css']
})
export class AddProductProcessComponent implements OnInit {

  visible!:boolean
  error:string=''
  buttonName: string = 'Add'
  nameValue: string = ''
  statusValue: string = 'Active'
  statusFlag: boolean = true
  idFromQueryParam!: number
  productProcessToUpdate: any = []

  constructor(private productProcessService: ProductProcessService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(param => {
      this.idFromQueryParam = +param['id']
      if (Number.isNaN(this.idFromQueryParam)) {
        this.buttonName = 'Add'
      } else {
        this.productProcessService.getProductProcessById(this.idFromQueryParam).subscribe(res => {
          this.buttonName = 'Update'
          this.productProcessToUpdate = res
          this.nameValue = this.productProcessToUpdate.name
          this.statusValue = this.productProcessToUpdate.status
          this.statusValue == 'Active' ? this.statusFlag = true : this.statusFlag = false
        }, error => {
          this.error = error.error.error
          this.visible = true;
        })
      }
    })
  }

  addProductProcess() {
    let obj = {
      name: this.nameValue,
      status: this.statusValue
    }
    if (Number.isNaN(this.idFromQueryParam)) {
      this.productProcessService.postProductProcess(obj).subscribe(() => {
        this.router.navigateByUrl('/productProcess')
      }, error => {
        this.error = error.error.error
        this.visible = true;
      })
    } else {
      this.productProcessService.updateProductProcess(this.idFromQueryParam, obj).subscribe(() => {
        this.router.navigateByUrl('/productProcess')
      }, error => {
        this.error = error.error.error
        this.visible = true;
      })
    }
  }

  getStatusValue() {
    this.statusFlag = !this.statusFlag
    this.statusFlag ? this.statusValue = 'Active' : this.statusValue = 'Inactive'
  }
}
