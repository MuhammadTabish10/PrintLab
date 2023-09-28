import { VendorService } from './../../services/vendor.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { CtpService } from 'src/app/services/ctp.service';
import { ProductProcessService } from 'src/app/services/product-process.service';

@Component({
  selector: 'app-add-ctp',
  templateUrl: './add-ctp.component.html',
  styleUrls: ['./add-ctp.component.css']
})
export class AddCtpComponent implements OnInit {

  visible: boolean = false
  error: string = ''
  buttonName: string = 'Add'
  idFromQueryParam!: number

  LOneValue: string = ''
  LTwoValue: string = ''
  dimensionValue: string = ''
  rateValue: string = ''
  vendorValue: any = {}
  ctpToUpdate: any = {}

  vendorArray: any = []
  vendorIndex!: number
  productProcessArray: any[] = [];

  constructor(private ctpService: CtpService, private vendorService: VendorService,
    private router: Router, private route: ActivatedRoute, private messageService: MessageService,
    private productProcess: ProductProcessService) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(param => {
      this.idFromQueryParam = +param['id']
      if (Number.isNaN(this.idFromQueryParam)) {
        this.buttonName = 'Add'
      } else {
        this.getProductProcess()
        this.buttonName = 'Update'
        this.ctpService.getCtpById(this.idFromQueryParam).subscribe(res => {
          this.ctpToUpdate = res
          this.getProductProcess()
          debugger
          this.LOneValue = this.ctpToUpdate.l1
          this.LTwoValue = this.ctpToUpdate.l2
          this.dimensionValue = this.ctpToUpdate.plateDimension
          this.vendorValue = this.ctpToUpdate.vendor
          this.rateValue = this.ctpToUpdate.rate
        })
      }
      this.getProductProcess()
    })
  }


  getProductProcess() {
    this.productProcess.getProductProcess().subscribe(
      (res: any) => {
        if (Array.isArray(res)) {
          this.productProcessArray = res;

          let ctpProcess: any;

          for (const process of this.productProcessArray) {
            if (process.name === 'Ctp') {
              ctpProcess = process;
              break
            }
          }

          if (ctpProcess) {
            const ctpProcessId = ctpProcess.id;
            this.getVendors(ctpProcessId);
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
        this.vendorIndex = this.vendorArray.findIndex((el: any) => el.id === this.ctpToUpdate.vendor.id)
        this.vendorValue = this.vendorArray[this.vendorIndex]
      }
    }, error => {
      this.visible = true
      this.showError(error);
    })
  }

  addCtp() {
    if (Number.isNaN(this.idFromQueryParam)) {
      let obj = {
        l1: this.LOneValue,
        l2: this.LTwoValue,
        plateDimension: this.dimensionValue,
        rate: this.rateValue,
        vendor: this.vendorValue
      }
      this.ctpService.postCtp(obj).subscribe(() => {
        this.router.navigateByUrl('/ctp')
      }, error => {
        this.visible = true
        this.showError(error);
      })
    } else {
      let obj = {
        date: this.ctpToUpdate.date,
        l1: this.LOneValue,
        l2: this.LTwoValue,
        plateDimension: this.dimensionValue,
        rate: this.rateValue,
        vendor: this.vendorValue
      }
      this.ctpService.updateCtp(this.idFromQueryParam, obj).subscribe(() => {
        this.router.navigateByUrl('/ctp')
      }, error => {
        this.visible = true
        this.showError(error);
      })
    }
  }

  dimension() {
    this.LOneValue != "" && this.LTwoValue != "" ? this.dimensionValue = this.LOneValue + '" x ' + this.LTwoValue + '"' : this.dimensionValue = ''
  }
  showError(error: any) {
    this.messageService.add({ severity: 'error', summary: 'Error', detail: error.error.error });
  }
}
