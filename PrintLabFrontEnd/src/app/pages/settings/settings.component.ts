import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SettingsService } from 'src/app/services/settings.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent {

  tableData: boolean = true
  settingsArray: any = []

  constructor(private settingsService: SettingsService, private router: Router) { }

  ngOnInit(): void {
    this.getSettings()
  }

  getSettings() {
    this.settingsService.getSettings().subscribe(res => {
      this.settingsArray = res
      this.settingsArray.length == 0 ? this.tableData = true : this.tableData = false
    })
  }

  editSettings(id: any) {
    this.router.navigate(['/addSettings'], { queryParams: { id: id } });
  }

  deleteSettings(id: any) {
    this.settingsService.deleteSettings(id).subscribe(res => {
      this.getSettings()
    })
  }

  searchSettings(key: any) {
    this.settingsService.searchSettings(key.value).subscribe(res => {
      this.settingsArray = res
      this.settingsArray.length == 0 ? this.tableData = true : this.tableData = false;
    })
  }
}