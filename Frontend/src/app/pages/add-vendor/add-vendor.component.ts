import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductProcessService } from 'src/app/services/product-process.service';
import { VendorService } from 'src/app/services/vendor.service';

@Component({
  selector: 'app-add-vendor',
  templateUrl: './add-vendor.component.html',
  styleUrls: ['./add-vendor.component.css']
})
export class AddVendorComponent implements OnInit {

  visible!: boolean
  error: string = ''
  buttonName: string = 'Add'
  nameValue: string = ''
  emailValue: string = ''
  contactNameValue: string = ''
  contactNumberValue: string = ''
  addressValue: string = ''
  notesValue: string = ''
  idFromQueryParam!: number
  vendorToUpdate: any = []
  productProcessArray: any = []
  placeHolder: any = []
  vendorProcess: any = []
  maxLength!: number
  materialProcess: any = []
  rateProcess: any = []
  notesProcess: any = []
  selectedVendorProcess: any = []
  vendorProcessId: any = []
  elementGenerated: boolean = false;
  constructor(private vendorService: VendorService, private productProcessService: ProductProcessService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    this.getproductProcess()
    this.route.queryParams.subscribe(param => {
      this.idFromQueryParam = +param['id']
      if (Number.isNaN(this.idFromQueryParam)) {
        this.buttonName = 'Add'
      } else {
        this.vendorService.getVendorById(this.idFromQueryParam).subscribe(res => {
          this.buttonName = 'Update'
          this.vendorToUpdate = res
          this.nameValue = this.vendorToUpdate.name
          this.emailValue = this.vendorToUpdate.email
          this.contactNameValue = this.vendorToUpdate.contactName
          this.contactNumberValue = this.vendorToUpdate.contactNumber
          this.addressValue = this.vendorToUpdate.address
          this.notesValue = this.vendorToUpdate.notes
          this.vendorToUpdate.vendorProcessList.forEach((el: any) => {
            this.vendorProcessId.push(el.id)
            this.selectedVendorProcess.push(el.productProcess)
            this.materialProcess.push(el.materialType)
            this.rateProcess.push(el.rateSqft)
            this.notesProcess.push(el.notes)
            this.vendorProcess.push({})
            this.placeHolder.push(el.productProcess.name)

            this.productProcessArray.forEach((item: any) => {
              if (item.id == el.productProcess.id) {
                let index = this.productProcessArray.indexOf(item)
                this.productProcessArray.splice(index, 1)
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

  addSize(obj: any, i: any) {

    if (this.selectedVendorProcess[i]) {
      this.productProcessArray.push(this.selectedVendorProcess[i])
      this.selectedVendorProcess[i] = obj
    } else {
      this.selectedVendorProcess.push(obj)
    }
    const foundIndex = this.productProcessArray.findIndex((item: any) => item.id === obj.id);
    if (foundIndex !== -1) {
      this.productProcessArray.splice(foundIndex, 1);
    }
  }

  generateElement() {
    this.elementGenerated = true;
    this.placeHolder.push('Select Label')
    this.vendorProcess.length != this.maxLength ? this.vendorProcess.push({}) : alert('Reached Process limit');
  }

  removeElement(i: any) {

    if (!Number.isNaN(this.idFromQueryParam)) {
      this.vendorService.deleteVendorProcess(this.idFromQueryParam, this.vendorProcessId[i]).subscribe(() => { }, error => {
        this.error = error.error.error
        this.visible = true;
      })
      this.vendorProcessId.splice(i, 1)
    }
    this.vendorProcess.splice(i, 1)
    this.selectedVendorProcess[i] ? this.productProcessArray.push(this.selectedVendorProcess[i]) : null
    this.selectedVendorProcess.splice(i, 1)
    this.placeHolder.splice(i, 1)
    this.materialProcess.splice(i, 1)
    this.rateProcess.splice(i, 1)
    this.notesProcess.splice(i, 1)
  }

  addVendor() {

    if (Number.isNaN(this.idFromQueryParam)) {
      for (let i = 0; i < this.selectedVendorProcess.length; i++) {
        this.selectedVendorProcess[i] = {
          productProcess: this.selectedVendorProcess[i],
          materialType: this.materialProcess[i],
          rateSqft: this.rateProcess[i],
          notes: this.notesProcess[i]
        }
      }
      let obj = {
        name: this.nameValue,
        email: this.emailValue,
        contactName: this.contactNameValue,
        contactNumber: this.contactNumberValue,
        address: this.addressValue,
        notes: this.notesValue,
        vendorProcessList: this.selectedVendorProcess
      }
      this.vendorService.postVendor(obj).subscribe(() => {
        this.router.navigateByUrl('/vendor')
      }, error => {
        this.error = error.error.error
        this.visible = true;
      })
    } else {
      for (let i = 0; i < this.selectedVendorProcess.length; i++) {
        this.selectedVendorProcess[i] = {
          id: this.vendorProcessId[i],
          productProcess: this.selectedVendorProcess[i],
          materialType: this.materialProcess[i],
          rateSqft: this.rateProcess[i],
          notes: this.notesProcess[i],
        }
      }
      let obj = {
        name: this.nameValue,
        email: this.emailValue,
        contactName: this.contactNameValue,
        contactNumber: this.contactNumberValue,
        address: this.addressValue,
        notes: this.notesValue,
        vendorProcessList: this.selectedVendorProcess
      }
      this.vendorService.updateVendor(this.idFromQueryParam, obj).subscribe(() => {
        this.router.navigateByUrl('/vendor')
      }, error => {
        this.error = error.error.error
        this.visible = true;
      })
    }
  }

  getproductProcess() {
    this.productProcessService.getProductProcess().subscribe(res => {
      this.productProcessArray = res
      this.maxLength = this.productProcessArray.length
    }, error => {
      this.error = error.error.error
      this.visible = true;
    })
  }
}
