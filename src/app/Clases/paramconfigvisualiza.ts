
export class ParamConfiguraVisualiza {

    codempresa: string;
    ano: string;
    mes: string;
    codtipoplanilla: string;
    tipdocumento: string;
    accion: string;

    
  
    constructor(codempresa: string,ano: string,mes: string,codtipoplanilla: string,
        tipdocumento: string,accion: string){
            this.codempresa = codempresa;
            this.ano = ano;
            this.mes = mes;
            this.codtipoplanilla = codtipoplanilla;
            this.tipdocumento = tipdocumento;
            this.accion = accion;
  
    }
  } 