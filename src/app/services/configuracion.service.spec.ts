import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ConfiguracionService } from './configuracion.service';
import { Configuracion } from './configuracion-global';
import { ParamRegistraVisualiza } from '../Clases/paramregistravisualiza';

describe('ConfiguracionService - configuración y auditoría de documentos', () => {
  let service: ConfiguracionService;
  let http: HttpTestingController;

  const URL = new Configuracion().endPoints.get('Root')! + '/configuracion/';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(ConfiguracionService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    http.verify();
  });

  it('CP-07: registraVisualizacion envía por POST los datos de la auditoría', () => {
    const param = new ParamRegistraVisualiza('0001', '2026', '08', 'P001', 'jperez', '12345678', 'BOL');
    service.registraVisualizacion(param).subscribe(r => expect(r).toBe(1));

    const req = http.expectOne(URL + 'registra');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(param);
    req.flush(1);
  });

  it('getPeriodo consulta los periodos configurados', () => {
    service.getPeriodo('0001', '01', 'BOL', '2026').subscribe();

    const req = http.expectOne(URL + 'periodo/0001/01/BOL/2026');
    expect(req.request.method).toBe('GET');
    req.flush([]);
  });

  it('configuraVisualizacion envía por POST la configuración', () => {
    const param = { codempresa: '0001' } as any;
    service.configuraVisualizacion(param).subscribe();

    const req = http.expectOne(URL + 'configura');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(param);
    req.flush(1);
  });

  it('getPlanilla consulta las planillas de la empresa', () => {
    service.getPlanilla('0001').subscribe();

    const req = http.expectOne(URL + 'consultaplanilla/0001');
    expect(req.request.method).toBe('GET');
    req.flush([]);
  });

  it('getExcelAuditoriaConsultaDoc descarga el Excel de auditoría como blob', () => {
    service.getExcelAuditoriaConsultaDoc('0001', '01', '2026', '08', 'BOL').subscribe();

    const req = http.expectOne(URL + 'auditoria/excel/0001/01/2026/08/BOL');
    expect(req.request.method).toBe('GET');
    expect(req.request.responseType).toBe('blob');
    req.flush(new Blob());
  });

  it('actualizaUsuario envía por POST los datos del usuario', () => {
    const param = { codusuario: 'jperez' } as any;
    service.actualizaUsuario(param).subscribe();

    const req = http.expectOne(URL + 'usuario');
    expect(req.request.method).toBe('POST');
    req.flush(1);
  });
});
