import { TokenService } from './../../services/TokenService';
import { DomSanitizer } from '@angular/platform-browser';
import { Component, ElementRef, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AnuncioService } from 'src/app/services/anuncio.service';
import { finalize } from 'rxjs';

//https://stackblitz.com/edit/ngx-summernote?file=src%2Fapp%2Fapp.component.html

@Component({
  selector: 'app-registroanuncio',
  templateUrl: './registroanuncio.component.html',
  styleUrls: ['./registroanuncio.component.css']
})
export class RegistroanuncioComponent implements OnInit {

  public editorDisabled = false;
  public idAnuncio:string;
  public formAnuncio: FormGroup;
  public isProcessing: boolean = false;
  public submitted: boolean = false;
  public accionNuevo: Boolean = true;
  // `  backtick
  

  public config: any = {
    airMode: false,
    tabDisable: true,
    lang: 'es-ES', // Set the language to Spanish (or any other language)
    popover: {
      table: [
        ['add', ['addRowDown', 'addRowUp', 'addColLeft', 'addColRight']],
        ['delete', ['deleteRow', 'deleteCol', 'deleteTable']]
      ],
      image: [
        ['image', ['resizeFull', 'resizeHalf', 'resizeQuarter', 'resizeNone']],
        ['float', ['floatLeft', 'floatRight', 'floatNone']],
        ['remove', ['removeMedia']]
      ],
      link: [['link', ['linkDialogShow', 'unlink']]],
      air: [
        [
          'font',
          [
            'bold',
            'italic',
            'underline',
            'strikethrough',
            'superscript',
            'subscript',
            'clear'
          ]
        ]
      ]
    },
    height: '400px',
    uploadImagePath: '/api/upload',
    toolbar: [
//      ['misc', ['codeview', 'undo', 'redo', 'codeBlock']],
      ['misc', ['codeview', 'undo', 'redo']],
      [
        'font',
        [
          'bold',
          'italic',
          'underline',
          'strikethrough',
          'superscript',
          'subscript',
          'clear'
        ]
      ],
      ['fontsize', ['fontname', 'fontsize', 'color']],
      ['para', ['style0', 'ul', 'ol', 'paragraph', 'height']],
      ['insert', ['table', 'picture', 'link', 'video', 'hr']],
      ['customButtons', ['testBtn']],
//      ['view', ['fullscreen', 'codeview', 'help']]
    ],
    fontSizes: ['8','9','10','11','12','14','18','24','36','44','56','64','76','84','96'],
    fontNames: ['Arial', 'Times New Roman','Inter', 'Comic Sans MS', 'Courier New', 'Roboto', 'Times', 'MangCau', 'BayBuomHep','BaiSau','BaiHoc','CoDien','BucThu', 'KeChuyen', 'MayChu', 'ThoiDai', 'ThuPhap-Ivy', 'ThuPhap-ThienAn'],
    buttons: {
    },
    codeviewFilter: true,
    codeviewFilterRegex: /<\/*(?:applet|b(?:ase|gsound|link)|embed|frame(?:set)?|ilayer|l(?:ayer|ink)|meta|object|s(?:cript|tyle)|t(?:itle|extarea)|xml|.*onmouseover)[^>]*?>/gi,
    codeviewIframeFilter: true
  };

  get sanitizedHtml() {
    return this.sanitizer.bypassSecurityTrustHtml(this.formAnuncio.get('contenido')!.value);
  }

  get f() {
    return this.formAnuncio.controls;
  }

  constructor(private sanitizer: DomSanitizer,
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private anuncioService: AnuncioService,
    private tokenService:TokenService,
    private router:Router
  ) {}

  ngOnInit() {
    this.idAnuncio = this.activatedRoute.snapshot.params['id'];
    this.inicializarFormAnuncio();

  }
/*
  public enableEditor() { this.editorDisabled = false;}
  public disableEditor() { this.editorDisabled = true;}
  */

  inicializarFormAnuncio(): void{
    
    this.formAnuncio = this.fb.group({
      id:[],
      titulo: ['', Validators.compose([Validators.required,Validators.maxLength(250)])],
      descripcion: ['', Validators.compose([Validators.required,Validators.maxLength(250)])],
      estado: [0, Validators.compose([Validators.required])],
      alcance: [0, Validators.compose([Validators.required])],
      feciniciovigencia: [new Date(new Date().setHours(0, 0, 0, 0))],
      fecfinvigencia: [new Date(new Date().setHours(0, 0, 0, 0))],
      contenido: [`<p style="text-align: center; "><span style="font-family: Arial;"><b>
            <font color="#085294">ANUNCIO 001° - 04/2026</font>
        </b></span></p>
<p><span style="font-family: Arial;">Este es el primer párrafo del anuncio, y se puede incluir todo el detalle que se necesite comunicar al trabajador:</span></p>
<ul>
    <li><span style="font-family: Arial;">Item 1</span></li>
    <li><span style="font-family: Arial;">Item 2</span></li>
    <li><span style="font-family: Arial;">Item 3</span></li>
</ul>
<p>
    <font face="Arial">Segundo parrafo.</font>
</p>
<p></p>
<div id=":19q" class="hq gt"
    style="font-size: 0.875rem; margin: 15px 0px; clear: both; color: rgb(34, 34, 34); font-family: &quot;Google Sans&quot;, Roboto, RobotoDraft, Helvetica, Arial, sans-serif; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: start; text-indent: 0px; text-transform: none; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; white-space: normal; background-color: rgb(255, 255, 255); text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial;">
</div>
<p></p>
<div id=":19c" class="ii gt"
    jslog="20277; u014N:xr6bB; 1:WyIjdGhyZWFkLWY6MTgyNTA2ODUzOTUzNjU1ODcxMHxtc2ctZjoxODI1MDY4NTM5NTM2NTU4NzEwIl0.; 4:WyIjbXNnLWY6MTgyNTA2ODUzOTUzNjU1ODcxMCIsbnVsbCxudWxsLG51bGwsMSwwLFsxLDAsMF0sNzMsODk1LG51bGwsbnVsbCxudWxsLG51bGwsbnVsbCwxLG51bGwsbnVsbCxbMF0sbnVsbCxudWxsLG51bGwsbnVsbCxudWxsLG51bGwsMF0."
    style="direction: ltr; margin: 8px 0px 0px; padding: 0px; position: relative; font-size: 0.875rem; overflow-x: hidden; color: rgb(34, 34, 34); font-family: &quot;Google Sans&quot;, Roboto, RobotoDraft, Helvetica, Arial, sans-serif; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: start; text-indent: 0px; text-transform: none; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; white-space: normal; background-color: rgb(255, 255, 255); text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial;">
    <div id=":19b" class="a3s aiL "
        style="direction: ltr; font: small / 1.5 Arial, Helvetica, sans-serif; overflow: auto hidden; position: relative;">
        <div>
            <div><span style="font-family: Arial; font-size: 14px;">Atentamente</span><span
                    style="font-family: Arial; font-size: 14px;">.</span></div>
        </div>
        <div class="yj6qo"></div>
        <div class="adL"></div>
    </div>
</div>`, Validators.compose([Validators.required])],
      empresa: [''],
      usucreacion: [this.tokenService.getUserName()],
      feccreacion: [new Date()],
     })


    if (this.idAnuncio!="0"){
      this.accionNuevo = false; 
    }

    if (this.accionNuevo == false){
      this.anuncioService.getDatos(this.idAnuncio)
      .subscribe(
        (result) =>{

          this.formAnuncio.patchValue({
            id: result.id,
            titulo:result.titulo,
            descripcion:result.descripcion,
            estado: result.estado,
            alcance: result.alcance,
            feciniciovigencia: result.feciniciovigencia,
            fecfinvigencia: result.fecfinvigencia,
            contenido:result.contenido,
            empresa: result.empresa,
            usucreacion: result.usucreacion,
            feccreacion: result.feccreacion,
          });
        }
      )

    }


  }

  onResetFormAnuncio() {
    this.submitted = false;
    this.accionNuevo = true;
    this.isProcessing = false;
    this.formAnuncio.reset();
    }


  onGuardar() {
    this.submitted = true;
    if (this.formAnuncio.invalid) {
      return;
    }
    Swal.fire({
      title: 'Advertencia',
      text: `¿Esta seguro que desea guardar el anuncio?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#17a2b8',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, Guardar!',
      cancelButtonText: 'No, cancelar'
    }).then((result) => {
      if (result.value) {
        this.isProcessing = true;
        if (this.accionNuevo){
            

          //usu_creacion: [this.tokenService.getUserName()],
          //fec_creacion: [new Date()],

          
              this.anuncioService.create(this.formAnuncio.value)
              .pipe(finalize(()=>{
                this.isProcessing = false;
                this.router.navigate(['/inicio/anuncio']);
              }))
              .subscribe(
                (result) => {
                  if (result) {
                    this.onResetFormAnuncio();
//                    this.onListCompanias();
 //                   this.changeDetectorRefs.detectChanges();
                    this.toastAcceptedAlert("Se registro con exito");
//                    this.closeModalCompania();
                  } else {
//                    this.closeModalCompania();
                  }
                }, error => {
                  console.log(error);
                }
              );
              
        }else{
            
            this.anuncioService.update(this.formAnuncio.value)
            .pipe(finalize(()=>{
              this.isProcessing = false;
              this.router.navigate(['/inicio/anuncio']);
            }))
            .subscribe(
              (result) => {
                if (result) {
                  this.onResetFormAnuncio();
//                  this.onListCompanias();
//                  this.changeDetectorRefs.detectChanges();
                  this.toastAcceptedAlert("Se registro con exito");
//                  this.closeModalCompania();
                } else {
  //                this.closeModalCompania();
                }
              }, error => {
                console.log(error);
              }
            );
        }

      }
    })
  }

  onRetornar(){
    this.router.navigate(['/inicio/anuncio']);
  }
  public onBlur() {
    console.log('Blur');
  }

  public onDelete(file: any) {
    console.log('Delete file', file.url);
  }

  public summernoteInit(event: any) {
    console.log(event);
  }

  toastAcceptedAlert(mensaje: string) {
    const Toast = Swal.mixin({
      toast: true,
      position: 'bottom-end',
      showConfirmButton: false,
      timer: 1000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
      }
    })
    Toast.fire({
      icon: 'success',
      title: mensaje
    })
  }

}


/*
    // Obtener el contenido HTML generado
    getEditorContent() {
      //      const content = this.editorContent;
       //     console.log(content); // Aquí tendrás el código HTML generado
      
            const blob = new Blob([this.editorContent], { type: 'text/html' });
      
            // Crear un enlace de descarga
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = 'contenido-editor.html'; // Nombre del archivo
            link.click(); // Simula el clic para iniciar la descarga
            
          }

          */