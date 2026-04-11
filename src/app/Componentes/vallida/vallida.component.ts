import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { finalize } from 'rxjs';
import { Usuario } from 'src/app/Clases/usuario';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-vallida',
  templateUrl: './vallida.component.html',
  styleUrls: ['./vallida.component.css']
})
export class VallidaComponent implements OnInit {
  public codigoUsuario:string= "";
  public codigoToken:string="";
  public objUsuario : Usuario;
  constructor(private router:Router, private activatedRoute: ActivatedRoute, private authService: AuthService) { }

  ngOnInit(): void {
    this.codigoUsuario = this.activatedRoute.snapshot.params['usr'];
    this.codigoToken = this.activatedRoute.snapshot.params['id'];
    this.onInicio(this.codigoUsuario, this.codigoToken);
  }

  onInicio(user:string,token:string){
    console.log('Valida: onInicio 1');
    this.objUsuario = new Usuario();
    sessionStorage.setItem('usuario', user);
    sessionStorage.setItem('token', token);
    sessionStorage.setItem('showmenu', '1');
    sessionStorage.setItem('carga','0');
    this.guardarUsuario(user);
  }

  guardarUsuario(nomusr:string){
    /*
    this.authService.getUsuario(nomusr)
    .pipe(finalize( () => this.getAutoriza(this.objUsuario.codempresa!,this.objUsuario.codpersonal!)))
    .subscribe(
      (obj) => {
        this.objUsuario.nombre = obj.nombre;
        this.objUsuario.usuario = obj.usuario;
        this.objUsuario.estado = obj.estado;
        this.objUsuario.codpersonal = obj.codpersonal;
        this.objUsuario.usuariomail = obj.usuariomail;
        this.objUsuario.perfil = obj.perfil;
        this.objUsuario.codempresa = obj.codempresa;
        sessionStorage.setItem('codempresa', obj.codempresa!);
        sessionStorage.setItem('usuario', nomusr);
        sessionStorage.setItem('nombre', obj.nombre || '');
        sessionStorage.setItem('codpersonal', obj.codpersonal || '');
        if ( obj.perfil == '1008') {
          sessionStorage.setItem('menu','1');
        }
        if ( obj.perfil == '1009') {
          sessionStorage.setItem('menu','1');
        }
        if ( obj.perfil == '1010') {
          sessionStorage.setItem('menu','3');
        }
        }
      );
      */
  }

  getAutoriza(cempresa:string,cpersonal:string) {
    /*this.authService.getAutorizante(cempresa,cpersonal)
    .pipe(finalize( () => this.router.navigateByUrl('/dashboard')))
    .subscribe(
      (obj) => {
        sessionStorage.setItem('codautoriza', obj.codautoriza || '');
        sessionStorage.setItem('nomautoriza', obj.nomautoriza || '');
      }
    );
    */
  }

}
