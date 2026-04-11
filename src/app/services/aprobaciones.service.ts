import { Usuario } from './../Clases/usuario';
import { Injectable } from '@angular/core';
import { Configuracion } from './configuracion-global';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Aprobaciones } from '../Clases/Aprobaciones';
import { catchError, Observable, throwError } from 'rxjs';
import { IValidaRespuesta } from '../Clases/IValidaRespuesta';
//import { ParamAprobacion } from '../Clases/ParamAprobacion';
import Swal from 'sweetalert2';
import { ParamAprobacion } from '../Clases/paramAprobacion';

@Injectable({
  providedIn: 'root'
})
export class AprobacionesService {

    private config: Configuracion  = new Configuracion();
    private root: string = this.config.endPoints.get("Root")!;
    private aprobacion: string = this.config.endPoints.get("Aprobaciones")!;
  
    private urlAprobacion: string = this.root+'/'+this.aprobacion+'/';
    private httpHeaders = new HttpHeaders({'Content-Type':'application/json'})
    private urlEndPoint: string = "";

  constructor(private httpClient: HttpClient) { }


        getDatos(aprob: string): Observable<Aprobaciones>{
          this.urlEndPoint = this.urlAprobacion+aprob;
          return this.httpClient.get<Aprobaciones>(this.urlEndPoint);  
        }
  
        getTodos(): Observable<[Aprobaciones]>{
          this.urlEndPoint = this.urlAprobacion+'all';
          return this.httpClient.get<[Aprobaciones]>(this.urlEndPoint);
        }

        getValidaRegistro(llave: string, tipoaprobacion: string,accion :string,usuario: string): Observable<[IValidaRespuesta]>{
            this.urlEndPoint = this.urlAprobacion+'valida/'+llave+'/'+tipoaprobacion+'/'+accion+'/'+usuario;
            return this.httpClient.get<[IValidaRespuesta]>(this.urlEndPoint);
        }

        public ejecutaAprobacion(parametro: ParamAprobacion): Observable<number>{
             this.urlEndPoint = this.urlAprobacion+'ejecuta';
             return this.httpClient.post<number>(this.urlEndPoint,parametro);
          }

        create(aprob: Aprobaciones): Observable<Aprobaciones>{
          this.urlEndPoint = this.urlAprobacion;
          return this.httpClient.post<Aprobaciones>(this.urlEndPoint,aprob,{headers: this.httpHeaders}).pipe(
            catchError(e => {
              console.error(e.error.mensaje);
              Swal.fire(e.error.mensaje,e.error.error,'error');
              return throwError(e);
            })
          );
        }
        
        update(aprob: Aprobaciones): Observable<Aprobaciones>{
          this.urlEndPoint = this.urlAprobacion+aprob.id?.toString();
          return this.httpClient.put<Aprobaciones>(this.urlEndPoint,aprob,{headers: this.httpHeaders}).pipe(
            catchError(e => {
              console.error(e.error.mensaje);
              Swal.fire(e.error.mensaje,e.error.error,'error');
              return throwError(e);
            })
          );
      
        }

        delete(aprob: Number): Observable<Aprobaciones>{
          this.urlEndPoint = this.urlAprobacion+'delete/'+aprob.toString();
          return this.httpClient.delete<Aprobaciones>(this.urlEndPoint,{headers: this.httpHeaders}).pipe(
            catchError(e => {
              console.error(e.error.mensaje);
              Swal.fire(e.error.mensaje,e.error.error,'error');
              return throwError(e);
            })
          );
        }


      saveAll(aprobaciones: Aprobaciones[]): Observable<[]>{
        this.urlEndPoint = this.urlAprobacion+'saveAll';

        return this.httpClient.put<[]>(this.urlEndPoint,aprobaciones,{headers: this.httpHeaders}).pipe(
          catchError(e => {
            console.error(e.error.mensaje);
            Swal.fire(e.error.mensaje,e.error.error,'error');
            return throwError(e);
          })
        );
      }

     deleteAll(aprobaciones: Aprobaciones[]): Observable<[]>{
        this.urlEndPoint = this.urlAprobacion+'deleteAll';
          return this.httpClient.put<[]>(this.urlEndPoint,aprobaciones,{headers: this.httpHeaders}).pipe(
          catchError(e => {
            console.error(e.error.mensaje);
            Swal.fire(e.error.mensaje,e.error.error,'error');
            return throwError(e);
          })
        );
      }
      

      getDateTimeString(): string {
        const now = new Date();
        const yyyy = now.getFullYear();
        const mm = String(now.getMonth() + 1).padStart(2, '0');
        const dd = String(now.getDate()).padStart(2, '0');
        const hh = String(now.getHours()).padStart(2, '0');
        const min = String(now.getMinutes()).padStart(2, '0');
        const ss = String(now.getSeconds()).padStart(2, '0');
        return `${yyyy}${mm}${dd}_${hh}${min}${ss}`;
      }
}
