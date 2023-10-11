import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { PaperStockService } from 'src/app/services/paper-stock.service';

@Component({
  selector: 'app-paper-stock',
  templateUrl: './paper-stock.component.html',
  styleUrls: ['./paper-stock.component.css']
})
export class PaperStockComponent {

  allPaperStock: any = []
  search: string = ''
  visible!: boolean


  constructor(private paperStockService: PaperStockService, private router: Router, private route: ActivatedRoute,
    private messageService: MessageService) { }

  ngOnInit(): any {
    this.getPaperStock()
  }

  getPaperStock() {
    this.paperStockService.getAllPaperStock().subscribe((res: any) => {
      this.allPaperStock = res
    })
  }

  searchPaperStock(title: any){
    if (this.search == '') {
      this.getPaperStock()
    } else {
      this.paperStockService.searchPaperStock(title.value).subscribe(res => {
        this.allPaperStock = res
        // this.allPaperStock.length == 0 ? this.tableData = true : this.tableData = false
      }, error => {
        this.showError(error);
        this.visible = true
      })
    }
  }

  showError(error:any) {
    this.messageService.add({ severity: 'error', summary: 'Error', detail: error.error.error });
  }

  viewProduct(obj: any) {

  }

  editProduct(id: any) {
    this.router.navigate(['/addPaperStock'], { queryParams: { id: id } });

  }

  deleteProduct(id: any) {
    this.paperStockService.deletePaperStock(id).subscribe((res: any) => {
      this.getPaperStock()
    })
  }

}
