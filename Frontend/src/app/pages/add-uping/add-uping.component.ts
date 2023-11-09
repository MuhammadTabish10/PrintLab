import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { forkJoin, take } from 'rxjs';
import { PaperSizeService } from 'src/app/services/paper-size.service';
import { PressMachineService } from 'src/app/services/press-machine.service';
import { ProductDefinitionService } from 'src/app/services/product-definition.service';
import { UpingService } from 'src/app/services/uping.service';

@Component({
  selector: 'app-add-uping',
  templateUrl: './add-uping.component.html',
  styleUrls: ['./add-uping.component.css']
})
export class AddUpingComponent implements OnInit {

  visible!: boolean
  error: string = ''
  buttonName: string = 'Add'
  productSizeValue: string = ''
  idFromQueryParam!: number
  upingToUpdate: any = []
  paperSizesArray: any = []
  maxLength!: number
  selectedSizes: any = []
  value: any = []
  paperSize: any = []
  placeHolder: any = []
  upingSizeId: any = []
  elementsGenerated: boolean = false;
  category: any;
  categoryArray: any;
  unit: any;
  unitArray: any;
  productFieldArray: any;
  l1: any;
  l2: any;

  // selectedUnit: any;
  unitLabelInch: any;
  selectedUnit: string = 'inches';
  unitLabelInch2: any;
  unitLabelMm: any;
  unitLabelMm2: any;

  constructor(private upingService: UpingService,
    private paperSizeService: PaperSizeService,
    private route: ActivatedRoute,
    private router: Router, private messageService: MessageService,
    private productField: ProductDefinitionService) { }


  ngOnInit(): void {
    this.getPaperSizes()
    forkJoin([
      this.getProductFields(),
      this.route.queryParams.pipe(take(1)),
    ]).subscribe(([productFields, queryParams]) => {
      this.handleProductFieldsResponse(productFields);
      this.handleQueryParams(queryParams);
    });
  }


  getProductFields() {
    return this.productField.getProductField();
  }


  handleProductFieldsResponse(productFields: any) {
    this.productFieldArray = productFields;
    this.categoryArray = this.productFieldArray.find((item: any) => item.name.toLowerCase() === 'Category'.toLowerCase());
    this.unitArray = this.productFieldArray.find((item: any) => item.name.toLowerCase() === 'unit'.toLowerCase());
  }

  handleQueryParams(queryParams: any) {
    this.idFromQueryParam = +queryParams['id'];
    if (Number.isNaN(this.idFromQueryParam)) {
      this.buttonName = 'Add';
    } else {
      this.getProductFields();
      this.upingService.getUpingById(this.idFromQueryParam).subscribe(
        (res) => {
          this.buttonName = 'Update'
          this.upingToUpdate = res
          this.productSizeValue = this.upingToUpdate.productSize
debugger
          this.l1 = this.upingToUpdate.l1;
          this.l2 = this.upingToUpdate.l2;

          this.unit = this.unitArray.productFieldValuesList?.find((u: any) => u.name === this.upingToUpdate.unit);
          this.category = this.categoryArray.productFieldValuesList?.find((c: any) => c.name === this.upingToUpdate.category)
          this.onUnitChange(this.category);
          this.upingToUpdate.upingPaperSize.filter((item: any) => {
            this.upingSizeId.push(item.id)
            this.value.push(item.value)
            this.selectedSizes.push(item.paperSize)
            this.paperSize.push({})
            this.placeHolder.push(item.paperSize.label)
            this.paperSizesArray.forEach((el: any) => {
              if (el.id == item.paperSize.id) {
                let index = this.paperSizesArray.indexOf(el)
                this.paperSizesArray.splice(index, 1)
              }
            })
          })
        }, (error) => {
          this.showError(error);
          this.visible = true;
        }
      );
    }
  }

