import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { InventoryService } from 'src/app/services/inventory.service';
import { MessageService } from 'primeng/api';
@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.css'],
})
export class InventoryComponent implements OnInit {
  search: string = '';
  tableData: boolean = true;
  inventoryArray: any = [];
  visible: boolean = false;
  error: string = '';
  gsm: any = [];
  sizes: any = [];
  brand: any = [];

  constructor(
    private inventoryService: InventoryService,
    private router: Router,
    private datePipe: DatePipe,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.getInventory();
  }

  searchInventory(inventory: any) {}

  getInventory() {
    this.inventoryService.getInventory().subscribe((res) => {
      this.inventoryArray = res;
      debugger;
      console.log(this.inventoryArray[0].oldRate);
      this.inventoryArray.forEach((element: any) => {
        this.gsm.push(JSON.parse(element.availableGsm));
        this.sizes.push(JSON.parse(element.availableSizes));
        element.created_at = this.datePipe.transform(
          element.created_at,
          'EEEE, MMMM d, yyyy'
        );
        debugger;
        if (element.dateUpdated !== null) {
          element.dateUpdated = this.datePipe.transform(
            element.created_at,
            'EEEE, MMMM d, yyyy'
          );
        }
      });
      this.inventoryArray.length == 0
        ? (this.tableData = true)
        : (this.tableData = false);
    });
  }

  delteInventory(id: any) {
    this.inventoryService.deleteInventory(id).subscribe((res) => {
      this.getInventory();
    });
  }

  editInventory(id: any) {
    this.router.navigate(['/addInventory'], { queryParams: { id: id } });
  }

  viewInventory(id: any) {
    this.router.navigate(['/viewInventory'], { queryParams: { id: id } });
  }

  updatePaperMarket(id: any) {
    this.inventoryService.updatePaperMarket(id).subscribe(
      () => {},
      (error) => {
        this.showError(error);
        this.visible = true;
      }
    );
  }
  showError(error: any) {
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: error.error.error,
    });
  }
}
