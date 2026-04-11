export class ParamAprobacion{
    
    llave: string;
    tipoaprobacion: string;
    accion: string;
    usuario: string;
    
  
    constructor(llave: string,tipoaprobacion: string,accion: string,usuario: string){
            this.llave = llave;
            this.tipoaprobacion = tipoaprobacion;
            this.accion = accion;
            this.usuario = usuario;  
    }
}