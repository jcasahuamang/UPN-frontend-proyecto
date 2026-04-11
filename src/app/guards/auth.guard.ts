import Swal  from 'sweetalert2';

import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree,Router } from '@angular/router';
import { Observable } from 'rxjs';
import { TokenService } from '../services/TokenService';
import { SidebarService } from '../services/sidebar.service';

@Injectable({
    providedIn: 'root'
  })
  export class AuthGuard implements CanActivate {
    private _userName: string;
    private _admLevel: string;

    constructor(
      private menuService: SidebarService,
      private tokenService: TokenService,
      private router: Router
    ){
  
    }
  
    canActivate(
      route: ActivatedRouteSnapshot,
      state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
  
      if (this.tokenService.isAuthenticated()){
        this._userName = this.tokenService.getUserName();
        this._admLevel = this.tokenService.getAdmlevel();
      /*
        let _url: string = "";
        state.url.split("/").forEach(element => {
          if (_url === "")
            if (element !== "")
              _url = element;
        });
        */
        let _url: string = "";
        const urlParts = state.url.split("/");
        
        // Si la URL no está vacía
        if (urlParts.length > 0) {
          // Obtener el último elemento (no vacío)
          _url = urlParts.filter(element => element !== "").pop() || "";
        }
       /*
        console.log('state.url');
        console.log(state.url);

        console.log('_url');
        console.log(_url);
        */
        return this.menuService.isPermit(this._userName,this._admLevel, _url);
  
      }
      Swal.fire('Mensaje', `No tienes acceso`, 'error');
      this.router.navigate(['/login']);
      return false;
    }
  
  }