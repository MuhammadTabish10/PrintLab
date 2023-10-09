import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PressMachineService } from 'src/app/services/press-machine.service';
import { ProductDefinitionService } from 'src/app/services/product-definition.service';
import { ProductProcessService } from 'src/app/services/product-process.service';
import { ProductService } from 'src/app/services/product.service';
import { SettingsService } from 'src/app/services/settings.service';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css']
})
export class AddProductComponent implements OnInit {

  private gsmFieldIndex: number = 1;
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
  elementGenerated: boolean = false;
  fieldsToDisplay: any[] = [];
  gsmArray: any;
  gsmField: any = [];
  gsmName: any;
  obj1: any;
  productGsm: any = [];
  collectValues: any;
  containPaper: any;
  finalArray: any=[];

  constructor(private service: ProductService, private route: ActivatedRoute, private router: Router, private productProcessService: ProductProcessService, private productFieldService: ProductDefinitionService, private pressMachineService: PressMachineService,
    private settingService: SettingsService) { }

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
          this.productDefinition = this.productToUpdate.newProduct
          this.selectedMachine = this.productToUpdate.pressMachine
          this.getPressMachines()
          // this.process.forEach((el: any) => {
          //   this.service.getVendorByProcessId(el.productProcess.id).subscribe(res => {
          //     this.vendorList.push(res)
          //   }, error => {
          //     this.error = error.error.error
          //     this.visible = true;
          //   })
          // })
          // for (let i = 0; i < this.fieldsToDisplay.length; i++) {
          //   if (this.productDefinition != undefined) {
          //     if (this.fieldsToDisplay[i].id == this.productDefinition.productGsm[i].id) {
          //       this.publicArray[i] = this.productDefinition[i].isPublic
          //       this.valuesSelected[i] = []
          //       this.productDefinition[i].selectedValues.forEach((el: any) => {
          //         this.valuesSelected[i].push(el.productFieldValue)
          //       })
          //     }
          //   }
          //   if (this.fieldsToDisplay[i].type == 'TOGGLE') {
          //     this.toggleFlag = []
          //     this.productToUpdate.productDefinitionfieldsToDisplay.forEach((el: any) => {
          //       if (el.productField.type == 'TOGGLE' && this.fieldsToDisplay[i].id == el.productField.id) {
          //         let v = undefined
          //         el.selectedValues[0].value == 'true' ? v = true : v = false
          //         this.toggleFlag.push(v)
          //       } else {
          //         this.toggleFlag.push(null)
          //       }
          //     })
          //   }
          // }
          if (this.productDefinition) {
            for (const key in this.productDefinition) {
              if (this.productDefinition.hasOwnProperty(key)) {
                const value = this.productDefinition[key];
                if (key === "productGsm" && Array.isArray(value)) {
                  // Iterate over the objects within the "productGsm" array
                  for (const product of value) {
                    for (let i = 0; i < this.fieldsToDisplay.length; i++) {
                      const fieldsForGsm = this.fieldsToDisplay[i].name.toLowerCase().replace(/[\s()]/g, '').replace(/gsm/g, '');
                      const keysForGsm = product.name.toLowerCase()
                      const commaSeparatedString = product.value;
                      const valueArray = commaSeparatedString.split(',');
                      let j = 1;
                      for (const value of valueArray) {
                        this.finalArray.push({id:j++,name:value});
                      }
                      if (fieldsForGsm == keysForGsm) {

                      }
                    }
                  }
                }
                console.log(`Key: ${key}, Value: ${value}`);
                for (let i = 0; i < this.fieldsToDisplay.length; i++) {
                  if (key != undefined && key != null) {
                    const fields = this.fieldsToDisplay[i].name.toLowerCase().replace(/[\s()]/g, '');
                    const keys = key.toLowerCase()
                    if (keys.startsWith("is") && keys.endsWith("public")) {
                      this.publicArray[i] = keys.startsWith("is") && keys.endsWith("public");
                      this.fieldsToDisplay[i].isPublic = this.publicArray[i];
                    }
                    if (fields == keys) {

                      this.valuesSelected[i] = []
                      this.fieldsToDisplay[i].selectedValues = value === "jobColorFront" ? value : JSON.parse(value);

                      this.valuesSelected[i] = (this.fieldsToDisplay[i].selectedValues)
                      if (this.fieldsToDisplay[i].name === "Paper Stock") {
                        this.fieldsToDisplay[i].selectedValues.forEach((element: any) => {
                          this.valuesSelected[i] = (this.fieldsToDisplay[i].selectedValues)
                          ;
                          let data = element;
                          data['selectedValues'] = this.finalArray
                          this.selectPaperStock(element, i)
                          // for (let i = 0; i < (element).selectedValues.length; i++) {
                          // }
                        });
                      }
                      console.log("new log", this.fieldsToDisplay);
                      console.log("GSM log", this.valuesSelected);
                    }
                  }
                }
              }
            }
          }
          // this.restructureData(this.productDefinition)
        }, error => {
          this.error = error.error.error
          this.visible = true;
        })
      }
    })
  }

  // restructureData(data: any) {
  //   const {
  //     id,
  //     imposition,
  //     isJobColorBackPublic,
  //     isJobColorFrontPublic,
  //     isPaperStockPublic,
  //     isPrintSidePublic,
  //     isQuantityPublic,
  //     isSizePublic,
  //     jobColorBack,
  //     jobColorFront,
  //     paperStock,
  //     printSide,
  //     productGsm,
  //     quantity,
  //     size
  //   } = data;

  //   const restructuredData = {
  //     id,
  //     imposition,
  //     isJobColorBackPublic,
  //     isJobColorFrontPublic,
  //     isPaperStockPublic,
  //     isPrintSidePublic,
  //     isQuantityPublic,
  //     isSizePublic,
  //     jobColorBack: JSON.parse(jobColorBack),
  //     jobColorFront: JSON.parse(jobColorFront),
  //     paperStock: JSON.parse(paperStock),
  //     printSide: JSON.parse(printSide),
  //     productGsm: this.parseProductGsm(productGsm), // Call a function to parse productGsm
  //     quantity: JSON.parse(quantity),
  //     size: JSON.parse(size),
  //   };
  //   console.log(restructuredData);
  //   return restructuredData;
  // }

  // parseProductGsm(productGsm: string): Array<{ id: number, name: string, value: string, isPublic: boolean }> {
  //   try {
  //     const parsedProductGsm = Array.isArray(productGsm) ? productGsm : JSON.parse(productGsm);
  //     return parsedProductGsm;
  //   } catch (error) {
  //     console.error('Error parsing productGsm:', error);
  //     return [];
  //   }
  // }



  // // Usage:
  // const dataFromBackend = { /* your data object here */ };
  // const restructuredData = restructureData(dataFromBackend);


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


  selectPaperStock(obj: any, index: any): any {

    this.gsmName = obj.itemValue?.name || obj.name;
    let containPaperIndex = this.fieldsToDisplay.findIndex((f: any) => f.name === `GSM For ${this.gsmName}`);
    if (containPaperIndex > -1) {
      this.fieldsToDisplay.splice(containPaperIndex, 1)
      return
    }

    this.gsmArray = this.filterObjectByName(this.fieldList, 'GSM');
    if (this.gsmArray) {
      this.gsmField = {
        type: 'MULTIDROPDOWN',
        name: `Gsm ${this.gsmName}`,
        productFieldValuesList: this.gsmArray[0].productFieldValuesList,
        selectedValues: obj.selectedValues
      };
      this.fieldsToDisplay.push(this.gsmField);
    }
  }


  filterObjectByName(obj: any, name: string): any {
    const result = [];
    for (const key in obj) {
      if (obj.hasOwnProperty(key) && obj[key].name === name) {
        result.push(obj[key]);
      }
    }
    return result.length > 0 ? result : null;
  }



  productDefinitionComposing(field: any, obj: any, publicIndex: any) {

    if (field.name.startsWith("Paper Stock")) {
      this.obj1 = {
        name: obj.itemValue.name,
        isPublic: this.publicArray[publicIndex],
      }

      const inputString = obj.itemValue.name;
      const parts = inputString.split(" "); // Split the string into an array based on spaces
      const extractedValue = parts[parts.length - 1]
      let checkExistingPaperStockName = this.productGsm.find((el: any) => el.name === extractedValue)
      let checkIndex = this.productGsm.findIndex((el: any) => el.name === extractedValue)

      if (checkIndex > 0) {
        this.productGsm.splice(checkIndex, 1)
      }

      if (!checkExistingPaperStockName) {
        this.productGsm.push(this.obj1)
      }
    } else if (field.name.startsWith("Gsm")) {

      const inputString = field.name;
      const parts = inputString.split(" ");
      const extractedValue = parts[parts.length - 1]
      let findSelectedGsm = this.productGsm.find((el: any) => el.name === extractedValue)

      findSelectedGsm.value = ''
      obj.value.forEach((values: any) => {
        findSelectedGsm.value = obj.value.map((values: any) => values.name).join(',');
      });



    }
    let object: any
    obj.hasOwnProperty('itemValue') ? object = obj.itemValue : object = obj.value
    if (this.productDefinition.length == 0) {
      if (Array.isArray(object)) {
        let values: any = []
        for (let i = 0; i < object.length; i++) {
          values[i] = { productFieldValue: object[i] }
          // this.selectPaperStock(values, i);

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
        if (field.name === "Paper Stock") {
          this.selectPaperStock(obj, publicIndex);
        }
      }
    } else {

      if (field.name === "Paper Stock") {
        this.selectPaperStock(obj, publicIndex);
      }
      for (const element of this.productDefinition) {
        if (element.productField.id == field.id) {
          if (this.fieldsToDisplay.some((field: any) => field.name === "Gsm " + object.name)) {
          }
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
                // this.selectPaperStock(object, k);
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
                  this.service.deleteSelectedField(this.idFromQueryParam, element.id, element.selectedValues[index].id).subscribe(() => {
                    element.selectedValues.splice(index, 1);
                  }, error => {
                    this.error = error.error.error
                    this.visible = true;
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

  toCamelCase(inputString: any) {
    // Replace spaces or special characters with nothing, split the string into words, and capitalize the first letter of each word except the first one.
    return inputString
      .replace(/[^a-zA-Z0-9]+(.)/g, (_: any, char: any) => char.toUpperCase())
      .replace(/\)/g, '')
      .replace(/^\w/, (char: any) => char.toLowerCase());
  }

  transformPayload(productDefinition: any[]) {
    const resultObject: any = {};

    for (const item of productDefinition) {
      let name = this.toCamelCase(item.productField.name)
      if (name !== 'imposition') {
        let publicc = this.toCamelCase("is" + item.productField.name + "Public")
        let selectedValues = item.selectedValues.map((v: any) => {
          return { id: v.productFieldValue.id, name: v.productFieldValue.name, status: v.productFieldValue.status }
        })
        resultObject[name] = JSON.stringify(selectedValues);
        resultObject[publicc] = item.isPublic;
      } else {

        resultObject['imposition'] = item.selectedValues[0].value
      }
    }



    console.log(resultObject);

    const transformedPayload: any = {
      title: this.titleInput,
      status: this.status,
      pressMachine: {
        id: this.selectedMachine.id,
      },
      newProduct: {},
    };
    resultObject['productGsm'] = this.productGsm
    transformedPayload.newProduct = resultObject

    return transformedPayload;
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
        pressMachine: this.selectedMachine,
        newProductList: this.productDefinition,
      };
      const transformedPayload = this.transformPayload(this.productDefinition)
      console.log(transformedPayload);

      this.service.addProduct(transformedPayload).subscribe(res => {
        this.router.navigateByUrl('/products')
        console.log(transformedPayload);
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
      this.service.updateProduct(this.idFromQueryParam, obj).subscribe(() => {
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
    }, error => {
      this.error = error.error.error
      this.visible = true
    })
  }
  getFields() {
    this.productFieldService.getProductField().subscribe(
      (res) => {
        this.fieldList = res;
        const fieldNamesToDisplay = ['Paper Stock', 'Size', 'Quantity', 'Print Side', 'JobColor(Front)', 'JobColor(Back)', 'Imposition'];
        this.fieldsToDisplay = this.fieldList.filter((field: any) => fieldNamesToDisplay.includes(field.name));
        this.fieldList.forEach((field: any) => {
          field.type != 'TEXTFIELD' && field.type != 'TOGGLE' ? this.publicArray.push(false) : this.publicArray.push(null);
          if (field.type == 'TOGGLE') {
            this.toggleFlag.push(true);
          } else {
            this.toggleFlag.push(null);
          }
          field.type == 'TEXTFIELD' ? (this.titleObj = field) : null;
        });
      },
      (error) => {
        this.error = error.error.error;
        this.visible = true;
      }
    );
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
    this.elementGenerated = true;
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
    }, error => {
      this.error = error.error.error
      this.visible = true
    })
  }

  machine(obj: any) {
    this.selectedMachine = obj
  }

  get id(): boolean {
    return Number.isNaN(this.idFromQueryParam)
  }
}
