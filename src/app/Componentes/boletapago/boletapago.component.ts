import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Observable } from 'rxjs';

import { DocumentoLaboralBaseComponent } from 'src/app/Componentes/documento-laboral/documento-laboral-base.component';
import { Configuracion } from 'src/app/services/configuracion-global';
import {
  DocumentoLaboralService, SolicitudDocumento, TipoDocumento, VERSION_PLANILLA
} from 'src/app/services/documento-laboral.service';
import { PersonalService } from 'src/app/services/personal.service';
import { TokenService } from 'src/app/services/TokenService';

@Component({
  selector: 'app-boletapago',
  templateUrl: './boletapago.component.html',
  styleUrls: ['./boletapago.component.css']
})
export class BoletapagoComponent extends DocumentoLaboralBaseComponent {

  public mesesLista?: any[];

  protected readonly tipoDocumento = TipoDocumento.BOLETA_PAGO;
  protected readonly prefijoArchivo = 'BoletaPago';

  constructor(private readonly personalService: PersonalService,
              documentoService: DocumentoLaboralService,
              tokenService: TokenService,
              fb: FormBuilder) {
    super(documentoService, tokenService, fb);
  }

  protected override cargarListas(): void {
    this.mesesLista = new Configuracion().meses;
  }

  protected obtenerPdf(s: SolicitudDocumento): Observable<Blob> {
    return this.personalService.getPersonalBoletaPago(
      s.codEmpresa, s.ano, s.mes, VERSION_PLANILLA, s.codPersonal, s.usuario, s.dni);
  }
}
