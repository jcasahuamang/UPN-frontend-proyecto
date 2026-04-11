import { Injectable } from '@angular/core';
import { Configuracion } from './configuracion-global';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { Vacaciones } from '../Clases/Vacaciones';
import Swal from 'sweetalert2';
import { IValidaRespuesta } from '../Clases/IValidaRespuesta';
import { IVacacionesRelacion } from '../Clases/IVacacionesRelacion';

@Injectable({
  providedIn: 'root'
})
export class VacacionesService {

    private config: Configuracion  = new Configuracion();
    private root: string = this.config.endPoints.get("Root")!;
    private vacacion: string = this.config.endPoints.get("Vacaciones")!;
  
    private urlVacacion: string = this.root+'/'+this.vacacion+'/';
    private httpHeaders = new HttpHeaders({'Content-Type':'application/json'})
    private urlEndPoint: string = "";

  constructor(private httpClient: HttpClient) { }


        getDatos(vac: string): Observable<Vacaciones>{
          this.urlEndPoint = this.urlVacacion+vac;
          return this.httpClient.get<Vacaciones>(this.urlEndPoint);  
        }
  
        getTodos(): Observable<[Vacaciones]>{
          this.urlEndPoint = this.urlVacacion+'all';
          return this.httpClient.get<[Vacaciones]>(this.urlEndPoint);
        }
        
        getTodosByEmpresa(empresa: string): Observable<[Vacaciones]>{
          this.urlEndPoint = this.urlVacacion+'all/'+empresa;
          return this.httpClient.get<[Vacaciones]>(this.urlEndPoint);
        }

        getTodosByEmpresaPersonal(empresa: string,personal: string): Observable<[Vacaciones]>{
          this.urlEndPoint = this.urlVacacion+'all/'+empresa+'/'+personal;
          return this.httpClient.get<[Vacaciones]>(this.urlEndPoint);
        }

        getValidaRegistro(empresa: string, personal: string,tiporegistro :string,idVac: number,fecinicio: string,fecfin: string): Observable<[IValidaRespuesta]>{
           this.urlEndPoint = this.urlVacacion+'valida/'+empresa+'/'+personal+'/'+tiporegistro+'/'+idVac.toString()+'/'+fecinicio+'/'+fecfin;
           return this.httpClient.get<[IValidaRespuesta]>(this.urlEndPoint);
        }


        getConsultaVacaciones(empresa: string,planilla: string,estado: string,personal: string,usuario: string): Observable<[IVacacionesRelacion]>{
          this.urlEndPoint = this.urlVacacion+'consulta/'+empresa+'/'+planilla+'/'+estado+'/'+personal+'/'+usuario;
          return this.httpClient.get<[IVacacionesRelacion]>(this.urlEndPoint);
        }

        create(vacacion: Vacaciones): Observable<Vacaciones>{
          this.urlEndPoint = this.urlVacacion;
          return this.httpClient.post<Vacaciones>(this.urlEndPoint,vacacion,{headers: this.httpHeaders}).pipe(
            catchError(e => {
              console.error(e.error.mensaje);
              Swal.fire(e.error.mensaje,e.error.error,'error');
              return throwError(e);
            })
          );
        }
        
        update(vacacion: Vacaciones): Observable<Vacaciones>{
          this.urlEndPoint = this.urlVacacion+vacacion.id.toString();
          return this.httpClient.put<Vacaciones>(this.urlEndPoint,vacacion,{headers: this.httpHeaders}).pipe(
            catchError(e => {
              console.error(e.error.mensaje);
              Swal.fire(e.error.mensaje,e.error.error,'error');
              return throwError(e);
            })
          );
      
        }
        
        delete(vacacion: Number): Observable<Vacaciones>{
          this.urlEndPoint = this.urlVacacion+'delete/'+vacacion.toString();
          return this.httpClient.delete<Vacaciones>(this.urlEndPoint,{headers: this.httpHeaders}).pipe(
            catchError(e => {
              console.error(e.error.mensaje);
              Swal.fire(e.error.mensaje,e.error.error,'error');
              return throwError(e);
            })
          );
        }

}
