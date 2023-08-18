import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PressMachineService } from 'src/app/services/press-machine.service';

@Component({
  selector: 'app-press-machine',
  templateUrl: './press-machine.component.html',
  styleUrls: ['./press-machine.component.css']
})
export class PressMachineComponent implements OnInit {

  tableData: boolean = true
  pressMachineArray: any = []

  constructor(private pressMachineService: PressMachineService, private router: Router) { }
  ngOnInit(): void {
    this.getPressMachine()
  }

  getPressMachine() {
    this.pressMachineService.getPressMachine().subscribe(res => {
      this.pressMachineArray = res
      // console.log(this.pressMachineArray);
      this.pressMachineArray.length == 0 ? this.tableData = true : this.tableData = false
    })
  }

  deletePressMachine(id: any) {
    this.pressMachineService.deletePressMachine(id).subscribe(res => {
      this.getPressMachine()
    })
  }

  editPressMachine(id: any) {
    this.router.navigate(['/addPressMachine'], { queryParams: { id: id } });
  }

  searchPaperSize(name: any) {
    this.pressMachineService.searchPressMachine(name.value).subscribe(res => {
      this.pressMachineArray = res
      this.pressMachineArray.length == 0 ? this.tableData = true : this.tableData = false;
    })
  }
}