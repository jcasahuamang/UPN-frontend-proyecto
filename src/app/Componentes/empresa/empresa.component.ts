import { TokenService } from './../../services/TokenService';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { finalize } from 'rxjs';
import { MaeEmpresas } from 'src/app/Clases/maeempresa';
import { ArchivosService } from 'src/app/services/archivos.service';
//import { MaeEmpresas } from 'src/app/Clases/maeempresa';
import { EmpresaService } from 'src/app/services/empresa.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-empresa',
  templateUrl: './empresa.component.html',
  styleUrls: ['./empresa.component.css']
})
export class EmpresaComponent implements OnInit {
//  public listaEmpresas: MaeEmpresas[];
  public filtroForm: FormGroup;
  public logoOFirma: string = "";
  public imageUrlNuevo: SafeUrl;
  public imageUrlActual: SafeUrl;

  selectedFiles?: FileList;
  currentFile?: File;
  progress = 0;
  public preguntaGuardar: string = "";
  public tamanomaxMB: number = 0.1;
    public selectedId: any | null = null;

    detalleCol: string[] = ['Opciones', 'Empresa','Num. Ruc','Dirección'];
    detalleData = new MatTableDataSource(); 
  
    @ViewChild('paginatordetalle', { static: true, read: MatPaginator }) paginatordetalle: MatPaginator;
    @ViewChild('closeLogoFirma') modalLogoFirma: ElementRef;

  constructor(private empresaService: EmpresaService,
    private fb: FormBuilder,
    private sanitizer: DomSanitizer,
    private archivosService: ArchivosService,
    private tokenService: TokenService
  ) { }

  ngOnInit(): void {
    this.inicializarForm();
    this.ListCompanias();
  }

   onRowClicked(row: any): void {
         this.selectedId = row.id;
  }
  
  ListCompanias() {
    this.empresaService.getTodos()
    .pipe(finalize(()=>{

    }))
    .subscribe(
    (result) => {
//         this.listaEmpresas = result;
         this.detalleData.data = result;
         this.detalleData.paginator = this.paginatordetalle;

        }, error => {
          console.log(error);
        }
      );  
    }


    inicializarForm(): void{
      this.filtroForm = this.fb.group({
        codempresa: [''],
        desrazonsocial: [''] ,
        rutaLogoFirmaActual: [''],
        rutaLogoFirmaNuevo: ['']         
        })
    }
  

    applyFilter(event: Event) {
      const filterValue = (event.target as HTMLInputElement).value;

      this.detalleData.filter = filterValue.trim().toLowerCase();


      if (this.detalleData.paginator) {
        this.detalleData.paginator.firstPage();
      }
    }

    onLogo(detalle: MaeEmpresas){
      this.logoOFirma = "LOGO";
      this.filtroForm.reset(); 
      this.imageUrlActual = "";     
      this.imageUrlNuevo = "";
//      this.selectedFiles= new FileList;

      this.filtroForm.get('codempresa')!.setValue(detalle.id); 
      this.filtroForm.get('desrazonsocial')!.setValue(detalle.desrazonsocial); 

      if (detalle.id != null  && detalle.id.length>0){
        this.archivosService.getDescargaArchivo('LOGO',detalle.id)
        .subscribe((response: Blob)=>
          {
          const objectURL = URL.createObjectURL(response);
          this.imageUrlActual = this.sanitizer.bypassSecurityTrustUrl(objectURL);
          this.filtroForm.get('rutaLogoFirmaActual')!.setValue(this.imageUrlActual); 

        },error=>{
          console.log(error);
        });
      } 


    }


    onFirma(detalle: MaeEmpresas){
      this.logoOFirma = "FIRMA";
      this.filtroForm.reset();
      this.imageUrlActual = "";     
      this.imageUrlNuevo = "";
  //    this.selectedFiles= new FileList;
      this.filtroForm.get('codempresa')!.setValue(detalle.id); 
      this.filtroForm.get('desrazonsocial')!.setValue(detalle.desrazonsocial); 

      if (detalle.id != null  && detalle.id.length>0){
        this.archivosService.getDescargaArchivo('FIRMA',detalle.id)
        .subscribe((response: Blob)=>
          {
          const objectURL = URL.createObjectURL(response);
          this.imageUrlActual = this.sanitizer.bypassSecurityTrustUrl(objectURL);
          this.filtroForm.get('rutaLogoFirmaActual')!.setValue(this.imageUrlActual); 

        },error=>{
          console.log(error);
        });
      } 

    }

    selectFile(event: any): void {
      this.imageUrlNuevo = '';
      this.selectedFiles = undefined;
      this.progress = 0;
      this.selectedFiles = event.target.files;
  
      if (this.selectedFiles) {
        const file: File | null = this.selectedFiles.item(0);
  
        if (file) {
          this.imageUrlNuevo = '';
          this.currentFile = file;
  
          const reader = new FileReader();
  
          reader.onload = (e: any) => {
//            console.log(e.target.result);
            this.imageUrlNuevo = e.target.result;

          };
          this.filtroForm.get('rutaLogoFirmaNuevo')!.setValue(this.imageUrlNuevo);
          reader.readAsDataURL(this.currentFile);
        }
      }
    }

    private closeModalLogoFirma(): void {
      this.modalLogoFirma.nativeElement.click();
      this.filtroForm.reset();
      this.imageUrlActual = "";     
      this.imageUrlNuevo = "";
      this.preguntaGuardar = "";
      this.selectedFiles = undefined;

    }


    onUploadFile() {

      if (this.logoOFirma == 'LOGO') { this.preguntaGuardar = "¿Desea guardar el nuevo logo seleccionado?";}
      if (this.logoOFirma == 'FIRMA') { this.preguntaGuardar = "¿Desea guardar la nueva firma seleccionada?";}

      Swal.fire({
        title: 'Advertencia',
        text: this.preguntaGuardar,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#17a2b8',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si, Guardar!',
        cancelButtonText: 'No, cancelar'
      }).then((result) => {
        if (result.value) {

            if (this.selectedFiles) {
              const file: File | null = this.selectedFiles.item(0);
              /*
              var tamfile:number = Math.round(file?.size!/(1024*1024));  // ExcelFile.size --> bytes : (1024*1024) para convertir a MB

              if ( tamfile > this.tamanomaxMB){ //0.2 Mb //15 Mb
                Swal.fire("Aviso","El archivo tiene un tamaño mas grande que el permitido de: "+
                  this.tamanomaxMB.toString()+' MB',"error");
                return;
              }
              */
          
//               var tamfile:number = Math.round(ExcelFile.size/(1024*1024));  // ExcelFile.size --> bytes : (1024*1024) para convertir a MB

              if (file) {
                // var tamfile:number = Math.round(ExcelFile.size/(1024*1024));  // ExcelFile.size --> bytes : (1024*1024) para convertir a MB
                // var sFileName = ExcelFile.name;
                this.currentFile = file;   
                const formData: FormData = new FormData();
                formData.append('file', this.currentFile, this.currentFile.name);
                formData.append('tiparchivo',this.logoOFirma);
                formData.append('empresa',this.filtroForm.get('codempresa')!.value);
                formData.append('usuario',this.tokenService.getUserName());
                
                this.archivosService.postSubirArchivo(formData)
                .pipe(finalize( () => {
                  Swal.fire("AVISO","Se guardo el archivo correctamente","success");
                }
                ))
                .subscribe(
                  (result) => {
                    this.closeModalLogoFirma();
                  }, error => {
                    console.log(error);
                  }
                );
                this.selectedFiles = undefined;
              }    
              this.selectedFiles = undefined;
            }
        }
      })

  
    }
}
