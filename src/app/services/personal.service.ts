import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Configuracion } from './configuracion-global';
import { Observable } from 'rxjs';
import { Usuario } from '../Clases/usuario';
import { PersonalDatos } from '../Clases/personaldatos';

@Injectable({
  providedIn: 'root'
})
export class PersonalService {

    //  private urlEndPoint: string = 'http://localhost:8060/ccosto';
    private config: Configuracion  = new Configuracion();
    private root: string = this.config.endPoints.get("Root")!;
    private personal: string = this.config.endPoints.get("Personal")!;
    private personaldoc: string = this.config.endPoints.get("PersonalDoc")!;
    

    private urlPersonal: string = this.root+'/'+this.personal+'/';
    private urlPersonalDoc: string = this.root+'/'+this.personaldoc+'/';    
    private httpHeaders = new HttpHeaders({'Content-Type':'application/json'})
     private urlEndPoint: string = "";
  
    
  constructor(private httpClient: HttpClient) { }


    getDatos(empresa: string,personal: string,usuario: string): Observable<PersonalDatos>{
      this.urlEndPoint = this.urlPersonal+'datos/'+empresa+'/'+personal+'/'+usuario;
      return this.httpClient.get<PersonalDatos>(this.urlEndPoint);  
  }


  getPersonalValidaVisualizacion(codempresa: string,ano: string,mes: string,version: string,codpersonal: string,
    codusuario: string,docidentidad: string,tipodocumento: string):Observable<Number>
  {
    this.urlEndPoint = this.urlPersonalDoc+'valida/'+codempresa+'/'+
                      ano+'/'+mes+'/'+version+'/'+codpersonal+'/'+codusuario+'/'+docidentidad+'/'+tipodocumento;
    return this.httpClient.get<Number>(this.urlEndPoint);
  }


  getPersonalBoletaPago(codempresa: string,ano: string,mes: string,version: string,codpersonal: string,codusuario: string,docidentidad: string)
  {
    this.urlEndPoint = this.urlPersonalDoc+'boletapago/pdf/'+codempresa+'/'+
                      ano+'/'+mes+'/'+version+'/'+codpersonal+'/'+codusuario+'/'+docidentidad;
    return this.httpClient.get(this.urlEndPoint, { responseType: 'blob' });
  }

  
  getPersonalBoletaCts(codempresa: string,ano: string,mes: string, codpersonal: string)
  {
    this.urlEndPoint = this.urlPersonalDoc+'boletacts/pdf/'+codempresa+'/'+ano+'/'+mes+'/'+codpersonal;
    return this.httpClient.get(this.urlEndPoint, { responseType: 'blob' });
  }

    
  getPersonalCertificadoQuinta(codempresa: string,ano: string,mes: string, codpersonal: string,codusuario: string,docidentidad: string)
  {
    this.urlEndPoint = this.urlPersonalDoc+'certificadoqta/pdf/'+codempresa+'/'+ano+'/'+mes+'/'+codpersonal+'/'+codusuario+'/'+docidentidad;
    return this.httpClient.get(this.urlEndPoint, { responseType: 'blob' });
  }
}
