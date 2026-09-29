import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

import { ParamRegistraVisualiza } from '../Clases/paramregistravisualiza';
import { ConfiguracionService } from './configuracion.service';
import { PersonalService } from './personal.service';
import { TokenService } from './TokenService';

/** Códigos que devuelve el endpoint /personaldoc/valida del backend. */
export enum ResultadoValidacion {
  PERMITIDO = 0,
  NO_HABILITADO = 1,
  SIN_INFORMACION = 2,
}

/** Tipos de documento que reconoce el backend. */
export enum TipoDocumento {
  BOLETA_PAGO = 'BOL',
  BOLETA_CTS = 'CTS',
  CERTIFICADO_QUINTA = '5TA',
}

/** Versión de planilla que usa el kiosko para validar y generar documentos. */
export const VERSION_PLANILLA = '001';

/** Valor del combo de meses cuando el usuario no seleccionó ninguno. */
export const MES_SIN_SELECCION = '00';

/** Datos del trabajador en sesión y del periodo con los que se genera un documento. */
export interface SolicitudDocumento {
  codEmpresa: string;
  codPersonal: string;
  usuario: string;
  dni: string;
  ano: string;
  mes: string;
}

/** Resultado de validar un periodo: la solicitud armada y el código devuelto por el backend. */
export interface ValidacionPeriodo {
  solicitud: SolicitudDocumento;
  resultado: number;
}

/**
 * INS-09: lógica común de los componentes de documentos laborales
 * (boleta de pago, boleta CTS y certificado de quinta).
 */
@Injectable({ providedIn: 'root' })
export class DocumentoLaboralService {

   constructor(private readonly personalService: PersonalService,
               private readonly configuracionService: ConfiguracionService,
               private readonly tokenService: TokenService) { }

  /** Obtiene el DNI del trabajador en sesión y valida si el periodo está habilitado para el documento. */
  validarPeriodo(tipo: TipoDocumento, ano: string, mes: string): Observable<ValidacionPeriodo> {
    const codEmpresa = this.tokenService.getCodEmpresa();
    const codPersonal = this.tokenService.getCodPersonal();
    const usuario = this.tokenService.getUserName();

    return this.personalService.getDatos(codEmpresa, codPersonal, usuario).pipe(
      switchMap(datos => {
        const solicitud: SolicitudDocumento = {
          codEmpresa, codPersonal, usuario, dni: datos.numdocidentidad, ano, mes,
        };
        return this.personalService
          .getPersonalValidaVisualizacion(codEmpresa, ano, mes, VERSION_PLANILLA,
                                          codPersonal, usuario, solicitud.dni, tipo)
          .pipe(map(resultado => ({ solicitud, resultado: Number(resultado) })));
      })
    );
  }

  /** Registra en auditoría que el trabajador consultó el documento (CP-07). */
  registrarAuditoria(solicitud: SolicitudDocumento, tipo: TipoDocumento, mes: string = solicitud.mes): void {
    const parametro = new ParamRegistraVisualiza(solicitud.codEmpresa, solicitud.ano, mes,
      solicitud.codPersonal, solicitud.usuario, solicitud.dni, tipo);
    this.configuracionService.registraVisualizacion(parametro).subscribe({
      error: error => console.log(error),
    });
  }

  /** Descarga el PDF en el equipo del usuario con el nombre indicado. */
  descargarPdf(pdf: Blob, nombreArchivo: string): void {
    const url = window.URL.createObjectURL(pdf);
    const enlace = document.createElement('a');
    enlace.href = url;
    enlace.target = '_blank';
    enlace.download = nombreArchivo;
    enlace.click();
    window.URL.revokeObjectURL(url);
  }

  /** Muestra el PDF en el visor del modal y ejecuta alCargar cuando termina de cargarse. */
  mostrarPdf(pdf: Blob, alCargar: () => void): void {
    const modal = document.getElementById('pdfModal') as HTMLElement;
    const visor = document.getElementById('pdfViewer') as HTMLEmbedElement | HTMLIFrameElement;
    visor.src = window.URL.createObjectURL(pdf);
    modal.style.display = 'block';
    visor.onload = () => alCargar();
  }

  /** Oculta el modal y limpia el visor del PDF. */
  cerrarPdf(): void {
    const modal = document.getElementById('pdfModal') as HTMLElement;
    const visor = document.getElementById('pdfViewer') as HTMLEmbedElement | HTMLIFrameElement;
    modal.style.display = 'none';
    visor.src = '';
  }
}
