import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UpingService } from 'src/app/services/uping.service';
import { MessageService } from 'primeng/api';
import { environment } from 'src/Environments/environment';
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
  upingPagination: any;
  uploadedFiles: any;
  selectedFile: File | null = null;
  _url = environment.baseUrl

  constructor(
    private upingService: UpingService,
    private router: Router,
    private messageService: MessageService) { }

  ngOnInit(): void {
    this._url = `${this._url}/uping/upload`
    this.getUping();
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  getUping(page?: any) {
    this.upingService.getUpingWithPagination(page).subscribe((res: any) => {
      this.upingPagination = res;
      this.upingArray = res.content
      this.tableData = this.upingArray.length == 0 ? true : false
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

  searchUping(size?: any, pagination?: any) {
    debugger
    if (!size) {
      this.getUping()
    } else {
      debugger
      this.upingService.searchUpingWithPagination(size?.value, pagination).subscribe((res: any) => {
        this.upingArray = res.content
        this.upingPagination = res;
        this.tableData = this.upingArray.length == 0 ? true : false
      }, error => {
        this.showError(error);
        this.visible = true
      })
    }
  }

  onUpload(event: any) {
    this.messageService.add({ severity: 'info', summary: 'File Uploaded', detail: '' });
  }

  showError(error: any) {
    this.messageService.add({ severity: 'error', summary: 'Error', detail: error.error.error });
  }
}
