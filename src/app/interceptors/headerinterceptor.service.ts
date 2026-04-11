import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class HeaderInterceptor implements HttpInterceptor {

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Recuperar el username de sessionStorage
    const username = sessionStorage.getItem('usuario');

    if (username) {
      // Clonar la solicitud y agregar el encabezado "username"
      const clonedRequest = req.clone({
        setHeaders: {
          username: username
        }
      });

      // Pasar la solicitud clonada con el encabezado añadido
      return next.handle(clonedRequest);
    }

    // Si no hay username, pasar la solicitud original
    return next.handle(req);
  }
}