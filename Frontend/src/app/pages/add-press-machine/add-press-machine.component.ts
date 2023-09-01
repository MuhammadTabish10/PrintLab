import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PaperSizeService } from 'src/app/services/paper-size.service';
import { PressMachineService } from 'src/app/services/press-machine.service';

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
  ctpRateValue!: number
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

  constructor(private paperSizeService: PaperSizeService, private pressMachineService: PressMachineService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    this.getPaperSizes()
    this.route.queryParams.subscribe(param => {
      this.idFromQueryParam = +param['id']
      if (Number.isNaN(this.idFromQueryParam)) {
        this.buttonName = 'Add'
      } else {
        this.pressMachineService.getPressMachineById(this.idFromQueryParam).subscribe(res => {
          this.buttonName = 'Update'
          this.pressMachineToUpdate = res
          this.nameValue = this.pressMachineToUpdate.name
          this.ctpRateValue = this.pressMachineToUpdate.ctp_rate
          this.impressionRateValue = this.pressMachineToUpdate.impression_1000_rate
          this.select = this.pressMachineToUpdate.is_selected

          this.pressMachineToUpdate.pressMachineSize.forEach((item: any) => {
            this.pressMachineSizeId.push(item.id)
            this.value.push(item.value)
            this.obj.push(item.paperSize)
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
          this.error = error.error.error
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
      this.error = error.error.error
      this.visible = true;
    })
  }

  addSize(object: any, i: any) {
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
    this.placeHolder.push('Select Label')
    this.paperSize.length != this.maxLength ? this.paperSize.push({}) : alert('Reached machine sizes limit');
  }

  removeElement(index: number) {

    if (!Number.isNaN(this.idFromQueryParam)) {
      this.pressMachineService.deletePressMachineSize(this.idFromQueryParam, this.pressMachineSizeId[index]).subscribe(() => { }, error => {
        this.error = error.error.error
        this.visible = true;
      })
    }
    this.pressMachineSizeId.splice(index, 1)
    this.obj[index] ? this.paperSizesArray.push(this.obj[index]) : null
    this.obj.splice(index, 1);          //Containing objects of paper size
    this.value.splice(index, 1);
    this.paperSize.splice(index, 1)     //To show cards
    this.placeHolder.splice(index, 1)
  }

  addPressMachine() {

    if (Number.isNaN(this.idFromQueryParam)) {
      this.obj = this.obj.map((item: any, index: any) => {
        return { paperSize: item, value: this.value[index] };
      })
      let obj = {
        name: this.nameValue,
        ctp_rate: this.ctpRateValue,
        impression_1000_rate: this.impressionRateValue,
        is_selected: this.select,
        pressMachineSize: this.obj
      }
      this.pressMachineService.postPressMachine(obj).subscribe(() => {
        this.router.navigateByUrl('/pressMachine')
      }, error => {
        this.error = error.error.error
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
        ctp_rate: this.ctpRateValue,
        impression_1000_rate: this.impressionRateValue,
        is_selected: this.select,
        pressMachineSize: this.obj
      }
      this.pressMachineService.updatePressMachine(this.idFromQueryParam, obj).subscribe(() => {
        this.router.navigateByUrl('/pressMachine')
      }, error => {
        this.error = error.error.error
        this.visible = true;
      })
    }
  }

  getSelectedValue() {
    this.select = !this.select
  }
}
