import { Directive, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';

import {
  DocumentoLaboralService, MES_SIN_SELECCION, ResultadoValidacion,
  SolicitudDocumento, TipoDocumento
} from 'src/app/services/documento-laboral.service';
import { TokenService } from 'src/app/services/TokenService';

/** Textos que cada pantalla puede personalizar. */
export interface MensajesDocumento {
  periodoInvalido: string;
  noHabilitado: string;
  sinInformacion: string;
}

/** Textos por defecto; cada pantalla reemplaza solo los que cambian. */
export const MENSAJES_POR_DEFECTO: MensajesDocumento = {
  periodoInvalido: 'Debe ingresar el año y mes correctamente',
  noHabilitado: 'La visualización de documentos aún no esta habilitada para el periodo seleccionado',
  sinInformacion: 'No existe información para el periodo seleccionado',
};

const MENSAJES_COMUNES = {
  sinCodigoPersonal: 'Su usuario no tiene configurado un código de personal',
  noSePuedeGenerar: 'No se puede generar el documento',
  pdfVacio: 'El archivo PDF generado está vacío.',
};

/**
 * INS-10: flujo común de las pantallas de documentos laborales
 * (boleta de pago, boleta CTS y certificado de quinta).
 * Cada componente solo define lo que lo hace distinto (Template Method).
 */
@Directive()
export abstract class DocumentoLaboralBaseComponent implements OnInit {

  public filtroForm: FormGroup;
  public numdocidentidadpersonal: string;
  isProcessing = false;
  isVisualiza = false;
  isDescarga = false;

  /** Tipo de documento que se valida y se registra en auditoría. */
  protected abstract readonly tipoDocumento: TipoDocumento;
  /** Prefijo del archivo descargado, por ejemplo 'BoletaPago'. */
  protected abstract readonly prefijoArchivo: string;
  /** Mensajes de la pantalla (se pueden reemplazar en cada componente). */
  protected readonly mensajes: MensajesDocumento = MENSAJES_POR_DEFECTO;

  /** Pide al backend el PDF del documento para la solicitud validada. */
  protected abstract obtenerPdf(solicitud: SolicitudDocumento): Observable<Blob>;

  protected constructor(protected readonly documentoService: DocumentoLaboralService,
                        protected readonly tokenService: TokenService,
                        protected readonly fb: FormBuilder) { }

  ngOnInit(): void {
    this.inicializarForm();
    this.cargarListas();
  }

  /** Punto de extensión para cargar combos (meses); por defecto no hace nada. */
  protected cargarListas(): void { /* sin listas por defecto */ }

  /** Punto de extensión: indica si el periodo del formulario es válido. */
  protected periodoValido(): boolean {
    return this.filtroForm.valid && this.filtroForm.get('month')!.value !== MES_SIN_SELECCION;
  }

  /** Punto de extensión: mes con el que se registra la auditoría. */
  protected mesAuditoria(solicitud: SolicitudDocumento): string {
    return solicitud.mes;
  }

  inicializarForm(): void {
    this.filtroForm = this.fb.group({
      year: ['', Validators.compose([Validators.required])],
      month: [MES_SIN_SELECCION, Validators.required],
    });
  }

  onResetForm(): void {
    this.reiniciarEstado();
    this.filtroForm.reset();
    this.filtroForm.get('year')!.setValue('');
    this.filtroForm.get('month')!.setValue(MES_SIN_SELECCION);
  }

  onGenerarPDF(tipo: string): void {
    this.reiniciarEstado();

    if (!this.periodoValido()) {
      this.alerta('Aviso', this.mensajes.periodoInvalido);
      return;
    }
    if (!this.tokenService.isCodificado()) {
      this.alerta('Aviso', MENSAJES_COMUNES.sinCodigoPersonal);
      return;
    }

    const ano = String(this.filtroForm.get('year')!.value);
    const mes = this.filtroForm.get('month')!.value;

    this.documentoService.validarPeriodo(this.tipoDocumento, ano, mes).subscribe({
      next: ({ solicitud, resultado }) => this.procesarValidacion(tipo, solicitud, resultado),
      error: error => this.terminarConError(error),
    });
  }

  closePdfModal(): void {
    this.documentoService.cerrarPdf();
    this.onResetForm();
  }

  alerta(titulo: string, mensaje: string): void {
    Swal.fire({
      title: titulo,
      text: mensaje,
      icon: 'warning',
      width: '350px',
      padding: '10px',
      backdrop: true,
      confirmButtonText: 'Aceptar',
    });
  }

  /** Si el periodo está habilitado pide el PDF; si no, muestra el motivo. */
  private procesarValidacion(tipo: string, solicitud: SolicitudDocumento, resultado: number): void {
    if (resultado !== ResultadoValidacion.PERMITIDO) {
      this.isProcessing = false;
      this.alerta('Aviso', this.mensajeValidacion(resultado));
      return;
    }

    this.numdocidentidadpersonal = solicitud.dni;
    this.isProcessing = true;
    this.isDescarga = tipo === 'Descarga';
    this.isVisualiza = tipo === 'Visualiza';

    this.obtenerPdf(solicitud).subscribe({
      next: pdf => this.entregarPdf(tipo, pdf, solicitud),
      error: error => this.terminarConError(error),
    });
  }

  /** Descarga o muestra el PDF según lo que pidió el usuario. */
  private entregarPdf(tipo: string, pdf: Blob, solicitud: SolicitudDocumento): void {
    if (pdf.size === 0) {
      this.isProcessing = false;
      alert(MENSAJES_COMUNES.pdfVacio);
      return;
    }
    if (tipo === 'Descarga') {
      this.documentoService.descargarPdf(pdf, this.prefijoArchivo + solicitud.dni + '.pdf');
      this.finalizar(solicitud);
    } else if (tipo === 'Visualiza') {
      this.documentoService.mostrarPdf(pdf, () => this.finalizar(solicitud));
    }
  }

  /** Reinicia el formulario y registra la consulta en auditoría (CP-07). */
  private finalizar(solicitud: SolicitudDocumento): void {
    this.onResetForm();
    this.documentoService.registrarAuditoria(solicitud, this.tipoDocumento, this.mesAuditoria(solicitud));
  }

  private mensajeValidacion(resultado: number): string {
    switch (resultado) {
      case ResultadoValidacion.NO_HABILITADO: return this.mensajes.noHabilitado;
      case ResultadoValidacion.SIN_INFORMACION: return this.mensajes.sinInformacion;
      default: return MENSAJES_COMUNES.noSePuedeGenerar;
    }
  }

  private terminarConError(error: unknown): void {
    this.isProcessing = false;
    console.log(error);
  }

  private reiniciarEstado(): void {
    this.isProcessing = false;
    this.isVisualiza = false;
    this.isDescarga = false;
  }
}
