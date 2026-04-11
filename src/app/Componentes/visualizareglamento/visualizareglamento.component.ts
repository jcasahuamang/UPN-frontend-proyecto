import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { MaeEmpresas } from 'src/app/Clases/maeempresa';
import { Reglamentos } from 'src/app/Clases/Reglamentos';
import { Configuracion } from 'src/app/services/configuracion-global';
import { EmpresaService } from 'src/app/services/empresa.service';
import { ReglamentoService } from 'src/app/services/reglamento.service';
import { TokenService } from 'src/app/services/TokenService';

@Component({
  selector: 'app-visualizareglamento',
  templateUrl: './visualizareglamento.component.html',
  styleUrls: ['./visualizareglamento.component.css']
})
export class VisualizareglamentoComponent implements OnInit {

  public listaReglamentos: Reglamentos[];
  public formReglamento: FormGroup;
  public anuncioEstado?: any[];
  public anuncioAlcance?: any[];
  public submitted = false;
  public listaEmpresas: MaeEmpresas[];
  public isProcessing: boolean = false;
  isVisualiza: boolean = false;
  isDescarga: boolean = false;
    public selectedId: any | null = null;

      detalleCol: string[] = ['Opciones', 'Id','Titulo','Descripcion','Estado'];
      detalleData = new MatTableDataSource(); 
  
      @ViewChild('paginatordetalle', { static: true, read: MatPaginator }) paginatordetalle: MatPaginator;
      
      @ViewChild('closebutton') modal: ElementRef;

  constructor(
    private router:Router,
        private fb: FormBuilder,
            private tokenService: TokenService,
            private reglamentoService: ReglamentoService,
            private empresaService: EmpresaService,
            private changeDetectorRefs: ChangeDetectorRef,
            private datePipe: DatePipe,
            private dialog: MatDialog,
            private sanitizer: DomSanitizer

  ) { }

  ngOnInit(): void {
    this.ListCompanias();
    this.ListaEstados();
    this.onListReglamentos();

//    this.inicializarForm();

  }

   onRowClicked(row: any): void {
         this.selectedId = row.id;
  }
  
    inicializarForm(): void{
      this.formReglamento = this.fb.group({
  
              id:[],
              titulo: ['', Validators.compose([Validators.required,Validators.maxLength(250)])],
              descripcion: ['', Validators.compose([Validators.required,Validators.maxLength(250)])],
              estado: [0, Validators.compose([Validators.required])],
              ruta: [],
              empresa: [''],
              tipo: [''],              
              usucreacion: [],
              feccreacion: [],
  
        })
    }
  
        ListaEstados() {
          this.anuncioEstado = new Configuracion().anuncioEstado;
        }
    
        ListCompanias() {
          this.empresaService.getTodos().subscribe(
          (result) => {
               this.listaEmpresas = result;  
              }, error => {
                console.log(error);
              }
            );
          }

      getDescripcionEstado(estado: number): string {
        const estadoEncontrado = this.anuncioEstado!.find(a => a.codigo === estado);
        return estadoEncontrado ? estadoEncontrado.descripcion : 'Descripción no disponible';
      }          

  onListReglamentos() {
    this.reglamentoService.getTodosByEmpresa(
      this.tokenService.getCodEmpresa()
    ).subscribe(
    (result) => {
//      console.log(result);
          this.detalleData.data = result;
         this.detalleData.paginator = this.paginatordetalle;
  
  
        }, error => {
          console.log(error);
        }
      );
    }      

    private closeModal(): void {
      this.modal.nativeElement.click();
    }

    get f() {
      return this.formReglamento.controls;
    }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;

    this.detalleData.filter = filterValue.trim().toLowerCase();


