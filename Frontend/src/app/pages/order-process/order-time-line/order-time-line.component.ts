import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { EventItem } from 'src/app/Model/EventItem';

@Component({
  selector: 'app-order-time-line',
  templateUrl: './order-time-line.component.html',
  styleUrls: ['./order-time-line.component.css']
})
export class OrderTimeLineComponent implements OnInit {
  events: EventItem[];
  idFromQueryParam: number = 0;

  constructor(
    private route: ActivatedRoute,
    private messageService: MessageService,
    private router: Router
  ) {
    this.events = [
      { status: 'Completed', date: '15/10/2020 10:30', icon: 'pi pi-check', color: '#9C27B0' },
      { status: 'Processing', date: '15/10/2020 14:00', icon: 'pi pi-times', color: '#673AB7' },
    ];
  }
  ngOnInit(): void {
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
}
