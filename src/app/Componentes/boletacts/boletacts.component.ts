import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Observable } from 'rxjs';

import { DocumentoLaboralBaseComponent, MENSAJES_POR_DEFECTO } from 'src/app/Componentes/documento-laboral/documento-laboral-base.component';
import { Configuracion } from 'src/app/services/configuracion-global';
import {
  DocumentoLaboralService, SolicitudDocumento, TipoDocumento
} from 'src/app/services/documento-laboral.service';
import { PersonalService } from 'src/app/services/personal.service';
import { TokenService } from 'src/app/services/TokenService';

@Component({
  selector: 'app-boletacts',
  templateUrl: './boletacts.component.html',
  styleUrls: ['./boletacts.component.css']
})
export class BoletactsComponent extends DocumentoLaboralBaseComponent {

  public mesesLista?: any[];

  protected readonly tipoDocumento = TipoDocumento.BOLETA_CTS;
  protected readonly prefijoArchivo = 'BoletaCTS';
  protected override readonly mensajes = {
    ...MENSAJES_POR_DEFECTO,
    noHabilitado: 'La visualización de documentos aún no esta habilitada para este periodo',
    sinInformacion: 'No existe información para este periodo',
  };

  constructor(private readonly personalService: PersonalService,
              documentoService: DocumentoLaboralService,
              tokenService: TokenService,
              fb: FormBuilder) {
    super(documentoService, tokenService, fb);
  }

  protected override cargarListas(): void {
    this.mesesLista = new Configuracion().mesesCts;
  }

  protected obtenerPdf(s: SolicitudDocumento): Observable<Blob> {
    return this.personalService.getPersonalBoletaCts(s.codEmpresa, s.ano, s.mes, s.codPersonal);
  }
}
