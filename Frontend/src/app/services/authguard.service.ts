import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import jwt_decode from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthguardService implements CanActivate {

  constructor(private router: Router) { }
  get token(): string {
    return localStorage.getItem("token")!;
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const jwtToken = localStorage.getItem('token');
    if (jwtToken) {
      const decodedToken = this.getDecodedAccessToken(jwtToken);
      const userPermissions = decodedToken.PERMISSIONS;
      const userRoles = decodedToken.ROLES;
      
      const url = state.url;
      let permission: any = {};
      const permissionsObj = this.getPermissionsObj();
      const matchingPermission = permissionsObj.find((p:any) => p.url.some((u:any) => this.urlMatches(u, url)));
      
      if (matchingPermission) {
        permission = matchingPermission;
      }
      
      if (userPermissions.includes(permission.permissions)) {
        return true;
      } else {
        this.router.navigate(['/unauthorized']); // Redirect to an unauthorized page or handle it as needed
        return false;
      }
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }

  getDecodedAccessToken(token: string): any {
    try {
      return jwt_decode(token);
    } catch(Error) {
      console.error('Error decoding JWT token:'+Error);
    }
}
getPermissionsObj():any{

// const customerObj={
//   url:['/customers'],
//   permissions:'Customers'
//  }
//  const userObj={
//   url:['/orders'],
//   permissions:'Orders'
//  }

//  const currencyObj={
//   url:['/addOrder'],
//   permissions:'Orders'
//  }
//  const customObj={  
//   url:['/products'],
//   permissions:'Products'
//  }
//  const regionObj={
//   url:['/addProduct'],
//   permissions:'Products'
//  }
//  const importObj={
//   url:['/viewProduct'],
//   permissions:'Products'
//  }
//  const salesReportObj={
//   url:['/viewProduct'],
//   permissions:'Products'
//  }
//  const permissionsObj={
//   url:['/permission'],
//   permissions:'Permissions'
//  }
//  const dashboardObj={
//   url:['/dashboard'],
//   permissions:'Dashboard'
//  }
//  const sheetHistoryObj={
//   url:['/sheetHistory '],
//   permissions:'SHEET_HISTORY_REPOSITORY'
//  }
 

 
//  return  [dashboardObj,customerObj,userObj,currencyObj,customObj,regionObj,importObj,salesReportObj,permissionsObj]
//  ,permissionsObj,dashboardObj,sheetHistoryObj


const customerObj={
  url:['/customers'],
  permissions:'Customers'
 }
 const userObj={
  url:['/orders'],
  permissions:'Orders'
 }
 const productObj={
  url:['/products'],
  permissions:'Products'
 }
 const addproductObj={
  url:['/addProduct'],
  permissions:'Products'
 }
 const calculatorObj={  
  url:['/calculator'],
  permissions:'Calculator'
 }
 const permissionObj={  
  url:['/permission'],
  permissions:'Permissions'
 }
 const configurationObj={  
  url:['/productField'],
  permissions:'Configuration'
 }
//  const regionObj={
//   url:['/region/view','/region'],
//   permissions:'REGIONS_MANAGEMENT'
//  }
//  const importObj={
//   url:['/import'],
//   permissions:'IMPORT_EXCEL_MANAGEMENT'
//  }
//  const salesReportObj={
//   url:['/reports'],
//   permissions:'SALES_REPORT_MANAGEMENT'
//  }
//  const permissionsObj={
//   url:['/permissions'],
//   permissions:'PERMISSIONS_MANAGEMENT'
//  }
 const dashboardObj={
  url:['/dashboard'],
  permissions:'Dashboard'
 }
//  const sheetHistoryObj={
//   url:['/sheetHistory '],
//   permissions:'SHEET_HISTORY_REPOSITORY'
//  }
 
 
 return  [customerObj,userObj,productObj,dashboardObj,addproductObj,calculatorObj,permissionObj,configurationObj]
  // ,customObj,regionObj,importObj,salesReportObj,permissionsObj,dashboardObj,sheetHistoryObj

}
private urlMatches(pattern: string, url: string): boolean {
const patternSegments = pattern.split('?')[0].split('/'); // Get URL segments without query parameters
const urlSegments = url.split('?')[0].split('/'); // Get URL segments without query parameters

if (patternSegments.length !== urlSegments.length) {
  return false; // URLs have different segment counts
}

for (let i = 0; i < patternSegments.length; i++) {
  if (patternSegments[i] !== urlSegments[i]) {
    return false; // Segments don't match
  }
}

return true; // All segments match
}
}
