import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-view-product',
  templateUrl: './view-product.component.html',
  styleUrls: ['./view-product.component.css']
})
export class ViewProductComponent implements OnInit {

  idFromQueryParam: any
  productToView: any=[];
  visible!: boolean
  error: string = ''

  constructor(private route: ActivatedRoute, private service: ProductService) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(param => {
      this.idFromQueryParam = +param['id']
      this.service.getById(this.idFromQueryParam).subscribe(res => {
        debugger
        this.productToView = res
        console.log(this.productToView);
      }, error => {
        this.error = error.error.error
        this.visible = true
      })
    })

  }
}
