import { Injectable } from '@angular/core';
import { Configuracion } from './configuracion-global';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MaeEmpresas } from '../Clases/maeempresa';

@Injectable({
  providedIn: 'root'
})
export class EmpresaService {

    private config: Configuracion  = new Configuracion();
    private root: string = this.config.endPoints.get("Root")!;
    private compania: string = this.config.endPoints.get("Compania")!;
  
    private urlCompania: string = this.root+'/'+this.compania+'/';
    private httpHeaders = new HttpHeaders({'Content-Type':'application/json'})
     private urlEndPoint: string = "";
  
    
  constructor(private httpClient: HttpClient) { }


    getDatos(empresa: string): Observable<MaeEmpresas>{
      this.urlEndPoint = this.urlCompania+empresa;
      return this.httpClient.get<MaeEmpresas>(this.urlEndPoint);  
  }
  getTodos(): Observable<[MaeEmpresas]>{
    this.urlEndPoint = this.urlCompania+'all';
    return this.httpClient.get<[MaeEmpresas]>(this.urlEndPoint);
  }

}
