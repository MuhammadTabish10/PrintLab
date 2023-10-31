import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Observable } from 'rxjs';
import { PaperStockService } from 'src/app/services/paper-stock.service';

@Component({
  selector: 'app-add-paper-stock',
  templateUrl: './add-paper-stock.component.html',
  styleUrls: ['./add-paper-stock.component.css']
})
export class AddPaperStockComponent implements OnInit {
  buttonName: string = 'Add';
  allBrands: any[] = [];
  selectedBrands: any[] = [];
  paperStock: string = '';
  idFromQueryParam: number | null = null;
  selectedBrandsForEdit: any[] = [];
  selectedBrandsForEdit1: any[] = [];

  constructor(
    private paperStockService: PaperStockService,
    private router: Router,
    private route: ActivatedRoute,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.getBrands().subscribe((res: any) => {
      this.allBrands = res.productFieldValuesList;
      this.route.queryParams.subscribe((param) => {
        this.idFromQueryParam = +param['id'];
        this.buttonName = this.idFromQueryParam ? 'Update' : 'Add';
        if (this.idFromQueryParam) {
          this.getPaperStockById(this.idFromQueryParam);
        }
      });
    });
  }

  getBrands(): Observable<any> {
    return this.paperStockService.getBrandsByName();
  }

  getPaperStockById(id: number) {
    this.paperStockService.getById(id).subscribe(
      (res: any) => {
        this.selectedBrandsForEdit = res.brands;
        this.selectedBrandsForEdit1 = this.selectedBrandsForEdit.map((selectedBrandName) =>
          this.allBrands.find((el) => el.name.toLowerCase() === selectedBrandName.name.toLowerCase())
        );
        this.selectedBrands = this.selectedBrandsForEdit;
        this.paperStock = res.name;
      },
      (error) => {
        this.showError(error);
      }
    );
  }

  brandsChanged(event: any) {
    this.selectedBrands = event.value.map((element: any) => {
      return this.idFromQueryParam ? { name: element.name, id: element.id } : { name: element.name };
    });
  }

  addPaperStock() {
    this.paperStock = this.paperStock.replace(/\s+/g, '_');
    const payload = {
      name: this.paperStock.toUpperCase(),
      brands: this.selectedBrands
    };

    if (this.idFromQueryParam) {
      this.paperStockService.updatePaperStock(this.idFromQueryParam, payload).subscribe(
        (res: any) => {
          this.router.navigateByUrl('/paperStock');
        },
        (error) => {
          this.showError(error);
        }
      );
    } else {
      this.paperStockService.addPaperStock(payload).subscribe(
        (res: any) => {
          this.router.navigateByUrl('/paperStock');
        },
        (error) => {
          this.showError(error);
        }
      );
    }
  }
  showError(error: any) {
    this.messageService.add({ severity: 'error', summary: 'Error', detail: error.error.error });
  }
}