import { Injectable } from '@angular/core';
import { Configuracion } from './configuracion-global';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Permisos } from '../Clases/Permisos';
import { catchError, Observable, throwError } from 'rxjs';
import { IValidaRespuesta } from '../Clases/IValidaRespuesta';
import Swal from 'sweetalert2';
import { IPermisosRelacion } from '../Clases/IPermisosRelacion';

@Injectable({
  providedIn: 'root'
})
export class PermisosService {

      private config: Configuracion  = new Configuracion();
      private root: string = this.config.endPoints.get("Root")!;
      private permiso: string = this.config.endPoints.get("Permisos")!;
    
      private urlPermiso: string = this.root+'/'+this.permiso+'/';
      private httpHeaders = new HttpHeaders({'Content-Type':'application/json'})
      private urlEndPoint: string = "";
  

      constructor(private httpClient: HttpClient) { }

        getDatos(per: string): Observable<Permisos>{
          this.urlEndPoint = this.urlPermiso+per;
          return this.httpClient.get<Permisos>(this.urlEndPoint);  
        }
  
        getTodos(): Observable<[Permisos]>{
          this.urlEndPoint = this.urlPermiso+'all';
          return this.httpClient.get<[Permisos]>(this.urlEndPoint);
        }
        
        getTodosByEmpresa(empresa: string): Observable<[Permisos]>{
          this.urlEndPoint = this.urlPermiso+'all/'+empresa;
          return this.httpClient.get<[Permisos]>(this.urlEndPoint);
        }

        getTodosByEmpresaPersonal(empresa: string,personal: string): Observable<[Permisos]>{
          this.urlEndPoint = this.urlPermiso+'all/'+empresa+'/'+personal;
          return this.httpClient.get<[Permisos]>(this.urlEndPoint);
        }

        getValidaRegistro(empresa: string, personal: string,tiporegistro :string,idPer: number,fecinicio: string,fecfin: string): Observable<[IValidaRespuesta]>{
           this.urlEndPoint = this.urlPermiso+'valida/'+empresa+'/'+personal+'/'+tiporegistro+'/'+idPer.toString()+'/'+fecinicio+'/'+fecfin;
           return this.httpClient.get<[IValidaRespuesta]>(this.urlEndPoint);
        }

        getConsultaPermisos(empresa: string,planilla: string,estado: string,personal: string,usuario: string): Observable<[IPermisosRelacion]>{
          this.urlEndPoint = this.urlPermiso+'consulta/'+empresa+'/'+planilla+'/'+estado+'/'+personal+'/'+usuario;
          return this.httpClient.get<[IPermisosRelacion]>(this.urlEndPoint);
        }                  

        create(permiso: Permisos): Observable<Permisos>{
          this.urlEndPoint = this.urlPermiso;
          return this.httpClient.post<Permisos>(this.urlEndPoint,permiso,{headers: this.httpHeaders}).pipe(
            catchError(e => {
              console.error(e.error.mensaje);
              Swal.fire(e.error.mensaje,e.error.error,'error');
              return throwError(e);
            })
          );
        }
        
        update(permiso: Permisos): Observable<Permisos>{
          this.urlEndPoint = this.urlPermiso+permiso.id.toString();
          return this.httpClient.put<Permisos>(this.urlEndPoint,permiso,{headers: this.httpHeaders}).pipe(
            catchError(e => {
              console.error(e.error.mensaje);
              Swal.fire(e.error.mensaje,e.error.error,'error');
              return throwError(e);
            })
          );
      
        }
        
        delete(permiso: Number): Observable<Permisos>{
          this.urlEndPoint = this.urlPermiso+'delete/'+permiso.toString();
          return this.httpClient.delete<Permisos>(this.urlEndPoint,{headers: this.httpHeaders}).pipe(
            catchError(e => {
              console.error(e.error.mensaje);
              Swal.fire(e.error.mensaje,e.error.error,'error');
              return throwError(e);
            })
          );
        }



    }
