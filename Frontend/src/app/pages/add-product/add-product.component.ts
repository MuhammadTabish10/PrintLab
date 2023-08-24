import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductDefinitionService } from 'src/app/services/product-definition.service';
import { ProductProcessService } from 'src/app/services/product-process.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css']
})
export class AddProductComponent implements OnInit {

  fieldList: any = []
  productDefinition: any = [];
  valuesArr: any = []
  valuesAddFlag: Boolean = false
  toggleFlag: any = []
  productProcessList: any = []
  vendorList: any = []
  process: any = []
  titleInput: String = ''
  buttonName: String = 'Add'
  idFromQueryParam: any
  productToUpdate: any
  valuesSelected: any = []
  titleObj: any = {}
  impostionObj: any = {}
  publicArray: any = []
  status: boolean = true

  constructor(private service: ProductService, private route: ActivatedRoute, private router: Router, private productProcessService: ProductProcessService, private productFieldService: ProductDefinitionService) { }

  ngOnInit(): void {
    this.getFields()
    this.getProductProcessList()
    this.route.queryParams.subscribe(param => {
      this.idFromQueryParam = +param['id']
      if (Number.isNaN(this.idFromQueryParam)) {
        this.buttonName = 'Add'
      } else {
        this.buttonName = 'Update'
        this.service.getById(this.idFromQueryParam).subscribe(res => {
          this.productToUpdate = res
          this.titleInput = this.productToUpdate.title
          this.status = this.productToUpdate.status
          this.productDefinition = this.productToUpdate.productDefinitionFieldList
          this.process = this.productToUpdate.productDefinitionProcessList
          this.process.forEach((el: any) => {
            this.service.getVendorByProcessId(el.productProcess.id).subscribe(res => {
              this.vendorList.push(res)
            })
          })
          debugger
          for (let i = 0; i < this.fieldList.length; i++) {
            if (this.fieldList[i].id == this.productDefinition[i].productField.id) {
              this.publicArray[i] = this.productDefinition[i].isPublic
              this.valuesSelected[i] = []
              this.productDefinition[i].selectedValues.forEach((el: any) => {
                this.valuesSelected[i].push(el.productFieldValue)
              })
            }
            console.log(this.productToUpdate.productDefinitionFieldList);
            if (this.fieldList[i].type == 'TOGGLE') {
              this.toggleFlag = []
              this.productToUpdate.productDefinitionFieldList.forEach((el: any) => {
                if (el.productField.type == 'TOGGLE' && this.fieldList[i].id == el.productField.id) {
                  let v = undefined
                  el.selectedValues[0].value == 'true' ? v = true : v = false
                  this.toggleFlag.push(v)
                } else {
                  this.toggleFlag.push(null)
                }
              })
            }
            console.log(this.toggleFlag);
          }

          // console.log(this.valuesSelected);
          console.log(this.productDefinition);
        })
      }
    })
  }

  getStatusValue() {
    this.status = !this.status
    console.log(this.status);
  }

  showPublic(i: any, id: any) {
    debugger
    let flag = false
    for (const el of this.productDefinition) {
      if (el.productField.id == id) {
        el.isPublic = !el.isPublic
        flag = false
        break
      } else {
        flag = true
      }
    }
    flag ? this.publicArray[i] = !this.publicArray[i] : null
    console.log(this.productDefinition);
  }

