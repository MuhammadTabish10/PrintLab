import { Component } from '@angular/core';
import { PetyCash } from 'src/app/Model/petyCash';

@Component({
  selector: 'app-pety-cash',
  templateUrl: './pety-cash.component.html',
  styleUrls: ['./pety-cash.component.css']
})
export class PetyCashComponent {
editMode: boolean = false;
petyCashRecords: PetyCash[] = [];
}
