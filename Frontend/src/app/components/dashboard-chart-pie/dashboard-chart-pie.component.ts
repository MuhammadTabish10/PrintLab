import { Component,OnInit } from '@angular/core';
import { DashboardService } from 'src/app/services/dashboard.service';
@Component({
  selector: 'app-dashboard-chart-pie',
  templateUrl: './dashboard-chart-pie.component.html',
  styleUrls: ['./dashboard-chart-pie.component.css']
})
export class DashboardChartPieComponent implements OnInit {
  data: any;
  options: any;


  constructor(private dashboardService: DashboardService) {}

  ngOnInit() :void{

      const documentStyle = getComputedStyle(document.documentElement);
      const textColor = documentStyle.getPropertyValue('--text-color');

      this.dashboardService.getChartPieData().subscribe((response) => {
        // console.log(response[Order-Count]);
        
        this.data = {
            labels: ['OrderCount','ProductCount', 'VendorCount', 'CustomerCount'],
            
            datasets: [
                {
                    data: [(response as any)['orderCount'],
                    (response as any)['productCount'],
                    (response as any)['vendorCount'],
                    (response as any)['customerCount']],
                    backgroundColor: [documentStyle.getPropertyValue('--blue-500'), documentStyle.getPropertyValue('--yellow-500'), documentStyle.getPropertyValue('--green-500'),  documentStyle.getPropertyValue('--orange-500')],
                    hoverBackgroundColor: [documentStyle.getPropertyValue('--blue-400'), documentStyle.getPropertyValue('--yellow-400'), documentStyle.getPropertyValue('--green-400'), documentStyle.getPropertyValue('--orange-400')]
                }
            ]
        };
  
        this.options = {
            plugins: {
                legend: {
                    labels: {
                        usePointStyle: true,
                        color: textColor
                    }
                }
            }
        };
      })

      
  }
}
