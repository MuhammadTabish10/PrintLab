import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PaperSizeService } from 'src/app/services/paper-size.service';

@Component({
  selector: 'app-add-paper-size',
  templateUrl: './add-paper-size.component.html',
  styleUrls: ['./add-paper-size.component.css']
})
export class AddPaperSizeComponent implements OnInit {

  buttonName: String = 'Add'
  labelValue: String = ''
  statusValue: String = 'Active'
  statusFlag: boolean = true
  idFromQueryParam!: number
  sizeToUpdate: any = []

  constructor(private paperSizeService: PaperSizeService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(param => {
      this.idFromQueryParam = +param['id']
      if (Number.isNaN(this.idFromQueryParam)) {
        this.buttonName = 'Add'
      } else {
        this.paperSizeService.getPaperSizeById(this.idFromQueryParam).subscribe(res => {
          debugger
          this.buttonName = 'Update'
          // console.log(res);
          this.sizeToUpdate = res
          this.labelValue = this.sizeToUpdate.label
          this.statusValue = this.sizeToUpdate.status
          this.statusValue == "Active" ? this.statusFlag = true : this.statusFlag = false
        })
      }
    })
  }

  getstatusValue() {
    this.statusFlag = !this.statusFlag
    this.statusFlag == true ? this.statusValue = "Active" : this.statusValue = "Inactive"
    console.log(this.statusValue);

  }

  addPaperSize() {
    debugger
    let obj = {
      label: this.labelValue,
      status: this.statusValue
    }
    if (Number.isNaN(this.idFromQueryParam)) {
      this.paperSizeService.postPaperSize(obj).subscribe(() => {
        this.router.navigateByUrl('/paperSize')
      })
    } else {
      this.paperSizeService.updatePaperSize(this.idFromQueryParam, obj).subscribe(() => {
        this.router.navigateByUrl('/paperSize')
      })
    }
  }
}