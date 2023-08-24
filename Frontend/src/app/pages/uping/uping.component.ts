import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UpingService } from 'src/app/services/uping.service';

@Component({
  selector: 'app-uping',
  templateUrl: './uping.component.html',
  styleUrls: ['./uping.component.css']
})
export class UpingComponent implements OnInit {

  tableData: boolean = true
  upingArray: any = []
  search: string = ''
  
  constructor(private upingService: UpingService, private router: Router) { }

  ngOnInit(): void {
    this.getUping()
  }

  getUping() {
    this.upingService.getUping().subscribe(res => {
      this.upingArray = res
      this.upingArray.length == 0 ? this.tableData = true : this.tableData = false
    })
  }

  edituping(id: any) {
    this.router.navigate(['/addUping'], { queryParams: { id: id } });
  }

  deleteuping(id: any) {
    this.upingService.deleteUping(id).subscribe(res => {
      this.getUping()
    })
  }

  searchUping(size: any) {
    if (this.search == '') {
      this.getUping()
    } else {
      this.upingService.searchUping(size.value).subscribe(res => {
        this.upingArray = res
        this.upingArray.length == 0 ? this.tableData = true : this.tableData = false;
      })
    }
  }
}