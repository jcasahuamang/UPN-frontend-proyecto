import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Configuracion } from './configuracion-global';
import { Tabla } from '../Clases/Tabla';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TablaService {
    private config: Configuracion  = new Configuracion();
    private root: string = this.config.endPoints.get("Root")!;
    private tabla: string = this.config.endPoints.get("Tabla")!;
  
    private urlTabla: string = this.root+'/'+this.tabla+'/';
    private httpHeaders = new HttpHeaders({'Content-Type':'application/json'})
    private urlEndPoint: string = "";

  constructor(private httpClient: HttpClient) { }

        getDatos(vac: string): Observable<Tabla>{
          this.urlEndPoint = this.urlTabla+vac;
          return this.httpClient.get<Tabla>(this.urlEndPoint);  
        }
  
        getTodos(): Observable<[Tabla]>{
          this.urlEndPoint = this.urlTabla+'all';
          return this.httpClient.get<[Tabla]>(this.urlEndPoint);
        }
        
        getTodosByEmpresa(empresa: string): Observable<[Tabla]>{
          this.urlEndPoint = this.urlTabla+'all/'+empresa;
          return this.httpClient.get<[Tabla]>(this.urlEndPoint);
        }

        getTodosByEmpresaTipo(empresa: string,tipo: string): Observable<[Tabla]>{
          this.urlEndPoint = this.urlTabla+'all/'+empresa+'/'+tipo;
          return this.httpClient.get<[Tabla]>(this.urlEndPoint);
        }

}
