import { HTTP_INTERCEPTORS, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, finalize, switchMap, timer } from 'rxjs';
import { AuthguardService } from './authguard.service';
import { LoaderService } from './loader.service';


@Injectable()
export class InterceptorService implements HttpInterceptor {
  constructor(private authService: AuthguardService, private loaderService: LoaderService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.loaderService.showLoader();
    this.authService.token ? req = req.clone({
      headers: req.headers.set('authorization', `Bearer ${this.authService.token}`)
    }) : null
    return next.handle(req).pipe(finalize(() => {
      this.loaderService.hideLoader();
    }))
  }
}

export const AuthInterceptorProvider = {
  provide: HTTP_INTERCEPTORS,
  useClass: InterceptorService,
  multi: true,
};
