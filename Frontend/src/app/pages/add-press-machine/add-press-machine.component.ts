import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { CtpService } from 'src/app/services/ctp.service';
import { PaperSizeService } from 'src/app/services/paper-size.service';
import { PressMachineService } from 'src/app/services/press-machine.service';
import { ProductProcessService } from 'src/app/services/product-process.service';
import { VendorService } from 'src/app/services/vendor.service';

@Component({
  selector: 'app-add-press-machine',
  templateUrl: './add-press-machine.component.html',
  styleUrls: ['./add-press-machine.component.css']
})
export class AddPressMachineComponent implements OnInit {

  visible!: boolean
  error: string = ''
  buttonName: string = 'Add'
  nameValue: string = ''
  plateDimension: string = ''
  gripperMargin: string = ''
  maxSheetSize: string = ''
  minSheetSize: string = ''
  maxSph!: number;
  vendorValue: string = '';
  impressionRateValue!: number
  paperSize: any = []
  paperSizesArray: any = []
  obj: any = []
  value: any = []
  idFromQueryParam!: number
  pressMachineToUpdate: any = []
  maxLength!: number
  placeHolder: any = []
  pressMachineSizeId: any = []
  select: boolean = false
  elementsGenerated: boolean = false;
  vendorArray: any;
  vendorIndex: any;
  platesArray: any;
  plateDimensions: any;
  productProcessArray: any[] = [];


  constructor(private paperSizeService: PaperSizeService, private pressMachineService: PressMachineService,
    private route: ActivatedRoute, private router: Router,
    private vendorService: VendorService, private ctpService: CtpService,
    private productProcess: ProductProcessService, private messageService: MessageService) { }

