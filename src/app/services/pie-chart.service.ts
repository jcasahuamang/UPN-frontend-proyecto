import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Parametro } from '../Clases/parametro';
import { PieChartData } from '../Clases/pie-chart-data';
import { Observable, catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PieChartService {

  private URL_SISTEMA_USUARIO: String = Parametro.SISTEMA_URL + "dashboard";
  constructor(private httpClient: HttpClient, private router: Router) { }

  getPieChartData(fecha: string): Observable<PieChartData> {
    var strUrl = this.URL_SISTEMA_USUARIO + "/piechart/" + fecha;
    return this.httpClient.get<PieChartData>(strUrl)
      .pipe(catchError(e => {
        console.log(e);
        return throwError(e)
      }));
  }
}
