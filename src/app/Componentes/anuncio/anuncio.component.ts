import { EmpresaService } from './../../services/empresa.service';
import { AnuncioService } from 'src/app/services/anuncio.service';
import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Anuncios } from 'src/app/Clases/Anuncios';
import { TokenService } from 'src/app/services/TokenService';
import { Configuracion } from 'src/app/services/configuracion-global';
import Swal from 'sweetalert2';
import { MaeEmpresas } from 'src/app/Clases/maeempresa';
import { finalize } from 'rxjs';
import { DatePipe } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { ModalanuncioComponent } from '../modalanuncio/modalanuncio.component';

@Component({
  selector: 'app-anuncio',
  templateUrl: './anuncio.component.html',
  styleUrls: ['./anuncio.component.css']
})
export class AnuncioComponent implements OnInit {
  public listaAnuncios: Anuncios[];
  public formAnuncio: FormGroup;
  public anuncioEstado?: any[];
  public anuncioAlcance?: any[];
  public submitted = false;
  public listaEmpresas: MaeEmpresas[];
  public isProcessing: boolean = false;
  public selectedId: any | null = null;

      detalleCol: string[] = ['Opciones', 'Id','Titulo','Descripcion','Estado','Alcance','Inicio Vig.','Fin Vig.','Visualizacion'];
      detalleData = new MatTableDataSource(); 
  
      @ViewChild('paginatordetalle', { static: true, read: MatPaginator }) paginatordetalle: MatPaginator;
      
      @ViewChild('closebutton') modal: ElementRef;

  constructor(
    private router:Router,
        private fb: FormBuilder,
            private tokenService: TokenService,
            private anuncioService: AnuncioService,
            private empresaService: EmpresaService,
            private changeDetectorRefs: ChangeDetectorRef,
            private datePipe: DatePipe,
            private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.ListCompanias();
    this.ListaEstados();
    this.ListaAlcance();

    this.inicializarForm();
    this.onListAnuncios();

  }

  onRowClicked(row: any): void {
         this.selectedId = row.id;
  }
  
  inicializarForm(): void{
    this.formAnuncio = this.fb.group({

            id:[],
            titulo: ['', Validators.compose([Validators.required,Validators.maxLength(250)])],
            descripcion: ['', Validators.compose([Validators.required,Validators.maxLength(250)])],
            estado: [0, Validators.compose([Validators.required])],
            alcance: [0, Validators.compose([Validators.required])],
            feciniciovigencia: [],
            fecfinvigencia: [],
            contenido: [],
            empresa: [''],
            usucreacion: [],
            feccreacion: [],

      })
  }

      ListaEstados() {
        this.anuncioEstado = new Configuracion().anuncioEstado;
      }
  
      ListaAlcance() {
        this.anuncioAlcance = new Configuracion().anuncioAlcance;
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
          if (!Array.isArray(this.anuncioEstado)) {
            return '';
          }

        const estadoEncontrado = this.anuncioEstado!.find(a => a.codigo === estado);
        return estadoEncontrado ? estadoEncontrado.descripcion : 'Descripción no disponible';
      }
      
      getDescripcionAlcance(alcance: number): string {
          if (!Array.isArray(this.anuncioAlcance)) {
            return '';
          }
        const alcanceEncontrado = this.anuncioAlcance!.find(a => a.codigo === alcance);
        return alcanceEncontrado ? alcanceEncontrado.descripcion : 'Descripción no disponible';
      }

      getDescripcionEmpresa(empresa: string): string {
          if (!Array.isArray(this.listaEmpresas)) {
            return '';
          }
        if (empresa.length ===0 || empresa===''){
          return 'Todos';
        }else{
            const empresaEncontrado = this.listaEmpresas!.find(a => a.id === empresa);
            return empresaEncontrado ? empresaEncontrado.desrazonsocial : 'Descripción no disponible';  
  
        }
      }

