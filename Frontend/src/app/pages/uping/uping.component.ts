import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UpingService } from 'src/app/services/uping.service';
import { MessageService } from 'primeng/api';
import { FileUploadService } from 'src/app/services/file-upload.service.service';
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
    private messageService: MessageService,
    private fileUploadService: FileUploadService,) { }

  ngOnInit(): void {
    this._url = `${this._url}/uping/upload`
    this.getUping();
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  // getUping() {
  //   this.upingService.getUping().subscribe(res => {
  //     this.upingArray = res
  //     this.upingArray.length == 0 ? this.tableData = true : this.tableData = false
  //   }, error => {
  //     this.showError(error);
  //     this.visible = true
  //   })
  // }

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

  searchUping(size: any) {
    if (!size) {
      this.getUping()
    } else {
      debugger
      this.upingService.searchUping(size.value).subscribe(res => {
        this.upingArray = res
        this.tableData = this.upingArray.length == 0 ? true : false
      }, error => {
        this.showError(error);
        this.visible = true
      })
    }
  }

  // uploadFile() {
  //   debugger
  //   if (this.selectedFile) {
  //     this.fileUploadService.uploadFile(this.selectedFile).subscribe(
  //       (response) => {
  //         // Handle success (e.g., show a success message)
  //         console.log('File uploaded successfully', response);
  //       },
  //       (error) => {
  //         // Handle error (e.g., show an error message)
  //         console.error('File upload error', error);
  //       }
  //     );
  //   } else {
  //     // No file selected; you can handle this case as needed
  //     console.warn('No file selected');
  //   }
  // }


  onUpload(event: any) {

    // for(let file of event.files) {
    //     this.uploadedFiles.push(file);
    // }

    this.messageService.add({ severity: 'info', summary: 'File Uploaded', detail: '' });
  }

  showError(error: any) {
    this.messageService.add({ severity: 'error', summary: 'Error', detail: error.error.error });
  }
}
