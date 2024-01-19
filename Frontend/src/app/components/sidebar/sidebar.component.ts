import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SessionStorageService } from 'src/app/services/session-storage.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {

  isDropDown1Open: boolean = false;
  isDropDown2Open: boolean = false;
  isDropDown3Open: boolean = false;
  isDropDown4Open: boolean = false;
  isDropDown5Open: boolean = false;
  isDropDown6Open: boolean = false;


  constructor(public sessionStorageService: SessionStorageService) {
  }

  ngOnInit(): void {
  }


  toggleDropDown(dropdownNumber: number) {
    if (dropdownNumber === 1) {
      this.isDropDown1Open = !this.isDropDown1Open;
      this.isDropDown2Open = false;
      this.isDropDown3Open = false;
      this.isDropDown4Open = false;
      this.isDropDown5Open = false;
      this.isDropDown6Open = false;
    } else if (dropdownNumber === 2) {
      this.isDropDown2Open = !this.isDropDown2Open;
      this.isDropDown1Open = false;
      this.isDropDown3Open = false;
      this.isDropDown4Open = false;
      this.isDropDown5Open = false;
      this.isDropDown6Open = false;
    } else if (dropdownNumber === 3) {
      this.isDropDown3Open = !this.isDropDown3Open;
      this.isDropDown1Open = false;
      this.isDropDown2Open = false;
      this.isDropDown4Open = false;
      this.isDropDown5Open = false;
      this.isDropDown6Open = false;
    } else if (dropdownNumber === 4) {
      this.isDropDown4Open = !this.isDropDown4Open;
      this.isDropDown1Open = false;
      this.isDropDown2Open = false;
      this.isDropDown3Open = false;
      this.isDropDown5Open = false;
      this.isDropDown6Open = false;
    } else if (dropdownNumber === 5) {
      this.isDropDown5Open = !this.isDropDown5Open;
      this.isDropDown1Open = false;
      this.isDropDown2Open = false;
      this.isDropDown3Open = false;
      this.isDropDown4Open = false;
      this.isDropDown6Open = false;
    } else if (dropdownNumber === 6) {
      this.isDropDown6Open = !this.isDropDown6Open;
      this.isDropDown1Open = false;
      this.isDropDown2Open = false;
      this.isDropDown3Open = false;
      this.isDropDown4Open = false;
      this.isDropDown5Open = false;
    }
  }
}
