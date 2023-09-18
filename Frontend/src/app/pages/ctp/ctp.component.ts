import { CtpService } from 'src/app/services/ctp.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';

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

  constructor(private ctpService: CtpService, private router: Router,private datePipe:DatePipe) { }

  ngOnInit(): void {
    this.getCtp()
  }

  searchCtp(ctp: any) { }

  getCtp() {
    this.ctpService.getCtp().subscribe(res => {
      this.ctpArray = res;
      this.ctpArray.forEach((item: any) => {
        // Convert the date array into a Date object
        const dateArray = item.date;
        item.date = new Date(dateArray[0], dateArray[1] - 1, dateArray[2]);

        // Now you can format the date using DatePipe
        item.date = this.datePipe.transform(item.date, 'EEEE, MMMM d, yyyy');
      });

      this.tableData = this.ctpArray.length === 0;
    });
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
