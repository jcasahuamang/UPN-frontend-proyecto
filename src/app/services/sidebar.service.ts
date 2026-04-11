import { Injectable } from '@angular/core';
@Injectable({
  providedIn: 'root'
})
export class SidebarService {
  menuBuscado: any[];

  menuAdministrador: any[] = [{
    titulo: 'Inicio',
    url:'',
    icono:'fas fa-tachometer-alt',
    expanded: false,
    submenu: [
//      {titulo:'Datos Generales',url:'info',icono:"fas fa-user-circle nav-icon ml-3",submenu:[],},
//      {titulo:'Datos Generales',url:'info',icono:"fas fa-id-card nav-icon ml-3",submenu:[],},
      {titulo:'Datos Generales',url:'info',icono:"fas fa-id-card nav-icon ml-3",submenu:[],},
      {titulo:'Reglamentos y politicas',url:'reglamento',icono:"fas fa-book nav-icon ml-3",submenu:[],},      
    ],
   },
   {
    titulo: 'Documentos',
    icono:'fas fa-file-word',
    expanded: false,
    submenu:[
      {titulo:'Boleta de pago',url:'boletapago',icono:"fas fa-folder nav-icon ml-3",submenu:[],},
//      {titulo:'Boleta de CTS',url:'boletacts',icono:"fab fa-product-hunt nav-icon ml-3",submenu:[],},
      {titulo:'Boleta de CTS',url:'boletacts',icono:"fas fa-file-alt nav-icon ml-3",submenu:[],},
      {titulo:'Certificado de quinta',url:'certificadoquinta',icono:"fas fa-certificate nav-icon ml-3",submenu:[],}

    ]
   },
      {
    titulo: 'Solicitudes',
    icono:'fas fa-file-word',
    expanded: false,
    submenu:[
      {titulo:'Vacaciones',url:'vacacion',icono:"fas fa-folder nav-icon ml-3",submenu:[],},
      {titulo:'Prestamos',url:'prestamo',icono:"fas fa-file-alt nav-icon ml-3",submenu:[],},
      {titulo:'Permisos',url:'permiso',icono:"fas fa-certificate nav-icon ml-3",submenu:[],}

    ]
   },
   {
    titulo: 'Aprobaciones',
    icono:'fas fa-file-word',
    expanded: false,
    submenu:[
      {titulo:'Vacaciones',url:'aprobacionvac',icono:"fas fa-folder nav-icon ml-3",submenu:[],},
      {titulo:'Prestamos',url:'aprobacionprest',icono:"fas fa-file-alt nav-icon ml-3",submenu:[],},
      {titulo:'Permisos',url:'aprobacionperm',icono:"fas fa-certificate nav-icon ml-3",submenu:[],}

    ]
   },   
   {
    titulo: 'Seguridad',
    icono:'fas fa-shield-alt',
    expanded: false,
    submenu:[
//      {titulo:'Anuncios',url:'anuncio',icono:"fas fa-comment nav-icon ml-3",submenu:[],},
      {titulo:'Anuncios',url:'anuncio',icono:"fas fa-bullhorn nav-icon ml-3",submenu:[],},
      {titulo:'Empresas',url:'empresa',icono:"fas fa-building nav-icon ml-3",submenu:[],},
      {titulo:'Configurar Visualización',url:'visualizacion',icono:"far fa-eye nav-icon ml-3",submenu:[],},
      {titulo:'Auditoria',url:'auditoria',icono:"fas fa-user-check nav-icon ml-3",submenu:[],},
      {titulo:'Usuarios',url:'auditoria',icono:"fas fa-user-check nav-icon ml-3",submenu:[],}      
    ]
   }

  ];

  menuTrabajador: any[] = [{
    titulo: 'Inicio',
    url:'',
    icono:'fas fa-tachometer-alt',
    submenu: [
      {titulo:'Datos Generales',url:'info',icono:"fas fa-id-card nav-icon ml-3",submenu:[],},      
      {titulo:'Reglamentos y politicas',url:'reglamento',icono:"fas fa-book nav-icon ml-3",submenu:[],},            
    ],
   },
   {
    titulo: 'Documentos',
    icono:'fas fa-file-word',
    expanded: false,
    submenu:[
      {titulo:'Boleta de pago',url:'boletapago',icono:"fas fa-folder nav-icon ml-3",submenu:[],},
//      {titulo:'Boleta de CTS',url:'boletacts',icono:"fab fa-product-hunt nav-icon ml-3",submenu:[],},
      {titulo:'Boleta de CTS',url:'boletacts',icono:"fas fa-file-alt nav-icon ml-3",submenu:[],},
      {titulo:'Certificado de quinta',url:'certificadoquinta',icono:"fas fa-certificate nav-icon ml-3",submenu:[],}

    ]
   },
   {
    titulo: 'Solicitudes',
    icono:'fas fa-file-word',
    expanded: false,
    submenu:[
      {titulo:'Vacaciones',url:'vacacion',icono:"fas fa-folder nav-icon ml-3",submenu:[],},
      {titulo:'Prestamos',url:'prestamo',icono:"fas fa-file-alt nav-icon ml-3",submenu:[],},
      {titulo:'Permisos',url:'permiso',icono:"fas fa-certificate nav-icon ml-3",submenu:[],}

    ]
   },   
  ];


  constructor() { }

  setMenu(tipMenu: String) {
    if (tipMenu == "1") { //administrador
      return this.menuAdministrador;
    } else {
      if (tipMenu == "3") { //Trabajador
        return this.menuTrabajador;
      } else {
        return this.menuTrabajador;
      }

    }
  }

  
  isPermit(useName: string,admLevel: string,urlBuscada:string): boolean{
     
    if (admLevel == "1") { //administrador
      this.menuBuscado = this.menuAdministrador;
    } else {
      if (admLevel == "3") { //Trabajador
       this.menuBuscado = this.menuTrabajador;       
      } else {
        this.menuBuscado = this.menuTrabajador;  
      }

    }

     // Iterar sobre cada item en el menú
  for (let seccion of this.menuBuscado) {
    // Verificar si el submenu existe para esta sección
    if (seccion.submenu && seccion.submenu.length > 0) {
      // Buscar en los submenús si alguno tiene la URL que estamos buscando
      for (let sub of seccion.submenu) {
        if (sub.url === urlBuscada) {
          return true; // Si encontramos la URL, devolvemos true
        }
      }
    }
  }
  return false; // Si no se encuentra la URL en ningún submenu, devolvemos false

   
  }    
}
