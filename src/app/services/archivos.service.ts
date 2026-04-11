import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Configuracion } from './configuracion-global';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ArchivosService {

      private config: Configuracion  = new Configuracion();
      private root: string = this.config.endPoints.get("Root")!;
      private archivo: string = this.config.endPoints.get("Archivos")!;
    
      private urlArchivos: string = this.root+'/'+this.archivo+'/';
      private httpHeaders = new HttpHeaders({'Content-Type':'application/json'})
       private urlEndPoint: string = "";

  constructor(private httpClient: HttpClient) { }

    getDescargaArchivo(tiparchivo:string,empresa:string){
      this.urlEndPoint = this.urlArchivos+'descargar/'+tiparchivo+'/'+empresa;
      return this.httpClient.get(this.urlEndPoint,{ responseType: 'blob' });  

    }

    postSubirArchivo(form: FormData): Observable<number> {
      this.urlEndPoint = this.urlArchivos+'cargar/file';
      return this.httpClient.post<number>(this.urlEndPoint, form);
    }

}
