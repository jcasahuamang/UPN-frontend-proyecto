import { Injectable } from '@angular/core';
import { Configuracion } from './configuracion-global';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Prestamos } from '../Clases/Prestamos';
import { IValidaRespuesta } from '../Clases/IValidaRespuesta';
import { catchError, Observable, throwError } from 'rxjs';
import Swal from 'sweetalert2';
import { IPrestamosRelacion } from '../Clases/IPrestamosRelacion';

@Injectable({
  providedIn: 'root'
})
export class PrestamosService {

  private config: Configuracion  = new Configuracion();
  private root: string = this.config.endPoints.get("Root")!;
  private prestamo: string = this.config.endPoints.get("Prestamos")!;

  private urlPrestamo: string = this.root+'/'+this.prestamo+'/';
  private httpHeaders = new HttpHeaders({'Content-Type':'application/json'})
  private urlEndPoint: string = "";
  
  constructor(private httpClient: HttpClient) { }

          getDatos(prest: string): Observable<Prestamos>{
            this.urlEndPoint = this.urlPrestamo+prest;
            return this.httpClient.get<Prestamos>(this.urlEndPoint);  
          }
    
          getTodos(): Observable<[Prestamos]>{
            this.urlEndPoint = this.urlPrestamo+'all';
            return this.httpClient.get<[Prestamos]>(this.urlEndPoint);
          }
          
          getTodosByEmpresa(empresa: string): Observable<[Prestamos]>{
            this.urlEndPoint = this.urlPrestamo+'all/'+empresa;
            return this.httpClient.get<[Prestamos]>(this.urlEndPoint);
          }
  
          getTodosByEmpresaPersonal(empresa: string,personal: string): Observable<[Prestamos]>{
            this.urlEndPoint = this.urlPrestamo+'all/'+empresa+'/'+personal;
            return this.httpClient.get<[Prestamos]>(this.urlEndPoint);
          }
  
          getValidaRegistro(empresa: string, personal: string,tiporegistro :string,id: number,fecsolicitud: string,moneda: string,importe :number,cuotas:number): Observable<[IValidaRespuesta]>{
             this.urlEndPoint = this.urlPrestamo+'valida/'+empresa+'/'+personal+'/'+tiporegistro+'/'+id.toString()+'/'+fecsolicitud+'/'+moneda+'/'+importe.toString()+'/'+cuotas.toString();
             return this.httpClient.get<[IValidaRespuesta]>(this.urlEndPoint);
          }
  
          getConsultaPrestamos(empresa: string,planilla: string,estado: string,personal: string,usuario: string): Observable<[IPrestamosRelacion]>{
            this.urlEndPoint = this.urlPrestamo+'consulta/'+empresa+'/'+planilla+'/'+estado+'/'+personal+'/'+usuario;
            return this.httpClient.get<[IPrestamosRelacion]>(this.urlEndPoint);
          }          
  
          create(prestamo: Prestamos): Observable<Prestamos>{
            this.urlEndPoint = this.urlPrestamo;
            return this.httpClient.post<Prestamos>(this.urlEndPoint,prestamo,{headers: this.httpHeaders}).pipe(
              catchError(e => {
                console.error(e.error.mensaje);
                Swal.fire(e.error.mensaje,e.error.error,'error');
                return throwError(e);
              })
            );
          }
          
          update(prestamo: Prestamos): Observable<Prestamos>{
            this.urlEndPoint = this.urlPrestamo+prestamo.id.toString();
            return this.httpClient.put<Prestamos>(this.urlEndPoint,prestamo,{headers: this.httpHeaders}).pipe(
              catchError(e => {
                console.error(e.error.mensaje);
                Swal.fire(e.error.mensaje,e.error.error,'error');
                return throwError(e);
              })
            );
        
          }
          
          delete(prestamo: Number): Observable<Prestamos>{
            this.urlEndPoint = this.urlPrestamo+'delete/'+prestamo.toString();
            return this.httpClient.delete<Prestamos>(this.urlEndPoint,{headers: this.httpHeaders}).pipe(
              catchError(e => {
                console.error(e.error.mensaje);
                Swal.fire(e.error.mensaje,e.error.error,'error');
                return throwError(e);
              })
            );
          }

}
