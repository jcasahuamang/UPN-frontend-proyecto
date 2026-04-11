import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, Observable, throwError } from 'rxjs';
import { Configuracion } from './configuracion-global';
import { NuevoUsuario } from '../Clases/nuevo-usuario';
import { LoginUsuario } from '../Clases/login-usuario';
import { JwtDTO } from '../Clases/jwt-dto';
import { Usuario } from '../Clases/usuario';
import { MaeEmpresas } from '../Clases/maeempresa';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
//authURL = 'http://localhost:8060/auth/';
private config: Configuracion  = new Configuracion();
private root: string = this.config.endPoints.get("Root")!;
private Auth: string = this.config.endPoints.get("Auth")!;
private Usuario: string = this.config.endPoints.get("Usuario")!;

private authURL: string = this.root+'/'+this.Auth+'/';
private usuarioURL: string = this.root+'/'+this.Usuario+'/';

  constructor(private httpClient: HttpClient) { }
 
  public nuevo(nuevoUsario: NuevoUsuario): Observable<any>{
    return this.httpClient.post<any>(this.authURL+'nuevo',nuevoUsario);
  }

  public login(loginUsario: LoginUsuario): Observable<JwtDTO>{
     return this.httpClient.post<JwtDTO>(this.authURL+'login',loginUsario);

  }

    getDatosEmpresa(empresa: string): Observable<MaeEmpresas>{
      return this.httpClient.get<MaeEmpresas>(this.authURL+'empresa/'+empresa);  
  }


getUsuario(strusr: string): Observable<Usuario> {
  var strUrl = this.usuarioURL + "find/usuario/" + strusr;
//  console.log(strUrl);
  return this.httpClient.get<Usuario>(strUrl);
}

}
