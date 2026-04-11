import { Injectable } from '@angular/core';
import { Configuracion } from './configuracion-global';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { Anuncios } from '../Clases/Anuncios';
import Swal from 'sweetalert2';
import { IAnuncios } from '../Clases/IAnuncios';
import { paramRegistraAnuncioVisualiza } from '../Clases/paramRegistraAnuncioVisualiza';

@Injectable({
  providedIn: 'root'
})
export class AnuncioService {

      private config: Configuracion  = new Configuracion();
      private root: string = this.config.endPoints.get("Root")!;
      private anuncio: string = this.config.endPoints.get("Anuncio")!;
    
      private urlAnuncio: string = this.root+'/'+this.anuncio+'/';
      private httpHeaders = new HttpHeaders({'Content-Type':'application/json'})
      private urlEndPoint: string = "";
  
      constructor(private httpClient: HttpClient) { }

      getDatos(anuncio: string): Observable<Anuncios>{
        this.urlEndPoint = this.urlAnuncio+anuncio;
        return this.httpClient.get<Anuncios>(this.urlEndPoint);  
      }

      getTodos(): Observable<[Anuncios]>{
        this.urlEndPoint = this.urlAnuncio+'all';
        return this.httpClient.get<[Anuncios]>(this.urlEndPoint);
      }
      
      getTodosByEmpresa(empresa: string): Observable<[Anuncios]>{
        this.urlEndPoint = this.urlAnuncio+'all/'+empresa;
        return this.httpClient.get<[Anuncios]>(this.urlEndPoint);
      }

      getAnuncioTodos(estado: number): Observable<[IAnuncios]>{
        this.urlEndPoint = this.urlAnuncio+'consultatodo/'+estado.toString();
        return this.httpClient.get<[IAnuncios]>(this.urlEndPoint);
      }
      
      getAnuncioAlerta(usuario: string,empresa: string, alcance: number,fecha: string): Observable<[IAnuncios]>{
        this.urlEndPoint = this.urlAnuncio+'consultaalerta/'+usuario+'/'+empresa+'/'+alcance.toString()+'/'+fecha;
        return this.httpClient.get<[IAnuncios]>(this.urlEndPoint);
      }

      create(anuncio: Anuncios): Observable<Anuncios>{
        this.urlEndPoint = this.urlAnuncio;
        return this.httpClient.post<Anuncios>(this.urlEndPoint,anuncio,{headers: this.httpHeaders}).pipe(
          catchError(e => {
            console.error(e.error.mensaje);
            Swal.fire(e.error.mensaje,e.error.error,'error');
            return throwError(e);
          })
        );
      }

      update(anuncio: Anuncios): Observable<Anuncios>{
        this.urlEndPoint = this.urlAnuncio+anuncio.id;
        return this.httpClient.put<Anuncios>(this.urlEndPoint,anuncio,{headers: this.httpHeaders}).pipe(
          catchError(e => {
            console.error(e.error.mensaje);
            Swal.fire(e.error.mensaje,e.error.error,'error');
            return throwError(e);
          })
        );
    
      }

      delete(anuncio: Number): Observable<Anuncios>{
        this.urlEndPoint = this.urlAnuncio+'delete/'+anuncio.toString();
        return this.httpClient.delete<Anuncios>(this.urlEndPoint,{headers: this.httpHeaders}).pipe(
          catchError(e => {
            console.error(e.error.mensaje);
            Swal.fire(e.error.mensaje,e.error.error,'error');
            return throwError(e);
          })
        );
      }

      getExcelAnuncioTodos(estado: number){
        this.urlEndPoint = this.urlAnuncio+'todos/excel/'+estado.toString();
        return this.httpClient.get(this.urlEndPoint, { responseType: 'blob' });
      }

    public registraVisualizacion(parametro: paramRegistraAnuncioVisualiza): Observable<number>{
      this.urlEndPoint = this.urlAnuncio+'registravisualizacion';
      return this.httpClient.post<number>(this.urlEndPoint,parametro);
      }

    }
