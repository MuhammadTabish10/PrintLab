import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PaperSizeService } from 'src/app/services/paper-size.service';

@Component({
  selector: 'app-paper-size',
  templateUrl: './paper-size.component.html',
  styleUrls: ['./paper-size.component.css']
})
export class PaperSizeComponent implements OnInit {

  tableData: boolean = true
  paperSizesArray: any = []
  search: string = ''
  error:string=''
  visible!:boolean

  constructor(private paperSizeService: PaperSizeService, private router: Router) { }

  ngOnInit(): void {
    this.getPaperSizes()
  }

  getPaperSizes() {
    this.paperSizeService.getPaperSize().subscribe(res => {
      this.paperSizesArray = res
      this.paperSizesArray.length == 0 ? this.tableData = true : this.tableData = false
    }, error => {
      this.error = error.error.error
      this.visible = true
    })
  }

  deletePaperSize(id: any) {
    this.paperSizeService.deletePaperSize(id).subscribe(res => {
      this.getPaperSizes()
    }, error => {
      this.error = error.error.error
      this.visible = true
    })
  }

  editPaperSize(id: any) {
    this.router.navigate(['/addPaperSize'], { queryParams: { id: id } });
  }

  searchPaperSize(label: any) {
    if (this.search == '') {
      this.getPaperSizes()
    } else {
      this.paperSizeService.searchPaperSize(label.value).subscribe(res => {
        this.paperSizesArray = res
        this.paperSizesArray.length == 0 ? this.tableData = true : this.tableData = false;
      }, error => {
        this.error = error.error.error
        this.visible = true
      })
    }
  }
}
