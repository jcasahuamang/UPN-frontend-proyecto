import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';

import { ConfiguracionService } from './configuracion.service';
import {
  DocumentoLaboralService, ResultadoValidacion, SolicitudDocumento, TipoDocumento} from './documento-laboral.service';
import { PersonalService } from './personal.service';
import { TokenService } from './TokenService';

describe('DocumentoLaboralService (INS-09)', () => {
  let service: DocumentoLaboralService;
  let personal: jasmine.SpyObj<PersonalService>;
  let configuracion: jasmine.SpyObj<ConfiguracionService>;

  const solicitud: SolicitudDocumento = {
    codEmpresa: '001', codPersonal: 'P001', usuario: 'jperez',
    dni: '12345678', ano: '2025', mes: '03',
  };

  beforeEach(() => {
    personal = jasmine.createSpyObj('PersonalService', ['getDatos', 'getPersonalValidaVisualizacion']);
    configuracion = jasmine.createSpyObj('ConfiguracionService', ['registraVisualizacion']);
    const token = jasmine.createSpyObj('TokenService', ['getCodEmpresa', 'getCodPersonal', 'getUserName']);
    token.getCodEmpresa.and.returnValue('001');
    token.getCodPersonal.and.returnValue('P001');
    token.getUserName.and.returnValue('jperez');

    TestBed.configureTestingModule({
      providers: [
        { provide: PersonalService, useValue: personal },
        { provide: ConfiguracionService, useValue: configuracion },
        { provide: TokenService, useValue: token },
      ],
    });
    service = TestBed.inject(DocumentoLaboralService);
  });

  it('validarPeriodo: arma la solicitud con el DNI y envía versión 001 y el tipo de documento', () => {
    personal.getDatos.and.returnValue(of({ numdocidentidad: '12345678' } as any));
    personal.getPersonalValidaVisualizacion.and.returnValue(of(0 as any));

    let respuesta: any;
    service.validarPeriodo(TipoDocumento.BOLETA_PAGO, '2025', '03').subscribe(r => respuesta = r);

    expect(personal.getPersonalValidaVisualizacion).toHaveBeenCalledWith(
      '001', '2025', '03', '001', 'P001', 'jperez', '12345678', 'BOL');
    expect(respuesta.solicitud).toEqual(solicitud);
    expect(respuesta.resultado).toBe(ResultadoValidacion.PERMITIDO);
  });

  it('validarPeriodo: convierte a número el resultado que llega como texto', () => {
    personal.getDatos.and.returnValue(of({ numdocidentidad: '12345678' } as any));
    personal.getPersonalValidaVisualizacion.and.returnValue(of('2' as any));

    let resultado = -99;
    service.validarPeriodo(TipoDocumento.BOLETA_CTS, '2025', '05').subscribe(r => resultado = r.resultado);

    expect(resultado).toBe(ResultadoValidacion.SIN_INFORMACION);
  });

  it('validarPeriodo: propaga el error si falla getDatos y no llama a la validación', () => {
    personal.getDatos.and.returnValue(throwError(() => new Error('500')));

    let error: any;
    service.validarPeriodo(TipoDocumento.CERTIFICADO_QUINTA, '2025', '00').subscribe({ error: e => error = e });

    expect(error).toBeTruthy();
    expect(personal.getPersonalValidaVisualizacion).not.toHaveBeenCalled();
  });

  it('registrarAuditoria: usa el mes de la solicitud por defecto', () => {
    configuracion.registraVisualizacion.and.returnValue(of({} as any));

    service.registrarAuditoria(solicitud, TipoDocumento.BOLETA_PAGO);

    const param: any = configuracion.registraVisualizacion.calls.mostRecent().args[0];
    expect(JSON.stringify(param)).toContain('"03"');
    expect(JSON.stringify(param)).toContain('"BOL"');
  });

  it('registrarAuditoria: permite indicar otro mes (quinta usa 12) y no rompe si falla', () => {
    configuracion.registraVisualizacion.and.returnValue(throwError(() => new Error('500')));
    spyOn(console, 'log');

    service.registrarAuditoria(solicitud, TipoDocumento.CERTIFICADO_QUINTA, '12');

    const param: any = configuracion.registraVisualizacion.calls.mostRecent().args[0];
    expect(JSON.stringify(param)).toContain('"12"');
    expect(console.log).toHaveBeenCalled();
  });

  it('descargarPdf: crea un enlace con el nombre de archivo y lo pulsa', () => {
    const click = spyOn(HTMLAnchorElement.prototype, 'click');
    const crear = spyOn(document, 'createElement').and.callThrough();

    service.descargarPdf(new Blob(['%PDF'], { type: 'application/pdf' }), 'BoletaPago12345678.pdf');

    const enlace = crear.calls.mostRecent().returnValue as HTMLAnchorElement;
    expect(enlace.download).toBe('BoletaPago12345678.pdf');
    expect(click).toHaveBeenCalled();
  });

  it('mostrarPdf y cerrarPdf: abren y cierran el modal del visor', () => {
    const modal = document.createElement('div');
    modal.id = 'pdfModal';
    const visor = document.createElement('iframe');
    visor.id = 'pdfViewer';
    document.body.append(modal, visor);
    const alCargar = jasmine.createSpy('alCargar');

    service.mostrarPdf(new Blob(['%PDF'], { type: 'application/pdf' }), alCargar);
    expect(modal.style.display).toBe('block');
    (visor.onload as any)();
    expect(alCargar).toHaveBeenCalled();

    service.cerrarPdf();
    expect(modal.style.display).toBe('none');

    modal.remove();
    visor.remove();
  });
});