  onListAnuncios() {
    this.anuncioService.getTodos().subscribe(
    (result) => {
//          this.companias = result;
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
      return this.formAnuncio.controls;
    }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;

    this.detalleData.filter = filterValue.trim().toLowerCase();


    if (this.detalleData.paginator) {
      this.detalleData.paginator.firstPage();
    }
  }

  onNew(){
//    this.router.navigate(['/inicio/anuncioregistro/0'], { skipLocationChange: true, replaceUrl: true });
this.router.navigate(['/inicio/anuncioregistro/0'], { skipLocationChange: true });
//this.router.navigate(['/inicio/anuncioregistro/0'], { replaceUrl: true });
//    console.log('/inicio/anuncioregistro/0');
  }

  onExportExcel(){
    this.isProcessing = true;
    this.anuncioService.getExcelAnuncioTodos(5).pipe(finalize(()=>{
        this.isProcessing = false;
      }))
      .subscribe(
      (result) => {
        const url = window.URL.createObjectURL(result);
        window.open(url);
      }, error => {
        console.log(error);
      }
    );
  }
  onChange(detalle: Anuncios){
    this.router.navigate(['/inicio/anuncioregistro/'+detalle.id], { skipLocationChange: true });
  }

  onConfigurar(detalle: Anuncios){
    this.onResetFormAnuncio();

    this.anuncioService.getDatos(detalle.id.toString())
    .pipe(finalize(()=>{
    }))
    .subscribe(
      (result) => {
       // console.log(result);
        this.formAnuncio.patchValue({
          id: result.id,
          titulo:result.titulo,
          descripcion:result.descripcion,
          estado: result.estado,
          alcance: result.alcance,
          feciniciovigencia: this.formatDate(new Date(result.feciniciovigencia),'2') ,
          fecfinvigencia:this.formatDate(new Date(result.fecfinvigencia),'2') ,
          contenido:result.contenido,
          empresa: result.empresa,
          usucreacion: result.usucreacion,
          feccreacion: result.feccreacion,
        });

        }, error => {
          console.log(error);
        }
      );

  }

  onSubmit(){
    this.submitted = true;
    if (this.formAnuncio.invalid) {
      return;
    }

    Swal.fire({
      title: 'Advertencia',
      text: `¿Esta seguro que desea guardar?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#17a2b8',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, Guardar!',
      cancelButtonText: 'No, cancelar'
    }).then((result) => {
      if (result.value) {
          
          if (this.validaFecha( this.formAnuncio.get('feciniciovigencia')!.value,
                            this.formAnuncio.get('fecfinvigencia')!.value) != 0)
          {
              return;
          };
          


    /*
        console.log('antes');
        console.log(this.formAnuncio.get('feciniciovigencia')!.value);
        console.log(this.formAnuncio.get('fecfinvigencia')!.value);
    */    
        const fecinicio = new Date(this.formAnuncio.get('feciniciovigencia')!.value) ;
        const fecfin = new Date(this.formAnuncio.get('fecfinvigencia')!.value);

        fecinicio.setDate(fecinicio.getDate()+1);
        fecfin.setDate(fecfin.getDate()+1);


        /*
        console.log('fecinicio y fecfin');

        console.log(fecinicio);
        console.log(fecfin);
        */

   /*
    this.formAnuncio.get("feciniciovigencia")!.setValue(this.datePipe.transform(this.formAnuncio.get('feciniciovigencia')!.value,'yyyy-MM-dd'));
    this.formAnuncio.get("fecfinvigencia")!.setValue(this.datePipe.transform(this.formAnuncio.get('fecfinvigencia')!.value,'yyyy-MM-dd'));
        */

    this.formAnuncio.get("feciniciovigencia")!.setValue(fecinicio);
    this.formAnuncio.get("fecfinvigencia")!.setValue(fecfin);
    
/*
    this.formAnuncio.get("feciniciovigencia")!.setValue(fecinicio.toUTCString());
    this.formAnuncio.get("fecfinvigencia")!.setValue(fecfin.toUTCString());
*/
/*
this.formAnuncio.get("feciniciovigencia")!.setValue(this.formatDate(fecinicio,'2'));
this.formAnuncio.get("fecfinvigencia")!.setValue(this.formatDate(fecinicio,'2'));
*/

        this.anuncioService.update(this.formAnuncio.value).subscribe(
          (result) => {
            if (result) {
              this.onResetFormAnuncio();
             this.onListAnuncios();
//              this.changeDetectorRefs.detectChanges();
              this.toastAcceptedAlert("Se configuro con exito");
              this.closeModal();
            } else {
              this.closeModal();
            }
          }, error => {
            console.log(error);
          }
        );

      }
    })

  }

  onResetFormAnuncio() {
    this.submitted = false;
    this.formAnuncio.reset();
  }

  formatDate(date: Date,tipoFormato: string): string {
    const day = ('0' + date.getDate()).slice(-2);   // Asegurarse de que el día tenga 2 dígitos
    const month = ('0' + (date.getMonth() + 1)).slice(-2); // Los meses en JS son 0-indexados
    const year = date.getFullYear();


    if (tipoFormato ==='1'){
      return `${day}/${month}/${year}`;
    }
    else    if (tipoFormato ==='2'){
      return `${year}-${month}-${day}`;
    }else if (tipoFormato ==='3'){
      return `${year}${month}${day}`;
    }else{
      return '';
    }
  }

  onDelete(detalle: Anuncios){

    Swal.fire({
      title: 'Advertencia',
      text: `¿Esta seguro que desea Eliminar el anuncio?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#17a2b8',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, Eliminar!',
      cancelButtonText: 'No, cancelar'
    }).then((result) => {
//      if (result.value) {
    if (result.isConfirmed) {

      this.anuncioService.delete(detalle.id).subscribe(
        (result) => {
          this.onListAnuncios();
//          this.changeDetectorRefs.detectChanges();
          this.toastAcceptedAlert("Se Elimino con exito");
          }, error => {
            console.log(error);
          }
          )
      }
    })

  }

  onAnuncio(detalle: Anuncios){
        let alcance: number = 0;   // 0  = interno    1 = externo

    const dialogRef = this.dialog.open(ModalanuncioComponent, {
      width: '100vw',  // 90% del ancho de la ventana
      maxWidth: '1000px', // Limita el ancho máximo
      height: '90vh',  // 80% de la altura de la ventana
      maxHeight: '500px', // Limita la altura máxima
      panelClass: 'custom-modal',
      disableClose: true,  // Prevenir el cierre al hacer clic fuera o presionar ESC
      data: {
        alcance: alcance
      }
    });

    dialogRef.componentInstance.anuncioCerrado.subscribe(
      () => {
     //   this.getTasks();
      }
    )
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

  validaFecha(fecinicio: string,fecfin:string):number{
        let fechaini:string = this.datePipe.transform(fecinicio,'yyyyMMdd')?.toString()!;
        let fechafin:string = this.datePipe.transform(fecfin,'yyyyMMdd')?.toString()!;
        let respuesta: number;

        respuesta = 0;
        if ( fechaini === null || fechaini === undefined ) {
          Swal.fire('Aviso', 'Debe ingresar la fecha de inicio', 'warning');
          respuesta = 1;
        }

        if ( fechafin === null || fechafin === undefined ) {
          Swal.fire('Aviso', 'Debe ingresar la fecha de fin', 'warning');
          respuesta = 1;
        }

        if ( fechafin < fechaini ){
          Swal.fire('Aviso', 'La fecha de fin no puede ser menor a la fecha inicial', 'warning');
          respuesta = 1;
        }

        if ( fechaini > fechafin ){
          Swal.fire('Aviso', 'La fecha de inicial no puede ser mayor a la fecha final', 'warning');
          respuesta = 1;
        }
        return respuesta;
  }

}
