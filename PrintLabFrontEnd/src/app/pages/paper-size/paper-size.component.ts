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

  constructor(private paperSizeService: PaperSizeService, private router: Router) { }

  ngOnInit(): void {
    this.getPaperSizes()
  }

  getPaperSizes() {
    this.paperSizeService.getPaperSize().subscribe(res => {
      this.paperSizesArray = res
      console.log(this.paperSizesArray);
      this.paperSizesArray.length == 0 ? this.tableData = true : this.tableData = false
    })
  }

  deletePaperSize(id: any) {
    this.paperSizeService.deletePaperSize(id).subscribe(res => {
      this.getPaperSizes()
    })
  }

  editPaperSize(id: any) {
    this.router.navigate(['/addPaperSize'], { queryParams: { id: id } });
  }

  searchPaperSize(label: any) {
    this.paperSizeService.searchPaperSize(label.value).subscribe(res => {
      this.paperSizesArray = res
      this.paperSizesArray.length == 0 ? this.tableData = true : this.tableData = false;
    })
  }
}