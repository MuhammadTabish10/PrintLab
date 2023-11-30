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
    ;
    const jwtToken = localStorage.getItem('token');
    if (jwtToken) {
      const decodedToken = this.getDecodedAccessToken(jwtToken);
      const userPermissions = decodedToken.PERMISSIONS;
      const userRoles = decodedToken.ROLES;

      const url = state.url;
      let permission: any = {};
      const permissionsObj = this.getPermissionsObj();
      const matchingPermission = permissionsObj.find((p: any) => p.url.some((u: any) => this.urlMatches(u, url)));

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
    } catch (Error) {
      console.error('Error decoding JWT token:' + Error);
    }
  }
  getPermissionsObj(): any {
    const dashboardObj = {
      url: ['/dashboard'],
      permissions: 'Dashboard'
    }
    const designerOrderObj = {
      url: ['/jobDesignerOrders'],
      permissions: 'JobDesigner'
    }
    const productionObj = {
      url: ['/jobProductionOrders'],
      permissions: 'JobProduction'
    }
    const plateSetterObj = {
      url: ['/jobPlateSetterOrders'],
      permissions: 'JobPlateSetter'
    }
    const userObj = {
      url: ['/user', '/addUser','/userPetyCash'],
      permissions: 'User'
    }
    const customerObj = {
      url: ['/customers', '/addCustomer'],
      permissions: 'Customers'
    }

    const orderObj = {
      url: ['/orders', '/addOrder', '/viewOrder','/orderProcess','/transactions','/transactionRecord'],
      permissions: 'Orders'
    }
    const orderProcessObj = {
      url: ['/orderProcess','/transactions','/transactionRecord'],
      permissions: 'OrderProcess'
    }
    const ProductRule = {
      url: ['/ProductRule', '/addProductRule', '/viewProductRule'],
      permissions: 'ProductRule'
    }
    // const productObj = {
    //   url: ['/products', '/addProduct'],
    //   permissions: 'Products'
    // }
    const addproductObj = {
      url: ['/addProduct'],
      permissions: 'Products'
    }
    const calculatorObj = {
      url: ['/calculator'],
      permissions: 'Calculator'
    }
    const permissionObj = {
      url: ['/permission'],
      permissions: 'Permissions'
    }
    const paperStock = {
      url: ['/paperStock', '/addPaperStock'],
      permissions: 'PaperStock'
    }
    // const addPaperStock = {
    //   url: [],
    //   permissions: 'AddPaperStock'
    // }
    const permissionConfiguration_Product_Field = {
      url: ['/productField', '/addProductField'],
      permissions: 'Configuration_Product_Field'
    }
    const permissionConfiguration_Settings = {
      url: ['/settings', '/addSettings'],
      permissions: 'Configuration_Settings'
    }
    const permissionConfiguration_Inventory = {
      url: ['/inventory', '/addInventory'],
      permissions: 'Configuration_Inventory'
    }
    const permissionConfiguration_Vendor = {
      url: ['/vendor', '/addVendor', '/vendorSettlement'],
      permissions: 'Configuration_Vendor'
    }
    const permissionConfiguration_CTP = {
      url: ['/ctp', '/addCtp'],
      permissions: 'Configuration_CTP'
    }
    const permissionConfiguration_Paper_Size = {
      url: ['/paperSize', '/addPaperSize'],
      permissions: 'Configuration_Paper_Size'
    }
    const permissionConfiguration_Press_Machine = {
      url: ['/pressMachine', '/addPressMachine'],
      permissions: 'Configuration_Press_Machine'
    }
    const permissionConfiguration_Paper_Market_Rate = {
      url: ['/paperMarket', '/addPaperMarket'],
      permissions: 'Configuration_Paper_Market_Rate'
    }
    const permissionConfiguration_Uping = {
      url: ['/uping', '/addUping'],
      permissions: 'Configuration_Uping'
    }
    const permissionConfiguration_Product_Process = {
      url: ['/productProcess', '/addProductProcess'],
      permissions: 'Configuration_Product_Process'
    }


    return [customerObj, userObj, ProductRule, orderObj, orderProcessObj, designerOrderObj, productionObj, plateSetterObj, dashboardObj, addproductObj, calculatorObj, permissionObj, paperStock, permissionConfiguration_Product_Field,
      permissionConfiguration_Settings, permissionConfiguration_Inventory, permissionConfiguration_Vendor, permissionConfiguration_CTP, permissionConfiguration_Paper_Size,
      permissionConfiguration_Press_Machine, permissionConfiguration_Paper_Market_Rate, permissionConfiguration_Uping, permissionConfiguration_Product_Process]


    // const configurationObj = {
    //   url: ['/productField','/paperMarket','/addPaperMarket','/paperSize','/addPaperSize','/pressMachine','/addPressMachine','/uping',
    //         '/addUping','/vendor','/addVendor','/productProcess','/addProductProcess','/settings','/addSettings','/ctp','/addCtp',
    //         '/inventory','/addInventory'],
    //   permissions: 'Configuration'
    // }
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
