import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';

import { CertificadoquintaComponent } from './certificadoquinta.component';
import { PersonalService } from 'src/app/services/personal.service';
import { ConfiguracionService } from 'src/app/services/configuracion.service';
import { TokenService } from 'src/app/services/TokenService';

describe('CertificadoquintaComponent - generación del certificado de quinta', () => {
  let component: CertificadoquintaComponent;
  let fixture: ComponentFixture<CertificadoquintaComponent>;
  let personalSpy: jasmine.SpyObj<PersonalService>;
  let configSpy: jasmine.SpyObj<ConfiguracionService>;
  let tokenSpy: jasmine.SpyObj<TokenService>;
  let alertaSpy: jasmine.Spy;

  const PDF = new Blob(['%PDF-1.4'], { type: 'application/pdf' });

  beforeEach(async () => {
    personalSpy = jasmine.createSpyObj('PersonalService',
      ['getDatos', 'getPersonalValidaVisualizacion', 'getPersonalCertificadoQuinta']);
    configSpy = jasmine.createSpyObj('ConfiguracionService', ['registraVisualizacion']);
    tokenSpy = jasmine.createSpyObj('TokenService',
      ['isCodificado', 'getCodEmpresa', 'getCodPersonal', 'getUserName']);

    await TestBed.configureTestingModule({
      declarations: [CertificadoquintaComponent],
      imports: [ReactiveFormsModule],
      providers: [
        { provide: PersonalService, useValue: personalSpy },
        { provide: ConfiguracionService, useValue: configSpy },
        { provide: TokenService, useValue: tokenSpy },
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(CertificadoquintaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    alertaSpy = spyOn(component, 'alerta');   // evita abrir SweetAlert durante la prueba
  });

  // Simula un trabajador con sesión y el resultado de la validación del periodo.
  // El certificado es anual: la pantalla solo pide el año (el mes queda en "00").
  function prepararTrabajador(validacion: number): void {
    tokenSpy.isCodificado.and.returnValue(true);
    tokenSpy.getCodEmpresa.and.returnValue('0001');
    tokenSpy.getCodPersonal.and.returnValue('P001');
    tokenSpy.getUserName.and.returnValue('jperez');
    personalSpy.getDatos.and.returnValue(of({ numdocidentidad: '12345678' } as any));
    personalSpy.getPersonalValidaVisualizacion.and.returnValue(of(validacion));
    component.filtroForm.get('year')!.setValue('2025');
  }

  // ---------- Validaciones del formulario ----------

  it('sin año muestra aviso y no llama al backend', () => {
    component.onGenerarPDF('Visualiza');
    expect(alertaSpy).toHaveBeenCalledWith('Aviso', 'Debe ingresar el año correctamente');
    expect(personalSpy.getDatos).not.toHaveBeenCalled();
  });

  it('usuario sin código de personal muestra aviso', () => {
    component.filtroForm.get('year')!.setValue('2025');
    tokenSpy.isCodificado.and.returnValue(false);
    component.onGenerarPDF('Visualiza');
    expect(alertaSpy).toHaveBeenCalledWith('Aviso', 'Su usuario no tiene configurado un código de personal');
    expect(personalSpy.getDatos).not.toHaveBeenCalled();
  });

  // ---------- Respuesta de la validación del periodo (tipo 5TA) ----------

  it('CP-06: periodo no habilitado (1) avisa y no genera el PDF', () => {
    prepararTrabajador(1);
    component.onGenerarPDF('Visualiza');
    expect(personalSpy.getPersonalValidaVisualizacion).toHaveBeenCalledWith(
      '0001', '2025', '00', '001', 'P001', 'jperez', '12345678', '5TA');
    expect(alertaSpy).toHaveBeenCalledWith('Aviso',
      'La visualización de documentos aún no esta habilitada para el periodo seleccionado');
    expect(personalSpy.getPersonalCertificadoQuinta).not.toHaveBeenCalled();
  });

  it('CP-06: sin información (2) avisa que no existe información', () => {
    prepararTrabajador(2);
    component.onGenerarPDF('Visualiza');
    expect(alertaSpy).toHaveBeenCalledWith('Aviso', 'No existe información para el periodo seleccionado');
  });

  it('código desconocido avisa que no se puede generar', () => {
    prepararTrabajador(9);
    component.onGenerarPDF('Visualiza');
    expect(alertaSpy).toHaveBeenCalledWith('Aviso', 'No se puede generar el documento');
  });

  // ---------- Visualización del PDF y auditoría ----------

  it('CP-05 + CP-07: visualizar muestra el certificado y registra la auditoría', () => {
    prepararTrabajador(0);
    personalSpy.getPersonalCertificadoQuinta.and.returnValue(of(PDF));
    configSpy.registraVisualizacion.and.returnValue(of(1));

    component.onGenerarPDF('Visualiza');

    expect(personalSpy.getPersonalCertificadoQuinta).toHaveBeenCalledWith(
      '0001', '2025', '12', 'P001', 'jperez', '12345678');   // siempre pide el mes 12
    const modal = document.getElementById('pdfModal') as HTMLElement;
    expect(modal.style.display).toBe('block');

    const visor = document.getElementById('pdfViewer') as HTMLEmbedElement;
    visor.onload!.call(visor, new Event('load'));   // simula que el PDF terminó de cargar
    expect(configSpy.registraVisualizacion).toHaveBeenCalledWith(jasmine.objectContaining({
      tipdocumento: '5TA', ano: '2025', mes: '12', numdocidentidad: '12345678' }));
  });

  // ---------- Descarga, PDF vacío y error del backend ----------

  it('CP-05 + CP-07: descargar dispara la descarga y registra la auditoría', () => {
    prepararTrabajador(0);
    personalSpy.getPersonalCertificadoQuinta.and.returnValue(of(PDF));
    configSpy.registraVisualizacion.and.returnValue(of(1));
    const clickSpy = spyOn(HTMLAnchorElement.prototype, 'click');   // evita la descarga real

    component.onGenerarPDF('Descarga');

    expect(clickSpy).toHaveBeenCalled();
    expect(configSpy.registraVisualizacion).toHaveBeenCalledWith(
      jasmine.objectContaining({ tipdocumento: '5TA', mes: '12' }));
    expect(component.isProcessing).toBeFalse();
    expect(component.filtroForm.get('year')!.value).toBe('');   // formulario reiniciado
  });

  it('PDF vacío muestra alerta y no registra auditoría', () => {
    prepararTrabajador(0);
    personalSpy.getPersonalCertificadoQuinta.and.returnValue(of(new Blob([])));
    const alertSpy = spyOn(window, 'alert');

    component.onGenerarPDF('Descarga');

    expect(alertSpy).toHaveBeenCalledWith('El archivo PDF generado está vacío.');
    expect(configSpy.registraVisualizacion).not.toHaveBeenCalled();
  });

  it('INS-11: si el backend falla, el usuario no recibe ningún mensaje', () => {
    prepararTrabajador(0);
    personalSpy.getPersonalCertificadoQuinta.and.returnValue(throwError(() => new Error('500')));

    component.onGenerarPDF('Descarga');

    expect(component.isProcessing).toBeFalse();
    expect(alertaSpy).not.toHaveBeenCalled();   // tras corregirlo, esta línea debe cambiar
  });
});
