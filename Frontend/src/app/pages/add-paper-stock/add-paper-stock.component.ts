import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PaperStockService } from 'src/app/services/paper-stock.service';

@Component({
  selector: 'app-add-paper-stock',
  templateUrl: './add-paper-stock.component.html',
  styleUrls: ['./add-paper-stock.component.css']
})
export class AddPaperStockComponent {

  buttonName: any = 'Add'
  allBrands: any = []
  selectedBrands: any = []
  paperStock: any;
  idFromQueryParam: any;
  selectedBrandsForEdit: any = []
  selectedBrandsForEdit1: any = []
  selectedTitle: any;

  constructor(private paperStockService: PaperStockService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): any {

    this.getBrands()
    this.route.queryParams.subscribe(param => {
      this.idFromQueryParam = +param['id']
    })

    if (Number.isNaN(this.idFromQueryParam)) {
      this.buttonName = 'Add'
    } else {
      this.buttonName = 'Update'

      this.getPaperStockById(this.idFromQueryParam)
    }
  }

  getBrands() {
    this.paperStockService.getBrandsByName().subscribe((res: any) => {
      this.allBrands = res.productFieldValuesList
    })
  }

  getPaperStockById(id: any) {
    this.paperStockService.getById(id).subscribe((res: any) => {
      this.getBrands()
      this.selectedBrandsForEdit = res.brands
      this.selectedBrandsForEdit.forEach((selectedBrandName: any) => {
        this.selectedBrandsForEdit1.push(this.allBrands.find((el: any) => el.name.toLowerCase() == selectedBrandName.name.toLowerCase()))
      });

      this.selectedBrands = this.selectedBrandsForEdit

      this.paperStock = res.name
    })
  }

  brandsChanged(event: any) {
    
    this.selectedBrands = []; // Ensure the array is empty before adding objects

    if (this.idFromQueryParam) {
      event.value.forEach((element: any) => {
        let obj = {
          name: element.name,
          id: element.id
        };

        this.selectedBrands.push(obj);
      });
    } else {

      event.value.forEach((element: any) => {
        let obj = {
          name: element.name
        };

        this.selectedBrands.push(obj);
      });
    }


  }


  addPaperStock() {

    const payload = {
      name: this.paperStock,
      brands: this.selectedBrands
    };


    if (this.idFromQueryParam) {
      this.paperStockService.updatePaperStock(this.idFromQueryParam, payload).subscribe((res: any) => {
        this.router.navigateByUrl('/paperStock')
      })
    } else {

      this.paperStockService.addPaperStock(payload).subscribe((res: any) => {
        this.router.navigateByUrl('/paperStock')

      })
    }

  }

}
