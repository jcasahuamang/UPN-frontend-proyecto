import { Injectable } from '@angular/core';
import { Configuracion } from './configuracion-global';
import { HttpClient } from '@angular/common/http';
import { PeriodoVisualizacion } from '../Clases/periodovisualizacion';
import { Observable } from 'rxjs';
import { ParamConfiguraVisualiza } from '../Clases/paramconfigvisualiza';
import {  Planillas } from '../Clases/planillas';
import { ParamRegistraVisualiza } from '../Clases/paramregistravisualiza';
import { ParamActualizaUsuario } from '../Clases/paramActualizaUsuario';

@Injectable({
  providedIn: 'root'
})
export class ConfiguracionService {

      private config: Configuracion  = new Configuracion();
      private root: string = this.config.endPoints.get("Root")!;
      private modulo: string = this.config.endPoints.get("Configuracion")!;
  
      private urlModulo: string = this.root+'/'+this.modulo+'/';
      private urlEndPoint: string = "";

  constructor(private httpClient: HttpClient) { }

      getPeriodo(empresa: string,planilla: string,documento: string,anoproceso: string): Observable<[]>{
        this.urlEndPoint = this.urlModulo+'periodo/'+empresa+'/'+planilla+'/'+documento+'/'+anoproceso;
        return this.httpClient.get<[]>(this.urlEndPoint);  
    }

      public configuraVisualizacion(parametro: ParamConfiguraVisualiza): Observable<number>{
        this.urlEndPoint = this.urlModulo+'configura';
        return this.httpClient.post<number>(this.urlEndPoint,parametro);
      }

      getPlanilla(empresa: string): Observable<[Planillas]>{
        this.urlEndPoint = this.urlModulo+'consultaplanilla/'+empresa;
        return this.httpClient.get<[Planillas]>(this.urlEndPoint);  
    }

    public registraVisualizacion(parametro: ParamRegistraVisualiza): Observable<number>{
      this.urlEndPoint = this.urlModulo+'registra';
      return this.httpClient.post<number>(this.urlEndPoint,parametro);
    }

    getExcelAuditoriaConsultaDoc(empresa: string,planilla: string,anoproceso: string,mesproceso: string,documento: string){
      this.urlEndPoint = this.urlModulo+'auditoria/excel/'+empresa+'/'+planilla+'/'+anoproceso+'/'+mesproceso+'/'+documento;
      return this.httpClient.get(this.urlEndPoint, { responseType: 'blob' });
    }

    public actualizaUsuario(parametro: ParamActualizaUsuario): Observable<number>{
      this.urlEndPoint = this.urlModulo+'usuario';
      return this.httpClient.post<number>(this.urlEndPoint,parametro);
    }
}
