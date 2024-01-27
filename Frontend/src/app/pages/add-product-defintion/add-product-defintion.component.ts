import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ProductDefinitionService } from 'src/app/services/product-definition.service';
@Component({
  selector: 'app-add-product-defintion',
  templateUrl: './add-product-defintion.component.html',
  styleUrls: ['./add-product-defintion..component.css']
})
export class AddProductDefintionComponent implements OnInit {

  typesDropDown: any = ["TOGGLE", "TEXTFIELD", "DROPDOWN", "MULTIDROPDOWN"]
  statusDropDown: any = ["Active", "Inactive"]
  typeValue: String = ''
  nameValue: String = ''
  sequenceValue: String = ''
  statusValue: String = 'Active'
  pfvalueFlag: Boolean = false
  pfvaluesArray: any = []
  idFromQueryParam!: number
  fieldToUpdate: any = []
  buttonName: String = 'Add'
  visible!: boolean
  error: string = ''

  constructor(private productFieldService: ProductDefinitionService, private route: ActivatedRoute, private router: Router
    , private messageService: MessageService) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(param => {
      this.idFromQueryParam = +param['id']
      if (Number.isNaN(this.idFromQueryParam)) {
        this.buttonName = 'Add'
      } else {
        this.buttonName = 'Update';
        this.productFieldService.getProductDefintionById(this.idFromQueryParam).subscribe(res => {
          this.fieldToUpdate = res
          if (this.fieldToUpdate.type == "MULTIDROPDOWN" || this.fieldToUpdate.type == "DROPDOWN") {
            this.pfvalueFlag = true
          }
          this.pfvaluesArray = this.fieldToUpdate.productFieldValuesList
          this.nameValue = this.fieldToUpdate.name
          this.sequenceValue = this.fieldToUpdate.sequence
          this.statusValue = this.fieldToUpdate.status
          this.typeValue = this.fieldToUpdate.type
        }, error => {
          this.showError(error);
          this.visible = true;
        })
      }
    })
  }


  type() {
    if (this.typeValue == "DROPDOWN" || this.typeValue == "MULTIDROPDOWN") {
      if (Number.isNaN(this.idFromQueryParam)) {
        this.pfvaluesArray.length == 0 ? this.pfvaluesArray.push({ name: null, status: 'Active' }) : null;
      }
      this.pfvalueFlag = true
    }
  }

  addpfvalues() {
    this.pfvaluesArray.push({ name: null, status: "Active" });
  }

  removeElement(i: number) {
    if (!Number.isNaN(this.idFromQueryParam)) {
      this.productFieldService.deleteProductFieldValue(this.idFromQueryParam, this.pfvaluesArray[i].id).subscribe(() => {
      }, error => {
        this.showError(error);
        this.visible = true;
      })
    }
    this.pfvaluesArray.splice(i, 1)
  }

  addProduct() {
    this.typeValue == "TEXTFIELD" || this.typeValue == "TOGGLE" ? this.pfvaluesArray = [] : null;
    this.nameValue.split(' ');
    const result = this.nameValue
      .split(' ')
      .map((word: string) => word.toUpperCase())
      .join('_');
    this.pfvaluesArray.forEach((element: any) => {
      element.name = element.name.split(' ');
      element.name = element.name.map((word: any) => word.toUpperCase()).join('_')
    })
    let obj = {
      name: result,
      status: this.statusValue,
      sequence: this.sequenceValue,
      type: this.typeValue,
      productFieldValuesList: this.pfvaluesArray
    }
    if (Number.isNaN(this.idFromQueryParam)) {
      this.productFieldService.postProductField(obj).subscribe(() => {
        this.router.navigateByUrl('/productField')
      }, error => {
        this.showError(error);
        this.visible = true;
      })
    } else {
      this.productFieldService.updateField(this.idFromQueryParam, obj).subscribe(() => {
        this.router.navigateByUrl('/productField')
      }, error => {
        this.showError(error);
        this.visible = true;
      })
    }
  }
  isTypeValueEmpty(): boolean {
    return !this.typeValue;
  }
  showError(error: any) {
    this.messageService.add({ severity: 'error', summary: 'Error', detail: error.error.error });
  }
}
