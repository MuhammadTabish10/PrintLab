import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';


@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css']
})
export class AddProductComponent implements OnInit {
  ngOnInit(): void {
  }

  // showError(error:any) {
  //   this.messageService.add({ severity: 'error', summary: 'Error', detail: error.error.error });
  // }
}
