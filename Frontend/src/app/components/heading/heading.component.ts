import { Component, Input, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-heading',
  templateUrl: './heading.component.html',
  styleUrls: ['./heading.component.css']
})
export class HeadingComponent implements OnInit {
  @Input() items: MenuItem[] = [];
  @Input() heading: string | undefined | null;
  @Input() icon!: string;
  @Input() isFormScreen: boolean = false;;

  ngOnInit() {
    // this.items = [
    //     { label: 'Electronics' },
    //     { label: 'Computer' },
    // ];
  }
}
