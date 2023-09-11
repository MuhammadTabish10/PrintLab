import { CtpService } from 'src/app/services/ctp.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ctp',
  templateUrl: './ctp.component.html',
  styleUrls: ['./ctp.component.css']
})
export class CtpComponent implements OnInit {

  search: string = ''
  tableData: boolean = true
  ctpArray: any = []
  visible: boolean = false
  error: string = ''

  constructor(private ctpService: CtpService, private router: Router) { }

  ngOnInit(): void {
    this.getCtp()
  }

  searchCtp(ctp: any) { }

  getCtp() {
    this.ctpService.getCtp().subscribe(res => {
      this.ctpArray = res
      this.ctpArray.length == 0 ? this.tableData = true : this.tableData = false
    })
  }

  delteCtp(id: any) {
    this.ctpService.deleteCtp(id).subscribe(res => {
      this.getCtp()
    })
  }

  editCtp(id: any) {
    this.router.navigate(['/addCtp'], { queryParams: { id: id } });
  }
}
