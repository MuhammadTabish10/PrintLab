import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { PaperSizeService } from 'src/app/services/paper-size.service';

@Component({
  selector: 'app-add-paper-size',
  templateUrl: './add-paper-size.component.html',
  styleUrls: ['./add-paper-size.component.css']
})
export class AddPaperSizeComponent implements OnInit {

  visible!: boolean
  error: string = ''
  buttonName: String = 'Add'
  labelValue: String = ''
  statusValue: String = 'Active'
  statusFlag: boolean = true
  idFromQueryParam!: number
  sizeToUpdate: any = []

  constructor(private paperSizeService: PaperSizeService, private route: ActivatedRoute, private router: Router
    ,private messageService: MessageService) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(param => {
      this.idFromQueryParam = +param['id']
      if (Number.isNaN(this.idFromQueryParam)) {
        this.buttonName = 'Add'
      } else {
        this.paperSizeService.getPaperSizeById(this.idFromQueryParam).subscribe(res => {

          this.buttonName = 'Update'
          this.sizeToUpdate = res
          this.labelValue = this.sizeToUpdate.label
          this.statusValue = this.sizeToUpdate.status
          this.statusValue == "Active" ? this.statusFlag = true : this.statusFlag = false
        }, error => {
          this.showError(error);
          this.visible = true;
        })
      }
    })
  }

  getstatusValue() {
    this.statusFlag = !this.statusFlag
    this.statusFlag == true ? this.statusValue = "Active" : this.statusValue = "Inactive"
  }

  addPaperSize() {

    let obj = {
      label: this.labelValue,
      status: this.statusValue
    }
    if (Number.isNaN(this.idFromQueryParam)) {
      this.paperSizeService.postPaperSize(obj).subscribe(() => {
        this.router.navigateByUrl('/paperSize')
      }, error => {
        this.showError(error);
        this.visible = true;
      })
    } else {
      this.paperSizeService.updatePaperSize(this.idFromQueryParam, obj).subscribe(() => {
        this.router.navigateByUrl('/paperSize')
      }, error => {
        this.showError(error);
        this.visible = true;
      })
    }
  }
  showError(error:any) {
    this.messageService.add({ severity: 'error', summary: 'Error', detail: error.error.error }); 
  }
}
