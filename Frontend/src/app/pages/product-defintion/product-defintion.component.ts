import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductDefinitionService } from 'src/app/services/product-definition.service';
import { ProductService } from 'src/app/services/product.service';
import { MessageService } from 'primeng/api';
@Component({
  selector: 'app-product-defintion',
  templateUrl: './product-defintion.component.html',
  styleUrls: ['./product-defintion.component.css']
})

export class ProductDefintionComponent implements OnInit {

  fieldList: any = []
  tableData: Boolean = true
  search: string = ''
  visible!: boolean
  error: string = ''

  constructor(private productFieldService: ProductDefinitionService, private productService: ProductService, private router: Router,private messageService: MessageService) { }


  ngOnInit(): void {
    this.getFields()
  }
  getFields() {
    this.productFieldService.getProductField().subscribe(res => {
      this.fieldList = res
      this.fieldList.length == 0 ? this.tableData = true : this.tableData = false
    }, error => {
      this.showError(error);
      this.visible = true
    })
  }

  deleteField(id: any) {

    this.productFieldService.deleteField(id).subscribe(() => {
      this.getFields()
    }, error => {
      this.showError(error);
      this.visible = true
    })
  }

  editField(id: any): void {
    this.router.navigate(['/addProductField'], { queryParams: { id: id } });
  }

  searchProdutField(field: any) {
    if (this.search == '') {
      this.getFields()
    } else {
      this.productFieldService.searchProductField(field.value).subscribe(res => {
        this.fieldList = res
        this.fieldList.length == 0 ? this.tableData = true : this.tableData = false
      }, error => {
        this.showError(error);
        this.visible = true
      })
    }
  }
  showError(error:any) {
    this.messageService.add({ severity: 'error', summary: 'Error', detail: error.error.error }); 
  }
}
