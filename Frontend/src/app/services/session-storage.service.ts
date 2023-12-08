import { Injectable } from '@angular/core';
import { AuthguardService } from './authguard.service';

@Injectable({
  providedIn: 'root'
})
export class SessionStorageService {

  userPermissions: string[] = [];

  constructor(private authGuardSerivce:AuthguardService) {

    const token = localStorage.getItem('token');
    const decodedToken = authGuardSerivce.getDecodedAccessToken(token!);
    
    if (decodedToken) {

    let  decodedTokenPermissions= decodedToken.PERMISSIONS;
    this.userPermissions=decodedTokenPermissions
    }
  }

  hasPermission(requiredPermission: string): boolean {

    return this.userPermissions.includes(requiredPermission);
  }
}
