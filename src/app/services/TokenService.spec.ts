import { TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';

import { TokenService } from './TokenService';

describe('TokenService - datos de la sesión del trabajador', () => {
  let service: TokenService;
  let dialogSpy: jasmine.SpyObj<MatDialog>;

  beforeEach(() => {
    dialogSpy = jasmine.createSpyObj('MatDialog', ['closeAll']);
    TestBed.configureTestingModule({
      providers: [{ provide: MatDialog, useValue: dialogSpy }],
    });
    service = TestBed.inject(TokenService);
    sessionStorage.clear();   // cada prueba empieza con la sesión vacía
  });

  afterEach(() => sessionStorage.clear());

  it('guarda y lee los datos de la sesión', () => {
    service.setToken('abc123');
    service.setUserName('jperez');
    service.setUserFullName('Juan Pérez');
    service.setAdmlevel('1');
    service.setCodEmpresa('0001');
    service.setDesEmpresa('Empresa Demo');
    service.setCodPersonal('P001');

    expect(service.getToken()).toBe('abc123');
    expect(service.getUserName()).toBe('jperez');
    expect(service.getUserFullName()).toBe('Juan Pérez');
    expect(service.getAdmlevel()).toBe('1');
    expect(service.getCodEmpresa()).toBe('0001');
    expect(service.getDesEmpresa()).toBe('Empresa Demo');
    expect(service.getCodPersonal()).toBe('P001');
  });

  it('convierte un valor null en cadena vacía al guardar', () => {
    service.setToken(null as any);
    service.setUserName(null as any);
    service.setUserFullName(null as any);
    service.setAdmlevel(null as any);
    service.setCodEmpresa(null as any);
    service.setDesEmpresa(null as any);
    service.setCodPersonal(null as any);

    expect(service.getToken()).toBe('');
    expect(service.getUserName()).toBe('');
    expect(service.getUserFullName()).toBe('');
    expect(service.getAdmlevel()).toBe('');
    expect(service.getCodEmpresa()).toBe('');
    expect(service.getDesEmpresa()).toBe('');
    expect(service.getCodPersonal()).toBe('');
  });

  it('getAuthorities devuelve los roles guardados', () => {
    service.setAuthorities([{ authority: 'ROLE_USER' }, { authority: 'ROLE_RRHH' }] as any);
    expect(service.getAuthorities()).toEqual(['ROLE_USER', 'ROLE_RRHH']);
  });

  it('getAuthorities devuelve una lista vacía si no hay roles', () => {
    expect(service.getAuthorities()).toEqual([]);
  });

  it('isAuthenticated es true solo con token y usuario', () => {
    expect(service.isAuthenticated()).toBeFalse();
    service.setToken('abc123');
    expect(service.isAuthenticated()).toBeFalse();
    service.setUserName('jperez');
    expect(service.isAuthenticated()).toBeTrue();
  });

  it('isCodificado es true solo si el usuario tiene código de personal', () => {
    expect(service.isCodificado()).toBeFalse();
    service.setCodPersonal('');
    expect(service.isCodificado()).toBeFalse();
    service.setCodPersonal('P001');
    expect(service.isCodificado()).toBeTrue();
  });

  it('logOut cierra los diálogos y limpia la sesión', () => {
    spyOn(console, 'clear');   // evita que se borre la consola de Karma
    service.setToken('abc123');

    service.logOut();

    expect(dialogSpy.closeAll).toHaveBeenCalled();
    expect(service.getToken()).toBeNull();
  });
});
