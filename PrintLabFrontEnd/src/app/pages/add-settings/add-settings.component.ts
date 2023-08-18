import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SettingsService } from 'src/app/services/settings.service';

@Component({
  selector: 'app-add-settings',
  templateUrl: './add-settings.component.html',
  styleUrls: ['./add-settings.component.css']
})
export class AddSettingsComponent implements OnInit {

  buttonName: string = 'Add'
  keyData: string = ''
  valueData: string = ''
  idFromQueryParam!: number
  settingToUpdate: any = []

  constructor(private settingService: SettingsService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(param => {
      this.idFromQueryParam = +param['id']
      if (Number.isNaN(this.idFromQueryParam)) {
        this.buttonName = 'Add'
      } else {
        this.settingService.getSettingsById(this.idFromQueryParam).subscribe(res => {
          this.buttonName = 'Update'
          this.settingToUpdate = res
          this.keyData = this.settingToUpdate.key
          this.valueData = this.settingToUpdate.value
        })
      }
    })
  }

  addSetting() {
    let obj = {
      key: this.keyData,
      value: this.valueData
    }
    if (Number.isNaN(this.idFromQueryParam)) {
      this.settingService.postSettings(obj).subscribe(res => {
        this.router.navigateByUrl('/settings')
      })
    } else {
      this.settingService.updateSettings(this.idFromQueryParam, obj).subscribe(() => {
        this.router.navigateByUrl('/settings')
      })
    }
  }
}