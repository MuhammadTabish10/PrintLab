import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { EventItem } from 'src/app/Model/EventItem';
import { OrderProcessService } from 'src/app/services/order-process.service';

@Component({
  selector: 'app-order-time-line',
  templateUrl: './order-time-line.component.html',
  styleUrls: ['./order-time-line.component.css']
})
export class OrderTimeLineComponent implements OnInit {
  events!: EventItem[];
  idFromQueryParam: number = 0;

  constructor(
    private route: ActivatedRoute,
    private messageService: MessageService,
    private router: Router,
    private orderProcessService: OrderProcessService
  ) { }
  ngOnInit(): void {
    this.getOrderProcess();
    this.route.queryParams.subscribe(param => {
      this.idFromQueryParam = +param['id']
    }, error => {
      this.showError(error.error.error);
    });
  }
  showError(error: string) {
    this.messageService.add({ severity: 'error', summary: 'Error', detail: error });
  }
  orderProcess() {
    this.router.navigate(['/orderProcess'], { queryParams: { id: this.idFromQueryParam } });
  }
  getOrderProcess() {
    this.orderProcessService.getAllOrderProcesses().subscribe(
      (res: any) => {
        this.events = [
          { status: 'Ordered', date: '15/10/2020 10:30', icon: 'pi pi-shopping-cart', color: '#9C27B0' },
          { status: 'Processing', date: '15/10/2020 14:00', icon: 'pi pi-cog', color: '#673AB7' },
          { status: 'Shipped', date: '15/10/2020 16:15', icon: 'pi pi-shopping-cart', color: '#FF9800' },
          { status: 'Delivered', date: '16/10/2020 10:00', icon: 'pi pi-check', color: '#607D8B' }
        ];

        this.events.forEach((obj) => {
          debugger
          obj.status = res;
        });
      }, error => {

      }
    )
  }
}
