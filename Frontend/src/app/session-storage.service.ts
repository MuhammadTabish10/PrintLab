import { Injectable } from '@angular/core';
import { AuthguardService } from './services/authguard.service';

@Injectable({
  providedIn: 'root'
})
export class SessionStorageService {

  userPermissions: string[] = [];

  constructor(private authGuardSerivce:AuthguardService) {

    const token = localStorage.getItem('token');
    const decodedToken = authGuardSerivce.getDecodedAccessToken(token!);
    debugger
    if (decodedToken) {
    let  decodedTokenPermissions= decodedToken.PERMISSIONS;
    this.userPermissions=decodedTokenPermissions
    }
  }

  hasPermission(requiredPermission: string): boolean {
    return this.userPermissions.includes(requiredPermission);
  }
}
