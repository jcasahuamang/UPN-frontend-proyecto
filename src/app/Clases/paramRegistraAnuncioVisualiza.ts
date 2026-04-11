export class paramRegistraAnuncioVisualiza{
    idanuncio: number;
    usuario: string;
    empresa: string;

    constructor(idanuncio: number,usuario: string,empresa: string){
        this.idanuncio = idanuncio;
        this.usuario = usuario;
        this.empresa = empresa
        }
}