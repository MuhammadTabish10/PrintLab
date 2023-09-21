import { Component } from '@angular/core';
import { RolesService } from 'src/app/services/roles.service';

@Component({
  selector: 'app-permission',
  templateUrl: './permission.component.html',
  styleUrls: ['./permission.component.css']
})
export class PermissionComponent {

  roles:any=[]
  permissions:any=[]

  constructor(private roleService: RolesService){
  }

  ngOnInit():any{
    this.getRoles();
    this.getpermissions();
  }

  getRoles(){
    this.roleService.getRoles().subscribe(res=>{
      this.roles = res
    })
  }

  getpermissions(){
    this.roleService.getPermissions().subscribe(res=>{
      this.permissions = res
    })
  }

}