  ngOnInit(): void {

    this.getPaperSizes()
    this.route.queryParams.subscribe(param => {
      this.idFromQueryParam = +param['id']
      if (Number.isNaN(this.idFromQueryParam)) {
        this.buttonName = 'Add'
        this.getProductProcess();
        this.getPlates();
      } else {
        this.pressMachineService.getPressMachineById(this.idFromQueryParam).subscribe(res => {
          this.buttonName = 'Update'
          this.getPlates();
          this.pressMachineToUpdate = res
          this.nameValue = this.pressMachineToUpdate.name
          this.plateDimension = this.pressMachineToUpdate.plateDimension
          this.gripperMargin = this.pressMachineToUpdate.gripperMargin
          this.maxSheetSize = this.pressMachineToUpdate.maxSheetSize
          this.minSheetSize = this.pressMachineToUpdate.minSheetSize
          this.maxSph = this.pressMachineToUpdate.maxSPH
          this.vendorValue = this.pressMachineToUpdate.vendor.name
          this.impressionRateValue = this.pressMachineToUpdate.impression_1000_rate
          this.select = this.pressMachineToUpdate.is_selected

          this.pressMachineToUpdate.pressMachineSize.forEach((item: any) => {
            this.pressMachineSizeId.push(item.id)
            this.value.push(item.value)
            this.obj.push(item.paperSize)
            this.getProductProcess();
            this.placeHolder.push(item.paperSize.label)
            this.paperSize.push({})
            this.paperSizesArray.forEach((el: any) => {
              if (el.id == item.paperSize.id) {
                let index = this.paperSizesArray.indexOf(el)
                this.paperSizesArray.splice(index, 1)
              }
            })
          })
        }, error => {
          this.showError(error);
          this.visible = true;
        })
      }
    })
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

  addSize(object: any, i: any) {
    debugger
    this.obj[i] ? this.paperSizesArray.push(this.obj[i]) : null;
    this.obj[i] = object
    for (let i = this.paperSizesArray.length - 1; i >= 0; i--) {
      const foundIndex = this.obj.findIndex((item: any) => item.id === this.paperSizesArray[i].id);
      if (foundIndex !== -1) {
        this.paperSizesArray.splice(i, 1);
      }
    }
  }

  generateElement() {
    this.elementsGenerated = true;
    this.placeHolder.push('Select Label')
    this.paperSize.length != this.maxLength ? this.paperSize.push({}) : alert('Reached machine sizes limit');
  }

  removeElement(index: number) {
    debugger
    if (!Number.isNaN(this.idFromQueryParam)) {
      this.pressMachineService.deletePressMachineSize(this.idFromQueryParam, this.pressMachineSizeId[index]).subscribe(() => { }, error => {
        this.showError(error);
        this.visible = true;
      })
    }
    this.pressMachineSizeId.splice(index, 1)
    this.obj[index] ? this.paperSizesArray.push(this.obj[index]) : null
    this.obj.splice(index, 1);
    this.value.splice(index, 1);
    this.paperSize.splice(index, 1)
    this.placeHolder.splice(index, 1)
  }

  addPressMachine() {

    if (Number.isNaN(this.idFromQueryParam)) {
      this.obj = this.obj.map((item: any, index: any) => {
        return { paperSize: item, value: this.value[index] };
      })
      let obj = {
        name: this.nameValue,
        plateDimension: this.plateDimension,
        gripperMargin: this.gripperMargin,
        maxSheetSize: this.maxSheetSize,
        minSheetSize: this.minSheetSize,
        maxSPH: this.maxSph,
        vendor: this.vendorValue,
        impression_1000_rate: this.impressionRateValue,
        is_selected: this.select,
        pressMachineSize: this.obj
      }
      this.pressMachineService.postPressMachine(obj).subscribe(() => {
        this.router.navigateByUrl('/pressMachine')
      }, error => {
        this.showError(error);
        this.visible = true;
      })
    } else {
      for (let i = 0; i < this.obj.length; i++) {
        this.obj[i] = {
          id: this.pressMachineSizeId[i],
          paperSize: this.obj[i],
          value: this.value[i]
        }
      }
      let obj = {
        name: this.nameValue,
        plateDimension: this.plateDimension,
        gripperMargin: this.gripperMargin,
        maxSheetSize: this.maxSheetSize,
        minSheetSize: this.minSheetSize,
        maxSPH: this.maxSph,
        vendor: this.vendorValue,
        impression_1000_rate: this.impressionRateValue,
        is_selected: this.select,
        pressMachineSize: this.obj
      }
      this.pressMachineService.updatePressMachine(this.idFromQueryParam, obj).subscribe(() => {
        this.router.navigateByUrl('/pressMachine')
      }, error => {
        this.showError(error);
        this.visible = true;
      })
    }
  }


  getProductProcess() {
    this.productProcess.getProductProcess().subscribe(
      (res: any) => {
        if (Array.isArray(res)) {
          this.productProcessArray = res;

          let pressProcess: any;

          for (const process of this.productProcessArray) {
            if (process.name === 'Press' || process.name === 'press') {
              pressProcess = process;
              break
            }
          }
          if (pressProcess) {
            const pressProcessId = pressProcess.id;
            this.getVendors(pressProcessId);
          }
        }
      },
      (error) => {
        this.error = error.error.error;
        this.visible = true;
      }
    );
  }




  getVendors(processId: any) {
    this.vendorService.getVendorByProductProcess(processId).subscribe(res => {
      this.vendorArray = res
      if (!Number.isNaN(this.idFromQueryParam)) {
        this.vendorIndex = this.vendorArray.findIndex((el: any) => el.id === this.pressMachineToUpdate.vendor.id)
        this.vendorValue = this.vendorArray[this.vendorIndex]
      }
    }, error => {
      this.visible = true
      this.showError(error);
    })
  }

  getPlates() {
    this.ctpService.getCtp().subscribe(
      (res) => {
        this.platesArray = res;
        const uniqueDimensions = new Set<string>();
        this.platesArray.forEach((plate: { plateDimension: string; }) => {
          if (plate.plateDimension) {
            uniqueDimensions.add(plate.plateDimension);
          }
        });
        this.plateDimensions = Array.from(uniqueDimensions);
      },
      (error) => {
        this.visible = true;
        this.error = error.error.error;
      }
    );
  }

  getSelectedValue() {
    this.select = !this.select
  }
  showError(error:any) {
    this.messageService.add({ severity: 'error', summary: 'Error', detail: error.error.error });
  }
}
