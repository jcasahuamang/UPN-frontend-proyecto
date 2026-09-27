//ng build --output-path=dist/kiosko --base-href="/kiosko/"
export class Configuracion{

    public endPoints: Map<string, string> = new Map(
     [
     ["RootDesarrollo", "http://localhost:8060"],
     ["Root", "http://localhost:9090/service-kiosko-general"],
//     ["Root", "/service-kiosko-general"],
     ["RootProduccion", "http://localhost:9090/service-kiosko-general"],
     ["Auth", "auth"],
     ["Compania", "compania"],
     ["Usuario", "usuario"],
     ["Personal", "personal"],
     ["PersonalDoc", "personaldoc"],
     ["Configuracion", "configuracion"],
     ["Shared", "shared"],
     ["Sistema", "sistema"],
     ["Tabla", "tabla"],
     ["TablaDet", "tabladet"],
     ["Archivos", "archivos"],
     ["Anuncio", "anuncio"],
     ["Reglamento", "reglamento"],
     ["Vacaciones", "vacacion"], 
     ["Permisos", "permiso"], 
     ["Prestamos", "prestamo"],      
     ["Aprobaciones", "aprobacion"],           
     ["Email", "email"]     
     ]
    );
 
 
    meses: any[] = [
        {codigo: '01',descripcion:'Enero'},
        {codigo: '02',descripcion:'Febrero'},
        {codigo: '03',descripcion:'Marzo'},
        {codigo: '04',descripcion:'Abril'},
        {codigo: '05',descripcion:'Mayo'},
        {codigo: '06',descripcion:'Junio'},
        {codigo: '07',descripcion:'Julio'},
        {codigo: '08',descripcion:'Agosto'},
        {codigo: '09',descripcion:'Setiembre'},
        {codigo: '10',descripcion:'Octubre'},
        {codigo: '11',descripcion:'Noviembre'},
        {codigo: '12',descripcion:'Diciembre'}, 
      ];

      mesesCts: any[] = [
        {codigo: '05',descripcion:'Mayo'},
        {codigo: '11',descripcion:'Noviembre'},
    ];

      documentosTrabajador: any[] = [
        {codigo: 'BOL',descripcion:'Boleta de Pago'},
        {codigo: 'CTS',descripcion:'Boleta de CTS'},
        {codigo: '5TA',descripcion:'Certificado de Quinta'},
      ];

      anuncioEstado: any[] = [
        {codigo: 0,descripcion:'Deshabilitado'},
        {codigo: 1,descripcion:'Habilitado'},
      ];

      vacacionEstado: any[] = [
        {codigo: 'SO',descripcion:'Solicitado'},
        {codigo: 'AP',descripcion:'Aprobado'},
        {codigo: 'RE',descripcion:'Rechazado'},
        {codigo: 'AN',descripcion:'Anulado'},
        {codigo: 'TR',descripcion:'Transferido'},                        
      ];

/*
      anuncioAlcance: any[] = [
        {codigo: 0,descripcion:'Interno'},
        {codigo: 1,descripcion:'Externo'},
      ];
      */

      anuncioAlcance: any[] = [
        {codigo: 0,descripcion:'Obligatorio'},
        {codigo: 1,descripcion:'No Obligatorio'},
      ];
 }