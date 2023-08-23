import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {

  productDefinitionArray: any = []
  tableData: Boolean = true

  constructor(private router: Router, private productService: ProductService) { }

  ngOnInit(): void {
    this.getProducts()
  }

  goToAddProduct() {
    this.router.navigateByUrl('/addProduct')
  }

  getProducts() {
    this.productService.getProducts().subscribe(res => {
      this.productDefinitionArray = res
      console.log(this.productDefinitionArray);
      this.productDefinitionArray.length == 0 ? this.tableData = true : this.tableData = false
    })
  }

  deleteProduct(id: any) {
    this.productService.deleteProduct(id).subscribe(res => {
      debugger
      this.getProducts()
    })
  }

  searchProduct(title: any) {
    this.productService.searchProduct(title.value).subscribe(res => {
      debugger
      this.productDefinitionArray = res
      console.log(this.productDefinitionArray);
      if (this.productDefinitionArray.length == 0) {
        this.tableData = true
      } else {
        this.tableData = false
      }
    })
  }

  editProduct(id: any): void {
    this.router.navigate(['/addProduct'], { queryParams: { id: id } });
  }

  viewProduct(id: any): void {
    this.router.navigate(['/viewProduct'], { queryParams: { id: id } });
  }
}