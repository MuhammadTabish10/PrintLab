import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PressMachineService } from 'src/app/services/press-machine.service';
import { ProductDefinitionService } from 'src/app/services/product-definition.service';
import { ProductProcessService } from 'src/app/services/product-process.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css']
})
export class AddProductComponent implements OnInit {

  visible!: boolean
  error: string = ''
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
  pressMachineArray: any = []
  selectedMachine: any = {}
  machineIndex!: number
  arr = [{ id: 1, name: "a" }, { id: 2, name: "b" }, { id: 3, name: "c" }, { id: 4, name: "d" }, { id: 5, name: "e" }]

  constructor(private service: ProductService, private route: ActivatedRoute, private router: Router, private productProcessService: ProductProcessService, private productFieldService: ProductDefinitionService, private pressMachineService: PressMachineService) { }

  ngOnInit(): void {
    this.getFields()
    this.getProductProcessList()
    this.route.queryParams.subscribe(param => {
      this.idFromQueryParam = +param['id']
      if (Number.isNaN(this.idFromQueryParam)) {
        this.getPressMachines()
        this.buttonName = 'Add'
      } else {
        this.buttonName = 'Update'
        this.service.getById(this.idFromQueryParam).subscribe(res => {
          this.productToUpdate = res
          this.titleInput = this.productToUpdate.title
          this.status = this.productToUpdate.status
          this.productDefinition = this.productToUpdate.productDefinitionFieldList
          this.selectedMachine = this.productToUpdate.pressMachine
          this.process = this.productToUpdate.productDefinitionProcessList
          this.getPressMachines()
          this.process.forEach((el: any) => {
            this.service.getVendorByProcessId(el.productProcess.id).subscribe(res => {
              this.vendorList.push(res)
            }, error => {
              this.error = error.error.error
              this.visible = true;
            })
          })
          for (let i = 0; i < this.fieldList.length; i++) {
            if (this.productDefinition[i] != undefined) {
              if (this.fieldList[i].id == this.productDefinition[i].productField.id) {
                this.publicArray[i] = this.productDefinition[i].isPublic
                this.valuesSelected[i] = []
                this.productDefinition[i].selectedValues.forEach((el: any) => {
                  this.valuesSelected[i].push(el.productFieldValue)
                })
              }
            }
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
          }
        }, error => {
          this.error = error.error.error
          this.visible = true;
        })
      }
    })
  }

  getStatusValue() {
    this.status = !this.status
  }

  showPublic(i: any, id: any) {

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
  }

  productDefinitionComposing(field: any, obj: any, publicIndex: any) {

    let object: any
    obj.hasOwnProperty('itemValue') ? object = obj.itemValue : object = obj.value
    if (this.productDefinition.length == 0) {
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
                if (!Number.isNaN(this.idFromQueryParam)) {
                  this.service.deleteSelectedField(this.idFromQueryParam, element.id, element.selectedValues[index].id).subscribe(res => {
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
            selectedValues: values
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
    this.valuesAddFlag = false
  }

  postProduct() {

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
        pressMachine: this.selectedMachine,
        productDefinitionProcessList: this.process,
      };

      this.service.addProduct(obj).subscribe(res => {

        this.router.navigateByUrl('/products')
      }, error => {
        this.error = error.error.error
        this.visible = true;
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
        pressMachine: this.selectedMachine,
        productDefinitionProcessList: this.process,
      };
      this.service.updateProduct(this.idFromQueryParam, obj).subscribe()
      this.service.getProducts().subscribe(res => {

        this.router.navigateByUrl('/products')
      }, error => {
        this.error = error.error.error
        this.visible = true;
      })
    }
  }

  selectProcess(obj: any, i: any) {
    this.service.getVendorByProcessId(obj.id).subscribe(res => {

      if (this.process[i].productProcess.id == obj.id) {
        this.vendorList[i] = res
      } else {
        this.vendorList.push(res)
      }
      // this.vendorList = res
    })
  }
  getFields() {
    this.productFieldService.getProductDefintion().subscribe(res => {
      this.fieldList = res
      this.fieldList.forEach((field: any) => {
        field.type != 'TEXTFIELD' && field.type != 'TOGGLE' ? this.publicArray.push(false) : this.publicArray.push(null)
        if (field.type == 'TOGGLE') {
          this.toggleFlag.push(true)
        } else {
          this.toggleFlag.push(null)
        }
        field.type == 'TEXTFIELD' ? this.titleObj = field : null
      })
    }, error => {
      this.error = error.error.error
      this.visible = true;
    })
  }
  getProductProcessList() {
    this.productProcessService.getProductProcess().subscribe(res => {
      this.productProcessList = res
    }, error => {
      this.error = error.error.error
      this.visible = true;
    })
  }
  getToggleValue(i: any) {

    this.toggleFlag[i] = !this.toggleFlag[i]
  }
  generateElement() {
    this.process.push({ productProcess: null, vendor: null });
  }
  removeElement(index: number) {

    if (!Number.isNaN(this.idFromQueryParam)) {
      this.service.deleteProcess(this.idFromQueryParam, this.process[index].id).subscribe(res => {
        this.process.splice(index, 1);
        this.vendorList.splice(index, 1);

      }, error => {
        this.error = error.error.error
        this.visible = true;
      })
    } else {
      this.process.splice(index, 1);
      this.vendorList.splice(index, 1);
    }
  }

  getPressMachines() {
    this.pressMachineService.getPressMachine().subscribe(res => {
      this.pressMachineArray = res
      !Number.isNaN(this.idFromQueryParam) ? this.machineIndex = this.pressMachineArray.findIndex((el: any) => el.id == this.selectedMachine.id) : null
    })
  }

  machine(obj: any) {
    this.selectedMachine = obj
  }

  get id(): boolean {
    return Number.isNaN(this.idFromQueryParam)
  }
}
