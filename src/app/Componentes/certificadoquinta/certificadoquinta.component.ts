import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

import { PersonalService } from 'src/app/services/personal.service';
import { TokenService } from 'src/app/services/TokenService';
import {
  DocumentoLaboralService, MES_SIN_SELECCION, ResultadoValidacion,
  SolicitudDocumento, TipoDocumento
} from 'src/app/services/documento-laboral.service';

/** El certificado de quinta es anual: se genera y audita con el mes de cierre. */
const MES_CIERRE_ANUAL = '12';

const MENSAJES = {
  periodoInvalido: 'Debe ingresar el año correctamente',
  sinCodigoPersonal: 'Su usuario no tiene configurado un código de personal',
  noHabilitado: 'La visualización de documentos aún no esta habilitada para el periodo seleccionado',
  sinInformacion: 'No existe información para el periodo seleccionado',
  noSePuedeGenerar: 'No se puede generar el documento',
  pdfVacio: 'El archivo PDF generado está vacío.',
};

@Component({
  selector: 'app-certificadoquinta',
  templateUrl: './certificadoquinta.component.html',
  styleUrls: ['./certificadoquinta.component.css']
})
export class CertificadoquintaComponent implements OnInit {

  public filtroForm: FormGroup;
  public numdocidentidadpersonal: string;
  isProcessing = false;
  isVisualiza = false;
  isDescarga = false;

  constructor(private personalService: PersonalService,
              private documentoService: DocumentoLaboralService,
              private tokenService: TokenService,
              private fb: FormBuilder) { }

  ngOnInit(): void {
    this.inicializarForm();
  }

  inicializarForm(): void {
    this.filtroForm = this.fb.group({
      year: ['', Validators.compose([Validators.required])],
      month: [MES_SIN_SELECCION, Validators.required],
    });
  }

  onResetForm() {
    this.reiniciarEstado();
    this.filtroForm.reset();
    this.filtroForm.get('year')!.setValue('');
    this.filtroForm.get('month')!.setValue(MES_SIN_SELECCION);
  }

  onGenerarPDF(tipo: string) {
    this.reiniciarEstado();

    if (!this.filtroForm.valid) {
      this.alerta('Aviso', MENSAJES.periodoInvalido);
      return;
    }
    if (!this.tokenService.isCodificado()) {
      this.alerta('Aviso', MENSAJES.sinCodigoPersonal);
      return;
    }

    const ano = String(this.filtroForm.get('year')!.value);
    const mes = this.filtroForm.get('month')!.value;

    this.documentoService.validarPeriodo(TipoDocumento.CERTIFICADO_QUINTA, ano, mes).subscribe({
      next: ({ solicitud, resultado }) => this.procesarValidacion(tipo, solicitud, resultado),
      error: error => this.terminarConError(error),
    });
  }

  closePdfModal() {
    this.documentoService.cerrarPdf();
    this.onResetForm();
  }

  alerta(titulo: string, mensaje: string) {
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

    this.personalService.getPersonalCertificadoQuinta(solicitud.codEmpresa, solicitud.ano, MES_CIERRE_ANUAL,
        solicitud.codPersonal, solicitud.usuario, solicitud.dni)
      .subscribe({
        next: pdf => this.entregarPdf(tipo, pdf, solicitud),
        error: error => this.terminarConError(error),
      });
  }

  /** Descarga o muestra el PDF según lo que pidió el usuario. */
  private entregarPdf(tipo: string, pdf: Blob, solicitud: SolicitudDocumento): void {
    if (pdf.size === 0) {
      this.isProcessing = false;
      alert(MENSAJES.pdfVacio);
      return;
    }
    if (tipo === 'Descarga') {
      this.documentoService.descargarPdf(pdf, 'Certificado5ta' + solicitud.dni + '.pdf');
      this.finalizar(solicitud);
    } else if (tipo === 'Visualiza') {
      this.documentoService.mostrarPdf(pdf, () => this.finalizar(solicitud));
    }
  }

  /** Reinicia el formulario y registra la consulta en auditoría (CP-07). */
  private finalizar(solicitud: SolicitudDocumento): void {
    this.onResetForm();
    this.documentoService.registrarAuditoria(solicitud, TipoDocumento.CERTIFICADO_QUINTA, MES_CIERRE_ANUAL);
  }

  private mensajeValidacion(resultado: number): string {
    switch (resultado) {
      case ResultadoValidacion.NO_HABILITADO: return MENSAJES.noHabilitado;
      case ResultadoValidacion.SIN_INFORMACION: return MENSAJES.sinInformacion;
      default: return MENSAJES.noSePuedeGenerar;
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