import {  Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { PersonalDatos } from 'src/app/Clases/personaldatos';
import { PersonalService } from 'src/app/services/personal.service';
import { TokenService } from 'src/app/services/TokenService';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  public codper:string;
  public loginval:string='';
  public codempresa:string;

  public personalDatos: PersonalDatos = new PersonalDatos;
  public formDatos: FormGroup;

  constructor(private personalService: PersonalService,
    private tokenService: TokenService
  ) { 
  }

  ngOnInit(): void {
    this.onListDatos();

  }



  onListDatos() {
    if (this.tokenService.isCodificado()){
        this.personalService.getDatos(
              this.tokenService.getCodEmpresa(),
              this.tokenService.getCodPersonal(),
              this.tokenService.getUserName()).subscribe(
      (result) => {
          this.personalDatos = result;
        }, error => {
          console.log(error);
        }
      );
    }

    }

  onExportExcel(){}

  onExportPdf(){}
  onResetFormCcosto(){}

}
