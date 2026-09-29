import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Observable } from 'rxjs';

import { DocumentoLaboralBaseComponent, MENSAJES_POR_DEFECTO } from 'src/app/Componentes/documento-laboral/documento-laboral-base.component';
import {
  DocumentoLaboralService, SolicitudDocumento, TipoDocumento
} from 'src/app/services/documento-laboral.service';
import { PersonalService } from 'src/app/services/personal.service';
import { TokenService } from 'src/app/services/TokenService';

/** El certificado de quinta es anual: se genera y audita con el mes de cierre. */
const MES_CIERRE_ANUAL = '12';

@Component({
  selector: 'app-certificadoquinta',
  templateUrl: './certificadoquinta.component.html',
  styleUrls: ['./certificadoquinta.component.css']
})
export class CertificadoquintaComponent extends DocumentoLaboralBaseComponent {

  protected readonly tipoDocumento = TipoDocumento.CERTIFICADO_QUINTA;
  protected readonly prefijoArchivo = 'Certificado5ta';
  protected override readonly mensajes = {
    ...MENSAJES_POR_DEFECTO,
    periodoInvalido: 'Debe ingresar el año correctamente',
  };

  constructor(private readonly personalService: PersonalService,
              documentoService: DocumentoLaboralService,
              tokenService: TokenService,
              fb: FormBuilder) {
    super(documentoService, tokenService, fb);
  }

  /** Solo se pide el año; el mes no se valida. */
  protected override periodoValido(): boolean {
    return this.filtroForm.valid;
  }

  protected override mesAuditoria(): string {
    return MES_CIERRE_ANUAL;
  }

  protected obtenerPdf(s: SolicitudDocumento): Observable<Blob> {
    return this.personalService.getPersonalCertificadoQuinta(
      s.codEmpresa, s.ano, MES_CIERRE_ANUAL, s.codPersonal, s.usuario, s.dni);
  }
}
