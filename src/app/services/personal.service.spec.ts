import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { PersonalService } from './personal.service';
import { Configuracion } from './configuracion-global';

describe('PersonalService - llamadas al backend de documentos', () => {
  let service: PersonalService;
  let http: HttpTestingController;   // intercepta las peticiones HTTP (no llegan al backend real)

  // Misma URL base que usa el servicio (configuracion-global.ts)
  const ROOT = new Configuracion().endPoints.get('Root')!;
  const PERSONAL = ROOT + '/personal/';
  const DOC = ROOT + '/personaldoc/';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(PersonalService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    http.verify();   // falla si quedó alguna petición sin atender o se hizo una no esperada
  });

  it('getDatos consulta los datos del trabajador', () => {
    service.getDatos('0001', 'P001', 'jperez').subscribe(datos => {
      expect(datos.numdocidentidad).toBe('12345678');
    });

    const req = http.expectOne(PERSONAL + 'datos/0001/P001/jperez');
    expect(req.request.method).toBe('GET');
    req.flush({ numdocidentidad: '12345678' });
  });

  it('getPersonalValidaVisualizacion llama a /valida con todos los parámetros', () => {
    service.getPersonalValidaVisualizacion('0001', '2026', '08', '001', 'P001', 'jperez', '12345678', 'BOL')
      .subscribe(valor => expect(valor).toBe(0));

    const req = http.expectOne(DOC + 'valida/0001/2026/08/001/P001/jperez/12345678/BOL');
    expect(req.request.method).toBe('GET');
    req.flush(0);
  });

  it('CP-01: getPersonalBoletaPago pide el PDF de la boleta como blob', () => {
    const pdf = new Blob(['%PDF-1.4'], { type: 'application/pdf' });
    service.getPersonalBoletaPago('0001', '2026', '08', '001', 'P001', 'jperez', '12345678')
      .subscribe(resp => expect(resp.size).toBeGreaterThan(0));

    const req = http.expectOne(DOC + 'boletapago/pdf/0001/2026/08/001/P001/jperez/12345678');
    expect(req.request.method).toBe('GET');
    expect(req.request.responseType).toBe('blob');
    req.flush(pdf);
  });

  it('CP-03: getPersonalBoletaCts pide el PDF de la boleta CTS como blob', () => {
    service.getPersonalBoletaCts('0001', '2026', '05', 'P001').subscribe();

    const req = http.expectOne(DOC + 'boletacts/pdf/0001/2026/05/P001');
    expect(req.request.method).toBe('GET');
    expect(req.request.responseType).toBe('blob');
    req.flush(new Blob(['%PDF-1.4']));
  });

  it('CP-05: getPersonalCertificadoQuinta pide el PDF del certificado como blob', () => {
    service.getPersonalCertificadoQuinta('0001', '2025', '12', 'P001', 'jperez', '12345678').subscribe();

    const req = http.expectOne(DOC + 'certificadoqta/pdf/0001/2025/12/P001/jperez/12345678');
    expect(req.request.method).toBe('GET');
    expect(req.request.responseType).toBe('blob');
    req.flush(new Blob(['%PDF-1.4']));
  });

  it('propaga el error si el backend responde 500', () => {
    let status = 0;
    service.getPersonalBoletaPago('0001', '2026', '08', '001', 'P001', 'jperez', '12345678')
      .subscribe({ error: e => status = e.status });

    http.expectOne(DOC + 'boletapago/pdf/0001/2026/08/001/P001/jperez/12345678')
      .flush(new Blob(), { status: 500, statusText: 'Server Error' });
    expect(status).toBe(500);
  });
});
