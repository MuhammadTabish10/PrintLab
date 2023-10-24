import { Component, Input, OnInit } from '@angular/core';
import { DashboardService } from 'src/app/services/dashboard.service';

@Component({
  selector: 'app-dashboard-cards',
  templateUrl: './dashboard-cards.component.html',
  styleUrls: ['./dashboard-cards.component.css']
})
export class DashboardCardsComponent implements OnInit {

  countCustomers: any;
  countOrders: any;
  countVendors: any;
  countProducts: any;
  targetOrderCount: number = 1000;
  jsonData: any;


  constructor(private dashboardService: DashboardService) { }

  ngOnInit() {
    this.dashboardService.getAnalaytics().subscribe((data: any) => {
      this.jsonData = data;
    });
  }
  calculatePercentage(currentValue: number, referenceValue: number): number {
    if (referenceValue === 0) {
      return 0;
    }
    return (currentValue / referenceValue) * 100;
  }
}
