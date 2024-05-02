import { Injectable } from '@angular/core';
import { AuthguardService } from './authguard.service';
import { Observable } from 'rxjs';
import { User } from '../Model/User';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SessionStorageService {

  userPermissions: string[] = [];


  constructor(
    private authGuardSerivce: AuthguardService,
    private http: HttpClient,
  ) {

    const token = JSON.parse(localStorage.getItem("token")!).jwt;
    const decodedToken = authGuardSerivce.getDecodedAccessToken(token!);

    if (decodedToken) {
      let decodedTokenPermissions = decodedToken.PERMISSIONS;
      this.userPermissions = decodedTokenPermissions
    }
  }

  hasPermission(requiredPermission: string): boolean {
    return this.userPermissions.includes(requiredPermission);
  }

  getOnlineUsersDetails(): Observable<User[]> {
    return this.http.get<User[]>('your-backend-url/online-users-details');
  }
}
