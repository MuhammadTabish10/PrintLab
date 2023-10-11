import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RolesService } from 'src/app/services/roles.service';

@Component({
  selector: 'app-permision',
  templateUrl: './permision.component.html',
  styleUrls: ['./permision.component.css']
})
export class PermisionComponent {

  roles: any = []
    permissions: any = []
    rolesPermissionForm!: FormGroup;
    queryParamRole?: String
    selectedRole: any;
    updatePermissionPayload: any
    selectedRoleName: any;
    find: any;

    constructor(
        protected fb: FormBuilder,
        private roleService: RolesService,
        private route: ActivatedRoute,
    ) {
    }
    // private permissionService: PermissionService,

    ngOnInit() {

        this.rolesPermissionForm = this.fb.group({
            role: ['', [Validators.required]],
            permissionCheckboxes: this.fb.array([])
        });

        this.getAllPermissions();
        this.getAllRoles()


        this.route.queryParams.subscribe(params => {
            this.queryParamRole = params['id'];

            if (this.queryParamRole != null) {
                // Set the initial value of the 'role' form control
                this.selectedRole = this.queryParamRole;
                // this.onRoleChange();
            }
        });
    }


    getAllRoles() {
        this.roleService.getRoles().subscribe(res => {
            if (res) {
                this.roles = res;
            }
        })
    }

    getAllPermissions() {
        this.roleService.getPermissions().subscribe(res => {
            // this.permissions = res

            if (res) {
                this.permissions = res;
                this.permissions = this.permissions.map((d: any) => {
                    return {
                        id: d.id,
                        name: d.name,
                        value: false
                    }
                });

                // this.initializePermissionCheckboxes();
            }
        })
    }

    getSelectedRoleName(){
        this.find=this.roles.find((el:any)=> el.id == this.selectedRole)
        return this.find.name
    }
    onSubmit() {

        const permissionOfRole = {
            id: this.selectedRole,
            name: this.getSelectedRoleName(),
            permissions: this.permissions,
        }

        this.updatePermissionPayload = permissionOfRole.permissions

        this.roleService.updatePermissionOfRoles(permissionOfRole).subscribe((res) => {
            alert("success")
            //  this.toastr.success("succesfully changed the permissions")
        }, error => {
            alert("problem")
            //  this.toastr.error("there was a problem in changing the permissions")
        })
        //    window.location.reload()
    }

    findSelectedRole(roleName: string): any | undefined {
        return this.roles.find((role: any) => role.name === roleName);
    }


    addPermission(obj: any) {
        let perm = this.permissions.find((p: any) => p.id == obj.id)
        if (perm) {
            perm.value = !obj.value
        }
    }

    onRoleChange() {
        // Find the selected role object

        this.permissions = this.permissions.map((d: any) => {
            return {
                ...d,
                value: false
            }
        })
        this.roleService.getPermissionOfRoles(this.selectedRole).subscribe((res: any) => {
            console.log(res);
            // Iterate through the permissions array in the response
            res.permissions.forEach((perm: any) => {
                const permission = this.permissions.find((p: any) => p.id === perm.id);
                if (permission) {
                    permission.value = true;
                }
            });


        });
    }
}
