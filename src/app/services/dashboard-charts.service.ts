import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Parametro } from '../Clases/parametro';
import { CandleChartData as CandleChartData } from '../Clases/candle-chart-data';
import { Observable, catchError, throwError } from 'rxjs';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class DashboardChartsService {

  private URL_SISTEMA_USUARIO: String = Parametro.SISTEMA_URL + "dashboard";
  constructor(private httpClient: HttpClient, private router: Router) { }

  getCandleChartData(fecha: string): Observable<CandleChartData[]> {
    var strUrl = this.URL_SISTEMA_USUARIO + "/candlechart/" + fecha;
    return this.httpClient.get<CandleChartData[]>(strUrl)
      .pipe(catchError(e => {
        console.log(e);
        return throwError(e)
      }));
  }
}