  productDefinitionComposing(field: any, obj: any, publicIndex: any) {
    debugger
    let object: any
    obj.hasOwnProperty('itemValue') ? object = obj.itemValue : object = obj.value
    if (this.productDefinition.length == 0) {
      console.log(object);
      if (Array.isArray(object)) {
        let values: any = []
        for (let i = 0; i < object.length; i++) {
          values[i] = { productFieldValue: object[i] }
        }
        this.productDefinition.push({
          isPublic: this.publicArray[publicIndex],
          productField: field,
          selectedValues: values
        })
      } else {
        this.valuesArr.push({ productFieldValue: object })
        this.productDefinition.push({
          isPublic: this.publicArray[publicIndex],
          productField: field,
          selectedValues: this.valuesArr
        })
      }
    } else {
      for (const element of this.productDefinition) {
        if (element.productField.id == field.id) {
          if (Array.isArray(object)) {
            if (element.selectedValues.length == field.productFieldValuesList.length) {
              const indoxOfElement = this.productDefinition.indexOf(element);
              this.productDefinition.splice(indoxOfElement, 1);

            }
            else {
              element.selectedValues = []
              let values: any = []
              for (let k = 0; k < object.length; k++) {
                values[k] = { productFieldValue: object[k] }
              }
              element.selectedValues = values
            }
            this.valuesAddFlag = false
            break
          } else {
            if (field.type == "DROPDOWN") {
              element.selectedValues[0].productFieldValue = object
              this.valuesAddFlag = false
              break
            } else {
              const index = element.selectedValues.findIndex((el: any) => el.productFieldValue.id === object.id);
              if (index == -1) {
                element.selectedValues.push({ productFieldValue: object });
              } else {
                debugger
                if (!Number.isNaN(this.idFromQueryParam)) {
                  this.service.deleteSelectedField(this.idFromQueryParam, element.id, object.id).subscribe(res => {
                    debugger
                    element.selectedValues.splice(index, 1);
                  })
                }
                if (element.selectedValues.length == 0) {
                  const indoxOfElement = this.productDefinition.indexOf(element);
                  this.productDefinition.splice(indoxOfElement, 1);
                }
              }
              this.valuesAddFlag = false
              break
            }
          }
        } else {
          this.valuesAddFlag = true
        }
      }

      if (this.valuesAddFlag) {
        if (Array.isArray(object)) {
          let values: any = []
          for (let i = 0; i < object.length; i++) {
            values[i] = { productFieldValue: object[i] }
          }
          this.productDefinition.push({
            isPublic: this.publicArray[publicIndex],
            productField: field,
            selectedValues: object
          })
        } else {
          let valueSelected = []
          valueSelected.push({ productFieldValue: object })
          this.productDefinition.push({
            isPublic: this.publicArray[publicIndex],
            productField: field,
            selectedValues: valueSelected
          })
        }
      }
    }
    // this.productDefinition = this.productDefinition.filter((obj: any) =>{
    //   obj.hasOwnProperty('selectedValues') ? obj.selectedValues.length > 0 : null});
    // this.productDefinition.sort((a: any, b: any) => a.id - b.id);
    this.valuesAddFlag = false
    console.log(this.productDefinition);
  }

  postProduct() {
    debugger
    if (Number.isNaN(this.idFromQueryParam)) {
      for (let i = 0; i < this.fieldList.length; i++) {
        if (this.fieldList[i].type == 'TOGGLE') {
          this.productDefinition.push({
            selectedValues: [{ value: this.toggleFlag[i] }],
            productField: this.fieldList[i]
          })
        }
      }
      const obj = {
        title: this.titleInput,
        status: this.status,
        productDefinitionFieldList: this.productDefinition,
        productDefinitionProcessList: this.process,
      };
      console.log(obj);
      debugger
      this.service.addProduct(obj).subscribe(res => {
        debugger
        this.router.navigateByUrl('/products')
      })
    } else {
      for (let i = 0; i < this.productDefinition.length; i++) {
        for (let j = 0; j < this.fieldList.length; j++) {
          this.productDefinition[i].productField.id == this.fieldList[j].id ? this.productDefinition[i].selectedValues[0].value = this.toggleFlag[i] : null
        }
      }
      const obj = {
        id: this.idFromQueryParam,
        title: this.titleInput,
        status: this.status,
        productDefinitionFieldList: this.productDefinition,
        productDefinitionProcessList: this.process,
      };
      this.service.updateProduct(this.idFromQueryParam, obj).subscribe()
      this.service.getProducts().subscribe(res => {
        debugger
        this.router.navigateByUrl('/products')
      })
    }
  }

  selectProcess(obj: any, i: any) {
    this.service.getVendorByProcessId(obj.id).subscribe(res => {
      debugger
      if (this.process[i].productProcess.id == obj.id) {
        this.vendorList[i] = res
      } else {
        this.vendorList.push(res)
      }
      console.log(this.vendorList);
      // this.vendorList = res
      // console.log(this.vendorList);
    })
  }
  getFields() {
    this.productFieldService.getProductDefintion().subscribe(res => {
      this.fieldList = res
      console.log(this.fieldList);
      this.fieldList.forEach((field: any) => {
        field.type != 'TEXTFIELD' && field.type != 'TOGGLE' ? this.publicArray.push(false) : this.publicArray.push(null)
        if (field.type == 'TOGGLE') {
          this.toggleFlag.push(true)
        } else {
          this.toggleFlag.push(null)
        }
        field.type == 'TEXTFIELD' ? this.titleObj = field : null
      })
    })
  }
  getProductProcessList() {
    this.productProcessService.getProductProcess().subscribe(res => {
      this.productProcessList = res
      // console.log(this.productProcessList);
    })
  }
  getToggleValue(i: any) {
    debugger
    this.toggleFlag[i] = !this.toggleFlag[i]
    console.log(this.toggleFlag);
  }
  generateElement() {
    this.process.push({ productProcess: null, vendor: null });
  }
  removeElement(index: number) {
    debugger
    if (!Number.isNaN(this.idFromQueryParam)) {
      this.service.deleteProcess(this.idFromQueryParam, this.process[index].id).subscribe(res => {
        this.process.splice(index, 1);
        this.vendorList.splice(index, 1);
        debugger
      })
    } else {
      this.process.splice(index, 1);
      this.vendorList.splice(index, 1);
    }
  }
}