import { Component,Input, OnInit } from '@angular/core';
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

jsonData: any;


constructor(private dashboardService: DashboardService) {}

ngOnInit() {
  this.dashboardService.getAnalaytics().subscribe((data: any) => {
    this.jsonData = data;
  });
}

}
