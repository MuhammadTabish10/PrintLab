import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ProductProcessService } from 'src/app/services/product-process.service';

@Component({
  selector: 'app-product-process',
  templateUrl: './product-process.component.html',
  styleUrls: ['./product-process.component.css']
})
export class ProductProcessComponent {

  tableData: boolean = true
  productProcessArray: any = []
  searh: string = ''
  visible!: boolean
  error: string = ''

  constructor(private productProcessService: ProductProcessService, private router: Router) { }

  ngOnInit(): void {
    this.getProductProcess()
  }

  getProductProcess() {
    this.productProcessService.getProductProcess().subscribe(res => {
      this.productProcessArray = res
      this.productProcessArray.length == 0 ? this.tableData = true : this.tableData = false
    }, error => {
      this.error = error.error.error
      this.visible = true
    })
  }

  editProductProcess(id: any) {
    this.router.navigate(['/addProductProcess'], { queryParams: { id: id } });
  }

  deleteProductProcess(id: any) {
    this.productProcessService.deleteProductProcess(id).subscribe(res => {
      this.getProductProcess()
    }, error => {
      this.error = error.error.error
      this.visible = true
    })
  }

  searchProductProcess(name: any) {
    if (this.searh == '') {
      this.getProductProcess()
    } else {
      this.productProcessService.searchProductProcess(name.value).subscribe(res => {
        this.productProcessArray = res
        this.productProcessArray.length == 0 ? this.tableData = true : this.tableData = false;
      }, error => {
        this.error = error.error.error
        this.visible = true
      })
    }
  }
}
