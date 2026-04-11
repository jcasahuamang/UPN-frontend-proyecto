import {  Component, OnInit} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {  finalize } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';
import { LoginUsuario } from 'src/app/Clases/login-usuario';
import { TokenService } from 'src/app/services/TokenService';
import { EmpresaService } from 'src/app/services/empresa.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public loginForm: FormGroup;
  public codigoempresa: string ='';
  isLogged = false;
  isLoginFail = false;
  loginUsuario: LoginUsuario;

  roles: string[] = [];
  errMsj: string;

  isPasswordVisible: boolean = false;

  constructor( private tokenService: TokenService,
    private authService: AuthService,
    private router: Router,
    private fb: FormBuilder) { 
    }

  ngOnInit(): void {
    this.inicializarForm();
    if (this.tokenService.isAuthenticated()){
      this.isLogged = true;
      this.isLoginFail = false;
      this.roles = this.tokenService.getAuthorities();
    }
  }

  togglePasswordVisibility(): void {
    this.isPasswordVisible = !this.isPasswordVisible;
  }

  inicializarForm(): void{
    this.loginForm = this.fb.group({
      usuario: ['', Validators.compose([Validators.required,Validators.maxLength(50)])],
      password: ['', Validators.required],
     })
  }


  onLogin() {
    if (!this.loginForm.valid) {
      return;
    }
    
    this.loginUsuario = new LoginUsuario(this.loginForm.get('usuario')!.value,this.loginForm.get('password')!.value);

    this.authService.login(this.loginUsuario)
    .pipe(finalize(
      ()=>{
        this.isLogged = true;
        this.isLoginFail = false;

      }
    ))
    .subscribe(
      (data) => {

        if ( data.admLevel === null || ( data.admLevel != "1" && data.admLevel != "3") ) {
          Swal.fire('Aviso', 'No tiene configurado el acceso', 'warning');
          return;
        }

        if (data.admLevel != "1") // 1 = Administrador   3 = trabajador 
          {        
              if ( data.codEmpresa === null || data.codEmpresa.length == 0 ) {
                Swal.fire('Aviso', 'No tiene asociado su código de personal', 'warning');
                return;
              }

              if ( data.codPersonal === null || data.codPersonal.length == 0 ) {
                Swal.fire('Aviso', 'No tiene asociado un código de personal', 'warning');
                return;
              }
        }

        this.tokenService.setToken(data.token);
        this.tokenService.setUserName(data.nombreUsuario);
        this.tokenService.setAuthorities(data.authorities);
        this.tokenService.setAdmlevel(data.admLevel);
        this.tokenService.setCodEmpresa(data.codEmpresa);
        this.tokenService.setCodPersonal(data.codPersonal);
        this.tokenService.setUserFullName(data.nombreCompleto);
        this.roles = data.authorities;
        this.codigoempresa = data.codEmpresa;
        this.codigoempresa = data.codEmpresa ? data.codEmpresa : '';

        this.authService.getDatosEmpresa(data.codEmpresa ? data.codEmpresa : '01')
        .pipe(finalize(()=>{
          this.router.navigate(['inicio']);
        }))
        .subscribe(
          (val)=>{
            if (val){
              this.tokenService.setDesEmpresa(val.desrazonsocial);    
            }else{
              this.tokenService.setDesEmpresa('');    
            }
          }
        );
      },
      err =>{
        this.isLogged = false;
        this.isLoginFail = true;
        this.errMsj = err.error.mensaje;
        console.log(this.errMsj);
        Swal.fire('Error Login', 'Usuario o clave incorrectas!', 'error');
        console.clear()
      }

    );


  }



}

  /*
    setTimeout(() => {
      this.router.navigate(['dashboard']);
    }, 18000);
  */
  /*
   this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
     this.router.navigate(['dashboard']);
   });
   */