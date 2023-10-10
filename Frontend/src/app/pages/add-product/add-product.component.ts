import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
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

    

    buttonName: String = 'Add'

    titleInput: any;
    status: boolean = true
    fieldList: any = []
    paperStockFields: any;
    paperStockIsPublic: boolean = true
    selectedPaperStock: any = []
    valuesSelected: any = []
    gsmSizes: any = []
    gsmFields: any = []
    productGsm: any = []
    size: any = []
    selectedSizes: any = '' || []
    sizeIsPublic: boolean = true
    paperStockNames: string = '';
    quantityList: any = []
    selectedQuantity: any = ''
    quantityIsPublic: boolean = true
    PressMachines: any = []
    selectedPressMachine: any

    productGsmNames: any = ''

    printSideList: any = []
    selectedPrintSide: any = ''
    printSideIsPublic: boolean = true

    jobColorFrontList: any = []
    selectedJobColorFront: any = ''
    jobColorFrontIsPublic: boolean = true

    jobColorBackList: any = []
    selectedJobColorBack: any = ''
    jobColorBackIsPublic: boolean = true

    imposition: boolean = false
    createValue: any;

    selectedSizesForEdit: any = []
    selectedQuantityForEdit: any = []

    object: any = {
        name: '',
        value: '',
        isPublic: ''
    }
    productId: any;
    selectedPrintSideForEdit: any = [];
    selectedJobColorFrontForEdit: any = [];
    selectedJobColorbackForEdit: any = [];

    constructor(private service: ProductService, private route: ActivatedRoute,
        private router: Router, private productProcessService: ProductProcessService,
        private productFieldService: ProductDefinitionService, private pressMachineService: PressMachineService
        , private messageService: MessageService) { }

    ngOnInit(): void {

        this.getFields()

        this.getPressMachines()
        this.route.queryParams.subscribe(param => {
            this.productId = +param['id'];
            if (this.productId) {
                this.fetchId(this.productId);
                this.getFields()

            }
        });


    }

    fetchId(id: number) {
        this.service.getById(id).subscribe((res: any) => {
            this.titleInput = res.title;
            this.status = res.status;

            this.paperStockFields.productFieldValuesList.forEach((fullPaperStock:any) => {
                res.newProduct.productGsm.forEach((selectedGsm:any) => {
                    if(fullPaperStock.name == selectedGsm.name){
                        this.selectedPaperStock.push(fullPaperStock)
                    }
                });
            });

            let collectSizes = res.newProduct.size.split(',')
            collectSizes.forEach((element: any) => {
                let findSize = this.size.productFieldValuesList.find((el: any) => el.name == element)
                if (findSize) {
                    this.selectedSizesForEdit.push(findSize)

                }

            });

            let collectQuantity = res.newProduct.quantity.split(',')
            collectQuantity.forEach((element: any) => {
                let findQuantity = this.quantityList.productFieldValuesList.find((el: any) => el.name == element)
                if (findQuantity) {
                    this.selectedQuantityForEdit.push(findQuantity)
                }
            })

            let collectPrintSide = res.newProduct.printSide.split(',')
            collectPrintSide.forEach((element: any) => {
                let printSide = this.printSideList.productFieldValuesList.find((el: any) => el.name == element)
                if (printSide) {
                    this.selectedPrintSideForEdit.push(printSide)
                }
            })

            let collectJobColorFront = res.newProduct.jobColorFront.split(',')
            collectJobColorFront.forEach((element: any) => {
                let jobcolorFront = this.jobColorFrontList.productFieldValuesList.find((el: any) => el.name == element)
                if (jobcolorFront) {
                    this.selectedJobColorFrontForEdit.push(jobcolorFront)
                }
            })

            let collectJobColorBack = res.newProduct.jobColorBack.split(',')
            collectJobColorBack.forEach((element: any) => {
                let jobcolorBack = this.jobColorBackList.productFieldValuesList.find((el: any) => el.name == element)
                if (jobcolorBack) {
                    this.selectedJobColorbackForEdit.push(jobcolorBack)
                }
            })

            // Populate press machine dropdown
            this.selectedPressMachine = res.pressMachine.id;
            this.PressMachines.forEach((element:any) => {
                if(element.id == this.selectedPressMachine){
                    this.selectedPressMachine = element
                }
            });

            res.newProduct.productGsm.forEach((el:any) => {
                el.value = el.value.split(',').map(Number);
                
            })
            debugger
            this.gsmFields=res.newProduct.productGsm
            // this.gsmFields = res.newProduct.productGsm
        });
    }

    getPressMachines() {
        this.pressMachineService.getPressMachine().subscribe((res: any) => {
            this.PressMachines = res
        })
    }
    getFields() {
        this.productFieldService.getProductField().subscribe(res => {
            this.fieldList = res

            var [
                paperStock,
                size,
                quantity,
                gsm,
                printSide,
                jobColorFront,
                jobColorBack,
                imposition
            ] = this.fieldList;

            this.paperStockFields = paperStock
            this.size = size
            this.quantityList = quantity
            this.printSideList = printSide
            this.jobColorFrontList = jobColorFront
            this.jobColorBackList = jobColorBack


            this.fieldList.forEach((element: any) => {
                if (element.name == 'GSM') {
                    element.productFieldValuesList.forEach((size: any) => {
                        this.gsmSizes.push(size)

                    });
                }
            });
        })
    }

    machine(obj: any) {
        this.selectedPressMachine = obj.value.id

    }

    togglePublic(element: any) {
        element.isPublic = !element.isPublic;
    }

    productDefinitionComposing(paperStock: any) {
        debugger

        this.paperStockNames = ''
        this.paperStockNames = paperStock.value.map((element: any) => element.name).join(',');

        this.paperStockNames = paperStock.itemValue

        let obj = {
            gsmNameFor: paperStock.itemValue.name,
            gsmSizes: this.gsmSizes,
            isPublic: true
        }

        let findIndex = this.gsmFields.findIndex((el: any) => el.gsmNameFor == paperStock.itemValue.name)

        if (findIndex == -1) {
            this.gsmFields.push(obj)
        } else {
            this.gsmFields.splice(findIndex, 1)
            this.productGsm.splice(findIndex, 1)
        }

    }

    collectGsmSizes(obj: any, paper: any) {

        if (obj.itemValue == undefined) {
            this.createValue = '';
            this.createValue = obj.value.map((element: any) => element.name).join(',');

            this.object = {
                name: paper.gsmNameFor,
                value: this.createValue,
                isPublic: paper.isPublic
            }
        } else {
            this.object = {
                name: paper.gsmNameFor,
                value: obj?.itemValue?.name,
                isPublic: paper.isPublic
            }
        }

        let findExisting = this.productGsm.find((el: any) => el.name == paper.gsmNameFor)

        if (findExisting) {
            findExisting.value = ""
            findExisting.value = obj.value.map((element: any) => element.name).join(',');

        } else {
            this.productGsm.push(this.object)
        }
    }

    sizes(obj: any) {
        const selectedSizeNames = obj.value.map((element: any) => element.name);
        this.selectedSizes = selectedSizeNames.join(',');
    }

    quantity(obj: any) {
        const selectedQuantityNames = obj.value.map((element: any) => element.name);
        this.selectedQuantity = selectedQuantityNames.join(',');
    }


    printSide(obj: any) {
        const selectedPrintSideNames = obj.value.map((element: any) => element.name);
        this.selectedPrintSide = selectedPrintSideNames.join(',');
    }


    jobColorFront(obj: any) {
        const selectedJobColorFrontNames = obj.value.map((element: any) => element.name);
        this.selectedJobColorFront = selectedJobColorFrontNames.join(',');
    }


    jobColorBack(obj: any) {
        const selectedJobColorBackNames = obj.value.map((element: any) => element.name);
        this.selectedJobColorBack = selectedJobColorBackNames.join(',');
    }


    extractPaperStock() {
        const productGsmNames = this.productGsm.map((element: any) => element.name);
        this.productGsmNames = productGsmNames.join(',');
    }


    postProduct() {
        this.extractPaperStock();

        const payload = {
            title: this.titleInput,
            status: true,
            pressMachine: {
                id: this.selectedPressMachine
            },
            newProduct: {
                paperStock: this.productGsmNames,
                size: this.selectedSizes,
                quantity: this.selectedQuantity,
                printSide: this.selectedPrintSide,
                jobColorFront: this.selectedJobColorFront,
                jobColorBack: this.selectedJobColorBack,
                imposition: this.imposition,
                isPaperStockPublic: this.paperStockIsPublic,
                isSizePublic: this.sizeIsPublic,
                isQuantityPublic: this.quantityIsPublic,
                isPrintSidePublic: this.printSideIsPublic,
                isJobColorFrontPublic: this.jobColorFrontIsPublic,
                isJobColorBackPublic: this.jobColorBackIsPublic,
                productGsm: this.productGsm
            }
        };

        if (this.productId) {
            // Update existing product
            this.service.updateProduct(this.productId, payload).subscribe((res: any) => {
                console.log(res);
                // Redirect to the product list page or perform other actions
                this.router.navigateByUrl('/products');
            });
        } else {
            // Add new product
            this.service.addProduct(payload).subscribe((res: any) => {
                console.log(res);
                // Redirect to the product list page or perform other actions
                this.router.navigateByUrl('/products');
            });
        }
    }
    


}