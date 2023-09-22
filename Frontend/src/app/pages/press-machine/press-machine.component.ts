import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PressMachineService } from 'src/app/services/press-machine.service';
import { MessageService } from 'primeng/api';
@Component({
  selector: 'app-press-machine',
  templateUrl: './press-machine.component.html',
  styleUrls: ['./press-machine.component.css']
})
export class PressMachineComponent implements OnInit {
  visible!: boolean
  error: string = ''
  tableData: boolean = true
  pressMachineArray: any = []
  search: string = ''

  constructor(private pressMachineService: PressMachineService, private router: Router,private messageService: MessageService) { }
  ngOnInit(): void {
    this.getPressMachine()
  }

  getPressMachine() {
    this.pressMachineService.getPressMachine().subscribe(res => {
      this.pressMachineArray = res
      this.pressMachineArray.length == 0 ? this.tableData = true : this.tableData = false
    }, error => {
      this.showError(error);
      this.visible = true
    })
  }

  deletePressMachine(id: any) {
    this.pressMachineService.deletePressMachine(id).subscribe(res => {
      this.getPressMachine()
    }, error => {
      this.showError(error);
      this.visible = true
    })
  }

  editPressMachine(id: any) {
    this.router.navigate(['/addPressMachine'], { queryParams: { id: id } });
  }

  searchPaperSize(name: any) {
    if (this.search == '') {
      this.getPressMachine()
    } else {
      this.pressMachineService.searchPressMachine(name.value).subscribe(res => {
        this.pressMachineArray = res
        this.pressMachineArray.length == 0 ? this.tableData = true : this.tableData = false;
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
