import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class HeaderInterceptor implements HttpInterceptor {

  constructor() { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Obtén el username desde el almacenamiento local o de sesión
    const username = sessionStorage.getItem('usuario'); // Asegúrate de que 'usuario' esté guardado correctamente

    if (username) {
      // Clona la solicitud y agrega el header con el username
      const clonedRequest = req.clone({
        setHeaders: {
          username: username
        }
      });

      return next.handle(clonedRequest);
    }

    // Si no hay username, pasa la solicitud original
    return next.handle(req);
  }
}
