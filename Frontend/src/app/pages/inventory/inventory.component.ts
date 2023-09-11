import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { InventoryService } from 'src/app/services/inventory.service';

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.css']
})
export class InventoryComponent implements OnInit {

  search: string = ''
  tableData: boolean = true
  inventoryArray: any = []
  visible: boolean = false
  error: string = ''
  gsm: any = []
  sizes: any = []

  constructor(private inventoryService: InventoryService, private router: Router, private datePipe: DatePipe) { }

  ngOnInit(): void {
    this.getInventory()
  }

  searchInventory(inventory: any) { }

  getInventory() {
    this.inventoryService.getInventory().subscribe(res => {
      this.inventoryArray = res
      this.inventoryArray.forEach((element: any) => {
        this.gsm.push(JSON.parse(element.availableGsm))
        this.sizes.push(JSON.parse(element.availableSizes))
        element.created_at = this.datePipe.transform(element.created_at, 'EEEE, MMMM d, yyyy')
      });
      this.inventoryArray.length == 0 ? this.tableData = true : this.tableData = false
    })
  }

  delteInventory(id: any) {
    this.inventoryService.deleteInventory(id).subscribe(res => {
      this.getInventory()
    })
  }

  editInventory(id: any) {
    this.router.navigate(['/addInventory'], { queryParams: { id: id } });
  }

  viewInventory(id: any) {
    this.router.navigate(['/viewInventory'], { queryParams: { id: id } })
  }

  updatePaperMarket(id: any) {
    let index = this.inventoryArray.findIndex((el: any) => el.id == id);
    this.inventoryService.updatePaperMarket(id).subscribe(() => { }, error => {
      this.error = error.error.error
      this.visible = true
    })
  }
}