    if (this.detalleData.paginator) {
      this.detalleData.paginator.firstPage();
    }
  }


    onResetFormAnuncio() {
    this.submitted = false;
    this.formReglamento.reset();
  }


    onVisualizar(detalle: Reglamentos,tipo: string) {
      this.isProcessing = false;
      this.isVisualiza = false;
      this.isDescarga = false;
  
      this.isProcessing = true;
      if (tipo === 'Descarga'){ this.isDescarga = true;}  
      if (tipo === 'Visualiza'){ this.isVisualiza = true;}
      
          this.reglamentoService.getReglamentoDoc(detalle.id).subscribe(
                (response) => {
                 /*   if (response.size === 0) {// Verificar si el archivo PDF está vacío
                      alert("El archivo PDF generado está vacío.");
                      this.isProcessing = false;
                      return;
                    }
                    */
                   
//                    const contentDisposition = response.headers.get('content-disposition');
                    const contentType = response.headers.get('Content-Type');
                      const extension = this.obtenerExtension(contentType);

                    if (tipo === 'Visualiza'){  //Validar el tipo de archivo, debido a que word no se puede visualizar
                        if (['pdf', 'txt', 'png', 'jpg', 'jpeg'].includes(extension)) {
                              tipo = "Visualiza";
                            } else {
                              tipo = "Descarga";
                        }
                     }   
                      
                    if (tipo === 'Descarga'){  
                      const url = window.URL.createObjectURL(response.body!);
                      // Crear un enlace temporal para forzar la descarga
                      const link = document.createElement('a');
                      link.href = url;
                      link.target = '_blank';  // Abrir en una nueva pestaña

                      link.download = 'Reglamento_'+detalle.id.toString()+'_'+detalle.titulo+'.'+extension;                      

                      // Simular un clic en el enlace para iniciar la descarga
                      link.click();

                      // Liberar el objeto URL después de usarlo
                      window.URL.revokeObjectURL(url);

                      this.isProcessing = false;

                    }                   
                     
                    if (tipo === 'Visualiza'){
                      const url = window.URL.createObjectURL(response.body!);//     window.open(url);
                      const modal = document.getElementById('pdfModal') as HTMLElement;
                      const pdfViewer = document.getElementById('pdfViewer') as HTMLEmbedElement;
                      pdfViewer.src = url;  // Establecer la URL del PDF en el <embed> para mostrarlo                      
                      modal.style.display = 'block';         // Mostrar el modal con el PDF
//                                  modal.style.position = 'fixed'; // Fijar el modal en la pantalla
//                                    modal.style.top = '0';
//                                    modal.style.left = '0';
//                                    modal.style.width = '100vw';  // Asegurarse de que ocupe el 100% del ancho de la pantalla
//                                    modal.style.height = '140vh'; // Asegurarse de que ocupe el 100% de la altura de la pantalla
//                                    modal.style.zIndex = '9999'; // Asegurarse de que esté por encima de otros elementos
//                                    modal.style.backgroundColor = 'rgba(0, 0, 0, 0.7)'; // Fondo semitransparente para mejorar la visibilidad del modal

                      // Ajustar el tamaño del <embed> para que se vea bien en pantallas pequeñas
//                                  pdfViewer.style.width = '100%';  // El PDF debe ocupar el 100% del ancho de la pantalla
//                                  pdfViewer.style.height = '100%'; // El PDF debe ocupar el 100% de la altura de la pantalla
//                                    pdfViewer.style.border = 'none'; // Eliminar bordes si los hay

                      pdfViewer.onload = () => {
                        this.isProcessing = false;
                                  
                      };


                    }

                }, error => {
                  this.isProcessing = false;
                  console.log(error);
                });
            
    }

    // Función para cerrar el modal
  closePdfModal() {
    const modal = document.getElementById('pdfModal') as HTMLElement;
    const pdfViewer = document.getElementById('pdfViewer') as HTMLEmbedElement;
    // Ocultar el modal y limpiar la URL del PDF
    modal.style.display = 'none';
    pdfViewer.src = '';
    //this.onResetForm();
  }

    obtenerExtension(contentType: string | null): string {
  if (!contentType) return '';

  const mimeToExtension: { [key: string]: string } = {
    'application/pdf': 'pdf',
    'application/msword': 'doc',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
    'application/vnd.ms-excel': 'xls',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'xlsx',
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'text/plain': 'txt',
    'application/zip': 'zip',
    'application/octet-stream': 'bin',
    // Agrega más tipos MIME si los necesitas
  };

  return mimeToExtension[contentType.toLowerCase()] || '';
  }

}
