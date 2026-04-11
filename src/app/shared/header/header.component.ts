import { DatePipe } from '@angular/common';
import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { error } from 'jquery';
import { finalize } from 'rxjs';
import { Modulos } from 'src/app/Clases/modulos';
import { NewPass } from 'src/app/Clases/newpass';
import { AnuncioService } from 'src/app/services/anuncio.service';
import { ArchivosService } from 'src/app/services/archivos.service';
import { AuthService } from 'src/app/services/auth.service';
import { TokenService } from 'src/app/services/TokenService';
import { MatDialog } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { ModalanuncioComponent } from 'src/app/Componentes/modalanuncio/modalanuncio.component';
import { ParamActualizaUsuario } from 'src/app/Clases/paramActualizaUsuario';
import { ConfiguracionService } from 'src/app/services/configuracion.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  modolus: Modulos[];
  modulo: Modulos;
  idperfil: string = '0';
  public usuario: string = '';
  public cambia: string = '';
  public showerror: boolean = false
  public submitted: boolean = false;
  public showPassword1: boolean = false;
  public showPassword2: boolean = false;
  public showPassword3: boolean = false;
  public formPassword: FormGroup;
  public selectedTabIndex: number = 0;
  public codEmpresa: string = '';
  public nomEmpresa: string = "";
  public numeroAnuncios: number = 0;
  paramActualizaUsuario: ParamActualizaUsuario;

  @ViewChild('closebutton') modal: ElementRef;
  @ViewChild('openbutton') modal2: ElementRef;

  public imageUrl: SafeUrl;
  public imagenLogo: any;
  constructor(private router: Router, private authService: AuthService, private fb: FormBuilder,
    private tokenService: TokenService,
    private archivosService: ArchivosService,
    private sanitizer: DomSanitizer,
    private datePipe: DatePipe,
    private anuncioService: AnuncioService,
    private dialog: MatDialog,
    private configuracionService: ConfiguracionService
  ) { }

  ngOnInit(): void {
    this.usuario = this.tokenService.getUserName();
    this.cambia = sessionStorage.getItem('cambiapwd')!;
    this.onBuildFormPassword();
    //this.onPerfil();
    this.codEmpresa = this.tokenService.getCodEmpresa();
    this.nomEmpresa = this.tokenService.getDesEmpresa();

    this.onObtenerImagen("LOGO",this.codEmpresa);
    this.onObtenerAnunciosActivos();
  }

  ngOnDestroy(): void {
    // Liberar la URL cuando el componente se destruya
    if (this.imageUrl) {
      URL.revokeObjectURL(this.imageUrl.toString());
    }
  }
  logout() {
    this.tokenService.logOut();
    Swal.fire('Aviso','La sesion se cerro correctamente!','success');
    this.router.navigate(['login']);

  }

      onObtenerAnunciosActivos(){
//        this.numeroAnuncios = 0;
        let usuario = this.tokenService.getUserName()??'';
        let empresa = this.tokenService.getCodEmpresa().length>0?this.tokenService.getCodEmpresa():'00';
//      let alcance: number = 0;   // 0  = interno    1 = externo
        let alcance: number = 1;   // 0  = Obligatorio    1 = No Obligatorio
  
        const hoy = new Date();
        const fechaActual = this.datePipe.transform(hoy,'yyyyMMdd')?.toString()!;
    
        this.anuncioService.getAnuncioAlerta(usuario,empresa,alcance,fechaActual)
        .subscribe(
          (result)=>{
            if (result.length>0){
              this.numeroAnuncios = result.length;
            }else{
              this.numeroAnuncios = 0;
            }
          }  
        )
    
  
      }


      onAnuncio(){
        let usuario = this.tokenService.getUserName()??'';
        let empresa = this.tokenService.getCodEmpresa().length>0?this.tokenService.getCodEmpresa():'00';
//        let alcance: number = 0;   // 0  = interno    1 = externo
        let alcance: number = 1;   // 0  = Obligatorio    1 = No Obligatorio

        const hoy = new Date();
        const fechaActual = this.datePipe.transform(hoy,'yyyyMMdd')?.toString()!;
    
        this.anuncioService.getAnuncioAlerta(usuario,empresa,alcance,fechaActual)
        .subscribe(
          (result)=>{
            if (result.length>0){

                      const dialogConfig = {
                        width: '90%',  // Use percentage for responsive width
                        maxWidth: '1000px',
                        height: '100vh', // Let height adjust to content
                        maxHeight: '580px', // Use viewport height for responsive max height
                        panelClass: ['responsive-dialog', 'custom-modal'],
             //           disableClose: true,  // Prevenir el cierre al hacer clic fuera o presionar ESC                        
                        autoFocus: false,
                        data: {
                          alcance: alcance
                        }
                      };
                      const dialogRef = this.dialog.open(ModalanuncioComponent, dialogConfig);
                           
                    //To detect when anuncioCerrado event is emmited                  
                      dialogRef.componentInstance.anuncioCerrado.subscribe(
                        () => {
                         this.onObtenerAnunciosActivos();
                         
                        }
                      )
                    //To detect if user clicks the area outside
                      dialogRef.backdropClick().subscribe(()=>{
                        this.onObtenerAnunciosActivos();
                      })
            }else{
              this.onObtenerAnunciosActivos();
            }
          }  
        )
    
  
      }

      onObtenerImagen(tipoArchivo: string,empresa: string){
    this.imageUrl ="assets/img/AQUARIUS.png"; //Por defecto

    if (empresa != null  && empresa.length>0){
      this.archivosService.getDescargaArchivo(tipoArchivo,empresa)
      .subscribe((response: Blob)=>{
        const objectURL = URL.createObjectURL(response);

        this.imageUrl = this.sanitizer.bypassSecurityTrustUrl(objectURL);

      /*
        this.imageUrl = window.URL.createObjectURL(response); 
        this.imagenLogo = new Blob([response], { type: 'octet/stream' });
      */
        /*
          const a = document.createElement('a');
          document.body.appendChild(a);
          //const blob: any = new Blob([result], { type: 'octet/stream' });
          const url = window.URL.createObjectURL(response);
          a.href = url;
          a.download = "logo1.jpg";
          a.click();
          window.URL.revokeObjectURL(url);
        */
      },error=>{
        console.log(error);
      }
    );
    }


  }
  onPerfil() {
    /*
    this.authService.getUsuarioPerfil(this.usuario, sessionStorage.getItem('codempresa')!)
      .pipe(finalize(() => this.onModulos(this.idperfil)))
      .subscribe(
        (obj) => {
          obj.forEach(e => {
            this.idperfil = e.perfil || '0';
          });
        }
      );
      */
  };

  onModulos(perfil: string) {
    this.modolus = [];
    /*this.authService.getModulosPorUsuario(perfil)
      .pipe(finalize(() => this.onCambiaAuto()))
      .subscribe(
        (obj) => {
          obj.forEach(e => {
            this.modulo = new Modulos();
            this.modulo.nomsistema = e.nomsistema;
            this.modulo.dessistema = e.dessistema;
            this.modulo.urlimagen = e.urlimagen;
            this.modulo.urlsistema = e.urlsistema;
            this.modolus.push(this.modulo);
          });
        });
        */
  }

  onCambiaAuto() {
    if (this.cambia == '1') {
      this.modal2.nativeElement.click();
    }
  }

  onSistema(strdes: string) {
    /*
    let strurl: string = '';

    if (strdes == 'SEGURIDAD') {
      strurl = 'https://10.152.0.17:8443/siaweb/#/Seguridad';
    } else if (strdes == 'VACATION C') {
      strurl = 'http://10.152.0.20/Vacationc?Usuario=' + this.usuario + '&Token=' + sessionStorage.getItem('token');
    } else if (strdes == 'MARCACION GPS') {

      if (this.verificarDevice() == true) {
        strurl = 'https://10.152.0.17:8443/assistimeweb/login?user=' + this.usuario + '&token=' + sessionStorage.getItem('token');
      } else {
        this.toastRejectAlert("Dispositivo no compatible");
        return;
      }
    } else if (strdes == 'ASSISTIME WEB') {
      strurl = 'https://10.152.0.17:8443/assistime/#/auth' + '/user/' + this.usuario + '/token/' + sessionStorage.getItem('token');
    } else {
      strurl = '';
    }
    window.location.href = strurl;
      */
  }

  verificarDevice() {
    if (
      navigator.userAgent.match(/Android/i) ||
      navigator.userAgent.match(/webOS/i) ||
      navigator.userAgent.match(/iPhone/i) ||
      navigator.userAgent.match(/iPad/i) ||
      navigator.userAgent.match(/iPod/i) ||
      navigator.userAgent.match(/BlackBerry/i) ||
      navigator.userAgent.match(/Windows Phone/i)
    ) {
      return true;
    } else {
      return false;
    }
  }

  toastRejectAlert(mensaje: string) {
    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 1000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
      }
    })
    Toast.fire({
      icon: 'warning',
      title: mensaje
    })
  }

  public togglePasswordVisibility1(): void {
    this.showPassword1 = !this.showPassword1;
  }
  public togglePasswordVisibility2(): void {
    this.showPassword2 = !this.showPassword2;
  }
  public togglePasswordVisibility3(): void {
    this.showPassword3 = !this.showPassword3;
  }
  CambiarPassword() {
    this.formPassword.reset();
    this.showerror = false
  }

  onBuildFormPassword() {
    this.formPassword = this.fb.group({
      usuario: ['', Validators.required],
      passActual: ['', Validators.required],
      passNueva: ['', Validators.required],
      passNueva2: ['', Validators.required],
    });
  }

  private closeModal(): void {
    this.modal.nativeElement.click();
    this.selectedTabIndex = 0;
  }

  onSubmitPassword() {
    this.submitted = true;
    this.formPassword.patchValue({
      usuario: this.usuario
    });
    if (this.formPassword.invalid) {
      //console.log(this.formPassword.value)
      return;
    }    
    if (this.validationPassword()) {
      return;
    }

        this.paramActualizaUsuario = new ParamActualizaUsuario(
          this.usuario,this.formPassword.controls['passActual'].value,
          this.formPassword.controls['passNueva'].value
        );

              this.configuracionService.actualizaUsuario(this.paramActualizaUsuario)
              .pipe(finalize(()=>{
              }))
              .subscribe(
                (result)=>{
                  if (result.valueOf() === 1){
                    this.alerta("Aviso","Se actualizo la contraseña");
                    this.formPassword.reset();
                    this.closeModal();
    
                  }
                  else{
                    if (result.valueOf() === 2){
                      this.alerta("Aviso","La contraseña actual no coincide con el que esta registrado");
                      return;
                    }
                    if (result.valueOf() === 3){
                      this.alerta("Aviso","La contraseña nueva ingresada no es correcta");
                      return;
                    }
                    if (result.valueOf() === 4){
                      this.alerta("Aviso","El usuario no existe");
                      return;
                    }
                    if (result.valueOf() > 4){
                      this.alerta("Aviso","No se pudo actualizar la contraseña");
                      return;
                    }
                  }

                }, error => {
                  console.log(error);
                }
              );

    /*
    this.authService.actualizarPassword(objres);
    Swal.fire("AVISO", "Se grabo correctamente", "success");
    this.closeModal();
    */
  }

  validationPassword() {
    if (this.formPassword.controls['passNueva'].value != this.formPassword.controls['passNueva2'].value) {
      this.toastRejectAlert("Las contraseñas no coinciden");
      this.showerror = true
      return true
    } else {
      this.showerror = false
      return false
    }
  }

      alerta(titulo: string,mensaje:string){
        Swal.fire({
          title: titulo,
          text: mensaje,
          icon: 'warning',
          width: '350px',  // Establecer el ancho del popup
          padding: '10px', // Ajustar el padding para que el contenido quede bien dentro
          backdrop: true,  // Mantener el fondo de la ventana oscurecido
          confirmButtonText: 'Aceptar', // Botón de confirmación
        });      
    
      }

}