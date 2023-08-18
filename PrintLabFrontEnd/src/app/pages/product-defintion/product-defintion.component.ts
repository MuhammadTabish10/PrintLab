import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductDefinitionService } from 'src/app/services/product-definition.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-defintion',
  templateUrl: './product-defintion.component.html',
  styleUrls: ['./product-defintion.component.css']
})

export class ProductDefintionComponent implements OnInit {

  fieldList: any = []
  tableData: Boolean = true

  constructor(private productFieldService: ProductDefinitionService, private productService: ProductService, private router: Router) { }


  ngOnInit(): void {
    this.getFields()
  }
  getFields() {
    this.productFieldService.getProductDefintion().subscribe(res => {
      this.fieldList = res
      this.fieldList.length == 0 ? this.tableData = true : this.tableData = false
    })
  }

  deleteField(id: any) {
    debugger
    this.productFieldService.deleteField(id).subscribe(() => {
      this.getFields()
    })
  }

  editField(id: any): void {
    this.router.navigate(['/addProductField'], { queryParams: { id: id } });
  }

  searchProdutDefinition(id: any) {
    this.productFieldService.getProductDefintionById(id.value).subscribe(res => {
      debugger
      this.fieldList.push(res)
      this.fieldList.length == 0 ? this.tableData = true : this.tableData = false
      console.log(this.fieldList);
    })
  }
}