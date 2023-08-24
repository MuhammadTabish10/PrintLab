import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
  statusValue: String = ''
  pfvalueFlag: Boolean = false
  pfvaluesArray: any = []
  idFromQueryParam!: number
  fieldToUpdate: any = []
  buttonName: String = 'Add'

  constructor(private productFieldService: ProductDefinitionService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(param => {
      this.idFromQueryParam = +param['id']
      Number.isNaN(this.idFromQueryParam) ? this.buttonName = 'Add' : this.buttonName = 'Update';
      this.productFieldService.getProductDefintionById(this.idFromQueryParam).subscribe(res => {
        // debugger
        this.fieldToUpdate = res
        console.log(this.fieldToUpdate);
        if (this.fieldToUpdate.type == "MULTIDROPDOWN" || this.fieldToUpdate.type == "DROPDOWN") {
          this.pfvalueFlag = true
        }
        this.pfvaluesArray = this.fieldToUpdate.productFieldValuesList
        this.nameValue = this.fieldToUpdate.name
        this.sequenceValue = this.fieldToUpdate.sequence
        this.statusValue = this.fieldToUpdate.status
        this.typeValue = this.fieldToUpdate.type
        console.log(this.pfvaluesArray);
      })
    })
  }


  type() {
    debugger
    if (this.typeValue == "DROPDOWN" || this.typeValue == "MULTIDROPDOWN") {
      if (Number.isNaN(this.idFromQueryParam)) {
        this.pfvaluesArray.length == 0 ? this.pfvaluesArray.push({ name: null, status: null }) : null;
      }
      this.pfvalueFlag = true
    } else {
      if (!Number.isNaN(this.idFromQueryParam)) {
        if (this.typeValue == "TEXTFIELD" || this.typeValue == "TOGGLE") {

        }
      }
      this.pfvaluesArray = []
      this.pfvalueFlag = false
    }
  }

  addpfvalues() {
    this.pfvaluesArray.push({ name: null, status: null });
    console.log(this.pfvaluesArray);
  }

  removeElement(i: number) {
    debugger
    if (!Number.isNaN(this.idFromQueryParam)) {
      this.productFieldService.deleteProductFieldValue(this.idFromQueryParam, this.pfvaluesArray[i].id).subscribe(res => {
        debugger
      })
    }
    this.pfvaluesArray.splice(i, 1)
    // if (Number.isNaN(this.idFromQueryParam)) {
    //   this.pfvaluesArray.splice(index, 1);
    // } else {
    //   let pfId = this.fieldToUpdate.productFieldValuesList[index].id
    //   this.productFieldService.deleteProductFieldValue(id, pfId).subscribe(res => {
    //     debugger
    //     console.log(res);
    //   })
    //   this.pfvaluesArray.splice(index, 1)
    // }
  }

  addProduct() {
    debugger
    this.typeValue == "TEXTFIELD" || this.typeValue == "TOGGLE" ? this.pfvaluesArray = [] : null;
    let obj = {
      name: this.nameValue,
      status: this.statusValue,
      sequence: this.sequenceValue,
      type: this.typeValue,
      productFieldValuesList: this.pfvaluesArray
    }
    if (Number.isNaN(this.idFromQueryParam)) {
      this.productFieldService.postProductField(obj).subscribe(res => {
        // debugger
        console.log(res);
        this.router.navigateByUrl('/productField')
      })
    } else {
      this.productFieldService.updateField(this.idFromQueryParam, obj).subscribe(res => {
        debugger
        this.router.navigateByUrl('/productField')
      })
    }
  }
}