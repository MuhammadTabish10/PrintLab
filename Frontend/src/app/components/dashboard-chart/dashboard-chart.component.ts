import { Component,OnInit } from '@angular/core';
import { DashboardService } from 'src/app/services/dashboard.service';

@Component({
  selector: 'app-dashboard-chart',
  templateUrl: './dashboard-chart.component.html',
  styleUrls: ['./dashboard-chart.component.css']
})
export class DashboardChartComponent implements OnInit {
  data: any;
  options: any;

  constructor(private dashboardService: DashboardService){}

  ngOnInit() :void {
    this.dashboardService.getChartData().subscribe((response)=> {
      const documentStyle = getComputedStyle(document.documentElement);
      const textColor = documentStyle.getPropertyValue('--text-color');
      const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
      const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

    this.data = {
        labels:  ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets:[
        //  {
        // type: 'bar',
        // label: ['Order-Count','Product-Count','Vendor-Count', 'Customer-Count'],      
        
        //  data: [
        //         (response as any)['Order-Count'],
        //         (response as any)['Product-Count'],
        //         (response as any)['Vendor-Count'],
        //          (response as any)['Customer-Count'],
        //        ],  
        //        backgroundColor: [
        //         documentStyle.getPropertyValue(`--blue-700`), // Color for Order-Count
        //         documentStyle.getPropertyValue(`--green-500`), // Color for Product-Count
        //         documentStyle.getPropertyValue(`--red-500`), // Color for Vendor-Count
        //         documentStyle.getPropertyValue(`--purple-500`), // Color for Customer-Count
        //       ],    
        //           }, 
        {
            type: 'bar',
            label: ['OrderCount'],  
            data: [(response as any)['orderCount'],(response as any)['orderCount'],
            (response as any)['orderCount'],(response as any)['orderCount']],
            backgroundColor:[ documentStyle.getPropertyValue(`--blue-500`)],
        },
        {
            type: 'bar',
            label: ['ProductCount'],  
            data: [(response as any)['productCount'],(response as any)['productCount'],
            (response as any)['productCount'],(response as any)['productCount']],
            backgroundColor:[ documentStyle.getPropertyValue(`--green-500`)],
        },
        {
            type: 'bar',
            label: ['VendorCount'],  
            data: [(response as any)['vendorCount'],(response as any)['vendorCount'],
            (response as any)['vendorCount'],(response as any)['vendorCount']],
            backgroundColor:[ documentStyle.getPropertyValue(`--red-500`)],
        },
        {
            type: 'bar',
            label: 'CustomerCount',  
            data: [(response as any)['customerCount'],(response as any)['customerCount'],
            (response as any)['customerCount'],(response as any)['customerCount']],
            backgroundColor:[ documentStyle.getPropertyValue(`--purple-500`)],
        }
     ],
                    
    }
      this.options = {
          maintainAspectRatio: false,
          aspectRatio: 0.8,
          plugins: {
              tooltips: {
                  mode: 'index',
                  intersect: false
              },
              legend: {
                position: 'bottom',
                
                  labels: {
                      color: textColor,
                      usePointStyle: false, // Use point-style icons next to labels
                      boxWidth: 10, // Adjust the width of the color boxes
                      padding: 10,
                      margin :10, 
                      
                        
                  }
              }
          },
          scales: {
              x: {
                  stacked: true,
                  ticks: {
                      color: textColorSecondary
                  },
                  grid: {
                      color: surfaceBorder,
                      drawBorder: false
                  }
              },
              y: {
                  stacked: true,
                  ticks: {
                      color: textColorSecondary
                  },
                  grid: {
                      color: surfaceBorder,
                      drawBorder: false
                  }
              }
          }
      };

    

})

    //   const documentStyle = getComputedStyle(document.documentElement);
    //   const textColor = documentStyle.getPropertyValue('--text-color');
    //   const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
    //   const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

    
      
    //   this.data = {
    //       labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    //       datasets: [
            
    //           {
    //               type: 'bar',
    //               label: 'Dataset 1',
    //               backgroundColor: documentStyle.getPropertyValue('--blue-500'),
    //               data: [50, 25, 12, 48, 90, 76, 42]
    //           },
    //           {
    //               type: 'bar',
    //               label: 'Dataset 2',
    //               backgroundColor: documentStyle.getPropertyValue('--green-500'),
    //               data: [21, 84, 24, 75, 37, 65, 34]
    //           },
    //           {
    //               type: 'bar',
    //               label: 'Dataset 3',
    //               backgroundColor: documentStyle.getPropertyValue('--yellow-500'),
    //               data: [41, 52, 24, 74, 23, 21, 32]
    //           }
    //       ]
    //   };

    //   this.options = {
    //       maintainAspectRatio: false,
    //       aspectRatio: 0.8,
    //       plugins: {
    //           tooltips: {
    //               mode: 'index',
    //               intersect: false
    //           },
    //           legend: {
    //               labels: {
    //                   color: textColor
    //               }
    //           }
    //       },
    //       scales: {
    //           x: {
    //               stacked: true,
    //               ticks: {
    //                   color: textColorSecondary
    //               },
    //               grid: {
    //                   color: surfaceBorder,
    //                   drawBorder: false
    //               }
    //           },
    //           y: {
    //               stacked: true,
    //               ticks: {
    //                   color: textColorSecondary
    //               },
    //               grid: {
    //                   color: surfaceBorder,
    //                   drawBorder: false
    //               }
    //           }
    //       }
    //   };
  }

}