  addUping() {
    if (Number.isNaN(this.idFromQueryParam)) {
      for (let i = 0; i < this.selectedSizes.length; i++) {
        this.selectedSizes[i] = {
          paperSize: this.selectedSizes[i],
          value: this.value[i]
        }
      }
      let obj = {
        productSize: this.productSizeValue,
        category: this.category.name,
        l1: this.l1,
        l2: this.l2,
        unit: this.unit.name,
        mm: this.unitLabelInch + 'x' + this.unitLabelInch2,
        inch: this.unitLabelMm + 'x' + this.unitLabelMm2,
        upingPaperSize: this.selectedSizes
      }
      this.upingService.postUping(obj).subscribe(() => {
        this.router.navigateByUrl('/uping')
      }, error => {
        this.showError(error);
        this.visible = true;
      })
    } else {
      for (let i = 0; i < this.selectedSizes.length; i++) {
        this.selectedSizes[i] = {
          id: this.upingSizeId[i],
          paperSize: this.selectedSizes[i],
          value: this.value[i]
        }
      }

      let obj = {

        productSize: this.productSizeValue,
        category: this.category.name,
        l1: this.l1,
        l2: this.l2,
        unit: this.unit.name,
        mm: this.unitLabelInch + 'x' + this.unitLabelInch2,
        inch: this.unitLabelMm + 'x' + this.unitLabelMm2,
        upingPaperSize: this.selectedSizes
      }
      this.upingService.updateUping(this.idFromQueryParam, obj).subscribe(() => {
        this.router.navigateByUrl('/uping')
      }, error => {
        this.showError(error);
        this.visible = true;
      })
    }
  }

  generateElement() {
    this.elementsGenerated = true;
    this.placeHolder.push('Select Label')
    this.paperSize.length != this.maxLength ? this.paperSize.push({}) : alert('Reached machine sizes limit');
  }

  removeElement(index: number) {
    if (!Number.isNaN(this.idFromQueryParam)) {
      this.upingService.deleteUpingSize(this.idFromQueryParam, this.upingSizeId[index]).subscribe(() => { }, error => {
        this.showError(error);
        this.visible = true;
      })
      this.upingSizeId.splice(index, 1)
    }
    this.selectedSizes[index] ? this.paperSizesArray.push(this.selectedSizes[index]) : null
    this.selectedSizes.splice(index, 1);
    this.value.splice(index, 1);
    this.paperSize.splice(index, 1)
  }

  addSize(object: any, i: any) {
    this.selectedSizes[i] ? this.paperSizesArray.push(this.selectedSizes[i]) : null;
    this.selectedSizes[i] = object
    for (let i = this.paperSizesArray.length - 1; i >= 0; i--) {
      const foundIndex = this.selectedSizes.findIndex((item: any) => item.id === this.paperSizesArray[i].id);
      if (foundIndex !== -1) {
        this.paperSizesArray.splice(i, 1);
      }
    }
  }

  getPaperSizes() {
    this.paperSizeService.getPaperSize().subscribe(res => {
      this.paperSizesArray = res
      this.maxLength = this.paperSizesArray.length
    }, error => {
      this.showError(error);
      this.visible = true;
    })
  }

  showError(error: any) {
    this.messageService.add({ severity: 'error', summary: 'Error', detail: error.error.error });
  }


  onUnitChange(value: any) {

    if (value.name === 'INCHES') {
      this.unitLabelInch = (Number(this.l1) * 25.4).toFixed(1);
      this.unitLabelInch2 = (Number(this.l2) * 25.4).toFixed(1);
      this.unitLabelMm = this.l1
      this.unitLabelMm2 = this.l2
    } else {
      this.unitLabelMm = (Number(this.l1) / 25.4).toFixed(1);
      this.unitLabelMm2 = (Number(this.l2) / 25.4).toFixed(1);
      this.unitLabelInch = this.l1
      this.unitLabelInch2 = this.l2
    }
  }
}
