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
  impositionFlag: Boolean = true
  productProcessList: any = []
  vendorList: any = []
  process: any = []
  titleInput: String = ''
  imposition: String = "Yes"
  buttonName: String = 'Add'
  idFromQueryParam: any
  productToUpdate: any
  selectedValues: any = []
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
          this.process = this.productToUpdate[0].process
          this.productDefinition = this.productToUpdate[0].productDefinitionField
          this.productToUpdate[0].productDefinitionField.filter((el: any) => {
            el.name == "Title" ? this.titleInput = el.value : null;
            el.name == "Imposition" ? this.imposition = el.value : null
            this.imposition == "Yes" ? this.impositionFlag = true : this.impositionFlag = false
          })
          // el.hasOwnProperty("public")?
          for (const field of this.fieldList) {
            let flagForUpdate = true
            for (const values of this.productToUpdate[0].productDefinitionField) {
              if (field.id == values.id && values.productFieldValuesList) {
                this.selectedValues.push(values.productFieldValuesList)
                field.public = values.public
                flagForUpdate = false
                break
              } else {
                flagForUpdate = true
              }
            }
            flagForUpdate ? this.selectedValues.push([]) : null
          }
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
      if (Array.isArray(object)) {
        this.productDefinition.push({
          isPublic: this.publicArray[publicIndex],
          productField: field,
          productDefinationSelectedValues: object
          // id: field.id,
          // name: field.name,
          // isPublic: field.public,
          // productFieldValuesList: object
        })
      } else {
        this.valuesArr.push(object)
        this.productDefinition.push({
          isPublic: this.publicArray[publicIndex],
          productField: field,
          productDefinationSelectedValues: this.valuesArr
          // id: field.id,
          // name: field.name,
          // public: field.public,
          // productFieldValuesList: this.valuesArr
        })
      }
    } else {
      for (const element of this.productDefinition) {
        if (element.productField.id == field.id) {
          if (Array.isArray(object)) {
            if (element.productDefinationSelectedValues.length == field.productFieldValuesList.length) {
              const indoxOfElement = this.productDefinition.indexOf(element);
              this.productDefinition.splice(indoxOfElement, 1);
            }
            else {
              element.productDefinationSelectedValues = []
              element.productDefinationSelectedValues = object
            }
            this.valuesAddFlag = false
            break
          } else {
            if (field.type == "DROPDOWN") {
              element.productDefinationSelectedValues[0] = object
              this.valuesAddFlag = false
              break
            } else {
              const index = element.productDefinationSelectedValues.findIndex((el: any) => el.id === object.id);
              if (index == -1) {
                element.productDefinationSelectedValues.push(object);
              } else {
                debugger
                element.productDefinationSelectedValues.splice(index, 1);
                if (element.productDefinationSelectedValues.length == 0) {
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
          this.productDefinition.push({
            isPublic: this.publicArray[publicIndex],
            productField: field,
            productDefinationSelectedValues: object
            // id: field.id,
            // name: field.name,
            // public: field.public,
            // productFieldValuesList: object
          })
        } else {
          let valuesSelected = []
          valuesSelected.push(object)
          this.productDefinition.push({
            isPublic: this.publicArray[publicIndex],
            productField: field,
            productDefinationSelectedValues: valuesSelected
            // id: field.id,
            // name: field.name,
            // public: field.public,
            // productFieldValuesList: valuesSelected
          })
        }
      }
    }
    this.productDefinition = this.productDefinition.filter((obj: any) =>
      obj.hasOwnProperty('productDefinationSelectedValues') ? obj.productDefinationSelectedValues.length > 0 : null);
    this.productDefinition.sort((a: any, b: any) => a.id - b.id);
    this.valuesAddFlag = false
    console.log(this.productDefinition);
  }

  postProduct() {
    debugger
    if (Number.isNaN(this.idFromQueryParam)) {
      this.productDefinition.push({
        value: this.imposition,
        productField: this.impostionObj
      })
      console.log(this.productDefinition);
      const obj = {
        title: this.titleInput,
        status: this.status,
        productDefinitionFieldList: this.productDefinition,
        productDefinitionProcessDtoList: this.process,
      };
      console.log(obj);
      this.service.addProduct(obj).subscribe(res => {
        this.router.navigateByUrl('/products')
      })
    } else {
      this.productDefinition.forEach((field: any) => {
        field.name == 'Imposition' ? field.value = this.imposition : null;
      })
      const obj = {
        productDefinitionField: this.productDefinition,
        process: this.process,
      };
      this.service.updateProduct(this.idFromQueryParam, obj).subscribe()
      this.service.getProducts().subscribe(res => {
        // let newProductsArray = res
        // this.service.getNewProducts(newProductsArray)
        this.router.navigateByUrl('/products')
      })
    }
  }

  selectProcess(obj: any, i: any) {
    this.service.getVendorByProcessId(obj.id).subscribe(res => {
      debugger
      if (this.process[i].product.id == obj.id) {
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
        field.type == 'TEXTFIELD' ? this.titleObj = field : null
        field.type == 'TOGGLE' ? this.impostionObj = field : null
      })
    })
  }
  getProductProcessList() {
    this.productProcessService.getProductProcess().subscribe(res => {
      this.productProcessList = res
      // console.log(this.productProcessList);
    })
  }
  getImpositionValue() {
    this.impositionFlag = !this.impositionFlag
    this.impositionFlag ? this.imposition = "Yes" : this.imposition = "No"
  }
  generateElement() {
    this.process.push({ product: null, vendor: null });
  }
  removeElement(index: number) {
    this.process.splice(index, 1);
    this.vendorList.splice(index, 1);
  }
}