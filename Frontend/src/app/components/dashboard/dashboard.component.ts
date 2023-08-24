import { Component, OnInit } from '@angular/core';
import { DashboardServiceService } from 'src/app/services/dashboard-service.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  cardsArray: any;

  constructor(private service: DashboardServiceService) { }

  ngOnInit(): void {
    this.getcards();
  }

  getcards() {
    this.service.getcards().subscribe(res => {
      this.cardsArray = res
    })
  }

}