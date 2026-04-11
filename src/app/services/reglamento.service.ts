import { Injectable } from '@angular/core';
import { Configuracion } from './configuracion-global';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Reglamentos } from '../Clases/Reglamentos';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReglamentoService {

  private config: Configuracion  = new Configuracion();
  private root: string = this.config.endPoints.get("Root")!;
  private reglamento: string = this.config.endPoints.get("Reglamento")!;

  private urlReglamento: string = this.root+'/'+this.reglamento+'/';
  private httpHeaders = new HttpHeaders({'Content-Type':'application/json'})
  private urlEndPoint: string = "";

        
  constructor(private httpClient: HttpClient) { }


      getDatos(anuncio: string): Observable<Reglamentos>{
        this.urlEndPoint = this.urlReglamento+anuncio;
        return this.httpClient.get<Reglamentos>(this.urlEndPoint);  
      }

      getTodos(): Observable<[Reglamentos]>{
        this.urlEndPoint = this.urlReglamento+'all';
        return this.httpClient.get<[Reglamentos]>(this.urlEndPoint);
      }
      
      getTodosByEmpresa(empresa: string): Observable<[Reglamentos]>{
        this.urlEndPoint = this.urlReglamento+'all/'+empresa;
        return this.httpClient.get<[Reglamentos]>(this.urlEndPoint);
      }

      getReglamentoDoc(id: number)
      {
        this.urlEndPoint = this.urlReglamento+'download/'+id.toString() ;
        return this.httpClient.get(this.urlEndPoint, { observe: 'response',responseType: 'blob' });
      }
            
}
