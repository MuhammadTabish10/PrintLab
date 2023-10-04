import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthguardService } from 'src/app/services/authguard.service';
import { ProductService } from 'src/app/services/product.service';
import { MessageService } from 'primeng/api';
@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {

  productDefinitionArray: any = []
  tableData: Boolean = true
  search: string = ''
  visible!: boolean
  error: string = ''

  constructor(private router: Router, private productService: ProductService, private authService: AuthguardService,private messageService: MessageService) { }

  ngOnInit(): void {
    this.getProducts()
  }

  goToAddProduct() {
    this.router.navigateByUrl('/addProduct')
  }

  getProducts() {
    this.productService.getProducts().subscribe(res => {
      debugger
      this.productDefinitionArray = res
      this.productDefinitionArray.length == 0 ? this.tableData = true : this.tableData = false
    }, error => {
      this.showError(error);
      this.visible = true
    })
  }

  deleteProduct(id: any) {
    this.productService.deleteProduct(id).subscribe(() => {
      this.getProducts()
    }, error => {
      this.showError(error);
      this.visible = true
    })
  }

  searchProduct(title: any) {
    if (this.search == '') {
      this.getProducts()
    } else {
      this.productService.searchProduct(title.value).subscribe(res => {
        this.productDefinitionArray = res
        this.productDefinitionArray.length == 0 ? this.tableData = true : this.tableData = false
      }, error => {
        this.showError(error);
        this.visible = true
      })
    }
  }

  editProduct(id: any): void {
    this.router.navigate(['/addProduct'], { queryParams: { id: id } });
  }

  viewProduct(id: any): void {
    this.router.navigate(['/viewProduct'], { queryParams: { id: id } });
  }
  showError(error:any) {
    this.messageService.add({ severity: 'error', summary: 'Error', detail: error.error.error });
  }
}
