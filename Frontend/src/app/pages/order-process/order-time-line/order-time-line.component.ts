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
  events: EventItem[] = [];
  idFromQueryParam: number = 0;
  ctp: string = 'CTP';
  press: string = 'PRESS';
  paper: string = 'PAPER';
  nowRenderTimline: boolean = false;
  visible: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private messageService: MessageService,
    private router: Router,
    private orderProcessService: OrderProcessService
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(param => {
      this.idFromQueryParam = +param['id']
      this.getCtpOrderProcess();
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

  getCtpOrderProcess() {
    this.orderProcessService.getOrderProcess(this.idFromQueryParam, this.ctp).subscribe(
      (res: any) => {
        const ctpCard = {
          status: 'CTP Process',
          date: res.markAsDone ? 'Completed' : 'Processing',
          icon: res.markAsDone ? 'pi pi-check' : 'pi pi-times',
          color: res.markAsDone ? '#607D8B' : '#673AB7',
          routerLink: ['/orderProcess'],
          queryParams: { id: this.idFromQueryParam },
          red: res.markAsDone ? '#607D8B' : 'red'
        }
        this.events.push(ctpCard);
        this.getPressOrderProcess();
      }, error => {
        this.showError(error.error.error);
      }
    )
  }

  getPressOrderProcess() {
    this.orderProcessService.getPressProcess(this.idFromQueryParam, this.press).subscribe(
      (res: any) => {
        const pressCard = {
          status: 'Press Process',
          date: res.markAsDone ? 'Completed' : 'Processing',
          icon: res.markAsDone ? 'pi pi-check' : 'pi pi-times',
          color: res.markAsDone ? '#607D8B' : '#673AB7',
          routerLink: ['/PressOrderProcess'],
          queryParams: { id: this.idFromQueryParam },
          red: res.markAsDone ? '#607D8B' : 'red'
        }
        this.events.push(pressCard);
        this.getPaperMartOrderProcess();
      }, error => {
        this.showError(error.error.error);
      }
    )
  }
  getPaperMartOrderProcess() {
    this.orderProcessService.getPaperProcess(this.idFromQueryParam, this.paper).subscribe(
      (res: any) => {
        const pressCard = {
          status: 'Paper Market Process',
          date: res.markAsDone ? 'Completed' : 'Processing',
          icon: res.markAsDone ? 'pi pi-check' : 'pi pi-times',
          color: res.markAsDone ? '#607D8B' : '#673AB7',
          routerLink: ['/PaperMarketProcess'],
          queryParams: { id: this.idFromQueryParam },
          red: res.markAsDone ? '#607D8B' : 'red'
        }
        this.events.push(pressCard);
        this.nowRenderTimline = true;
      }, error => {
        this.showError(error.error.error);
      }
    )
  }
  isroute() {
    if (this.events) {
      this.visible = true;
    }
  }
}