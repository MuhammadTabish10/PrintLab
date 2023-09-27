import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UpingService } from 'src/app/services/uping.service';
import { MessageService } from 'primeng/api';
@Component({
  selector: 'app-uping',
  templateUrl: './uping.component.html',
  styleUrls: ['./uping.component.css']
})
export class UpingComponent implements OnInit {

  tableData: boolean = true
  upingArray: any = []
  search: string = ''
  visible!: boolean
  error: string = ''

  constructor(private upingService: UpingService, private router: Router,private messageService: MessageService) { }

  ngOnInit(): void {
    this.getUping()
  }

  getUping() {
    this.upingService.getUping().subscribe(res => {
      this.upingArray = res
      this.upingArray.length == 0 ? this.tableData = true : this.tableData = false
    }, error => {
      this.showError(error);
      this.visible = true
    })
  }

  edituping(id: any) {
    this.router.navigate(['/addUping'], { queryParams: { id: id } });
  }

  deleteuping(id: any) {
    this.upingService.deleteUping(id).subscribe(() => {
      this.getUping()
    }, error => {
      this.showError(error);
      this.visible = true
    })
  }

  searchUping(size: any) {
    if (this.search == '') {
      this.getUping()
    } else {
      this.upingService.searchUping(size.value).subscribe(res => {
        this.upingArray = res
        this.upingArray.length == 0 ? this.tableData = true : this.tableData = false;
      }, error => {
        this.showError(error);
        this.visible = true
      })
    }
  }
  showError(error:any) {
    this.messageService.add({ severity: 'error', summary: 'Error', detail: error.error.error }); 
  }
}
