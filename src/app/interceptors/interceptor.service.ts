import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest,HTTP_INTERCEPTORS } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, Observable, throwError } from 'rxjs';
import Swal from 'sweetalert2';
import { TokenService } from '../services/TokenService';

/* @Injectable({ providedIn: 'root' })
export class InterceptorService implements HttpInterceptor {

  constructor() { }
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError(this.manejaError)
    );
  }

  manejaError(error: HttpErrorResponse) {
    console.log('Sucedio un error');
    console.warn(error);
    return throwError('Error personalizado');
  }
} */

@Injectable({ providedIn: 'root' })
export class InterceptorService implements HttpInterceptor {

  constructor(private router: Router,
    private tokenService: TokenService ) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
      let intReq = req;
      const token = this.tokenService.getToken();
      if (token != null) {
        intReq = req.clone({ headers: req.headers.set('Authorization', 'Bearer ' + token)});
      }
      return next.handle(intReq);
  }
  
}

export const interceptorProvider = [{provide: HTTP_INTERCEPTORS, useClass: InterceptorService, multi: true}];