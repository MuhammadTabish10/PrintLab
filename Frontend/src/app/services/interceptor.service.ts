import { HTTP_INTERCEPTORS, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthguardService } from './authguard.service';


@Injectable()
export class InterceptorService implements HttpInterceptor {

  constructor(private authService: AuthguardService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.authService.token ? req = req.clone({
      headers: req.headers.set('authorization', `Bearer ${this.authService.token}`)


    }) : null
    //  req.headers.set('Access-Control-Allow-Origin', '*')
    return next.handle(req)
  }
}

export const AuthInterceptorProvider = {
  provide: HTTP_INTERCEPTORS,
  useClass: InterceptorService,
  multi: true
}
