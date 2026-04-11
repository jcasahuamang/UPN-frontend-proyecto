export class JwtDTO {
    token: string;
    type: string;

    nombreUsuario: string;
    nombreCompleto: string;

    admLevel: string;
    codEmpresa: string;
    codPersonal: string;
    authorities: string[];
  }