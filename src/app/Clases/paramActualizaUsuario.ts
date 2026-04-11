
export class ParamActualizaUsuario{
    usuario: string;
    claveant: string;
    clavenuevo: string;

    constructor(usuario: string,claveant: string,clavenuevo: string){
        this.usuario = usuario;
        this.claveant = claveant;
        this.clavenuevo = clavenuevo;

    }
}