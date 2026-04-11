
export class ParamRegistraVisualiza {

    codempresa: string;
    ano: string;
    mes: string;
    codpersonal: string;
    codusuario: string;
    numdocidentidad: string;
    tipdocumento: string;
  
    constructor(codempresa: string,ano: string,mes: string,codpersonal: string,
        codusuario: string,numdocidentidad: string,tipdocumento: string){
            this.codempresa = codempresa;
            this.ano = ano;
            this.mes = mes;
            this.codpersonal = codpersonal;
            this.codusuario = codusuario;
            this.numdocidentidad = numdocidentidad;
            this.tipdocumento = tipdocumento;
    }
  } 