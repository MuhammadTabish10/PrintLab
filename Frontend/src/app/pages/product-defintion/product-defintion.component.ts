import { DatePipe } from '@angular/common';
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
  search: string = ''
  visible!: boolean
  error: string = ''

  constructor(private productFieldService: ProductDefinitionService, private productService: ProductService, private router: Router, private datePipe : DatePipe) { }


  ngOnInit(): void {
    this.getFields()
  }

  getFields() {
    this.productFieldService.getProductField().subscribe(res => {
      this.fieldList = res;
      this.fieldList.forEach((el: any) => {
        const dateArray = el.created_at;
        const [year, month, day] = dateArray;
        const [hours, minutes, seconds, milliseconds] = [0, 0, 0, 0];
        el.created_at = new Date(year, month - 1, day, hours, minutes, seconds, milliseconds);
        el.created_at = el.created_at.toString() !== 'Invalid Date' ? this.datePipe.transform(el.created_at, 'EEEE, MMMM d, yyyy') : 'Invalid Date';
      });

      this.fieldList.length == 0 ? this.tableData = true : this.tableData = false;
    }, error => {
      this.error = error.error.error;
      this.visible = true;
    });
  }



  deleteField(id: any) {

    this.productFieldService.deleteField(id).subscribe(() => {
      this.getFields()
    }, error => {
      this.error = error.error.error
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
        this.error = error.error.error
        this.visible = true
      })
    }
  }
}
