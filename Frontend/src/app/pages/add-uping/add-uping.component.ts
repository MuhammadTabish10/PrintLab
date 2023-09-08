import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PaperSizeService } from 'src/app/services/paper-size.service';
import { PressMachineService } from 'src/app/services/press-machine.service';
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
  constructor(private upingService: UpingService, private paperSizeService: PaperSizeService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    this.getPaperSizes()
    this.route.queryParams.subscribe(param => {
      this.idFromQueryParam = +param['id']
      if (Number.isNaN(this.idFromQueryParam)) {
        this.buttonName = 'Add'
      } else {
        this.upingService.getUpingById(this.idFromQueryParam).subscribe(res => {
          this.buttonName = 'Update'
          this.upingToUpdate = res
          this.productSizeValue = this.upingToUpdate.productSize
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
          // this.selectedSizes.forEach((item: any) => { this.placeHolder.push(item.label) })
          // this.selectedSizes.forEach((element: any) => {
          //   this.paperSize.push({})
          //   for (let i = 0; i < this.paperSizesArray.length; i++) {
          //     element.id == this.paperSizesArray[i].id ? this.paperSizesArray.splice(i, 1) : null;
          //   }
          // });
        }, error => {
          this.error = error.error.error
          this.visible = true;
        })
      }
    })
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
        upingPaperSize: this.selectedSizes
      }
      this.upingService.postUping(obj).subscribe(() => {
        this.router.navigateByUrl('/uping')
      }, error => {
        this.error = error.error.error
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
        upingPaperSize: this.selectedSizes
      }
      this.upingService.updateUping(this.idFromQueryParam, obj).subscribe(() => {
        this.router.navigateByUrl('/uping')
      }, error => {
        this.error = error.error.error
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
        this.error = error.error.error
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
      this.error = error.error.error
      this.visible = true;
    })
  }
}
