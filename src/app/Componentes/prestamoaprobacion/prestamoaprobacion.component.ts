import { SelectionModel } from '@angular/cdk/collections';
import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { finalize } from 'rxjs';
import { Aprobaciones } from 'src/app/Clases/Aprobaciones';
import { IPrestamosRelacion } from 'src/app/Clases/IPrestamosRelacion';
import { MaeEmpresas } from 'src/app/Clases/maeempresa';
import { ParamAprobacion } from 'src/app/Clases/paramAprobacion';
import { Planillas } from 'src/app/Clases/planillas';
import { Tabla } from 'src/app/Clases/Tabla';
import { AprobacionesService } from 'src/app/services/aprobaciones.service';
import { ConfiguracionService } from 'src/app/services/configuracion.service';
import { EmpresaService } from 'src/app/services/empresa.service';
import { PrestamosService } from 'src/app/services/prestamos.service';
import { TablaService } from 'src/app/services/tabla.service';
import { TokenService } from 'src/app/services/TokenService';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-prestamoaprobacion',
  templateUrl: './prestamoaprobacion.component.html',
  styleUrls: ['./prestamoaprobacion.component.css']
})
export class PrestamoaprobacionComponent implements OnInit {

  public filtroForm: FormGroup;
  public detalle: IPrestamosRelacion = new IPrestamosRelacion();
  public listaEmpresas: MaeEmpresas[];
  public prestamoEstado: Tabla[];  
//  paramConfiguraVisualiza: ParamConfiguraVisualiza;
  public paramAprobacion: ParamAprobacion;
  public listaPlanillas: Planillas[];
  public isProcessing: boolean = false;
  public isProcessingApproval: boolean = false;
   
  public listaDocumentos?: any[];
  public selectedId: any | null = null;


  detalleCol: string[] = ['Opciones','Nombre','Doc identidad','Fec Ingreso','Planilla','Tipo','Fecha Solicitud','Moneda','Importe','Cuotas','Estado','Comentarios'];
  detalleData = new MatTableDataSource(); 
  selection = new SelectionModel<IPrestamosRelacion>(true, []);
  public desOpcionSeleccionar: string;
  public llave: string = "";
  public tipoaprobacion: string = "PRESTAMO";
  public accion: string = "";
  public usuarioActual: string = "";


  @ViewChild('paginatordetalle', { static: true, read: MatPaginator }) paginatordetalle: MatPaginator;
  @ViewChild('closeDetalle') modalDetalle: ElementRef;
  @ViewChild(MatMenuTrigger, { static: true }) contextMenuTrigger!: MatMenuTrigger;
  contextMenuPosition = { x: '0px', y: '0px' };
  selectedRow: any = null;

  constructor(private changeDetectorRefs: ChangeDetectorRef,private fb: FormBuilder,
      private empresaService: EmpresaService,
      private prestamosService: PrestamosService,
      private configuracionService: ConfiguracionService,
      private tablaService: TablaService,
    private tokenService: TokenService,
    private aprobacionesService: AprobacionesService) { }

  ngOnInit(): void {
    this.inicializarForm();
    this.ListCompanias();
    this.ListPlanillas();
    this.ListaEstados();
  }

   

      onRowClicked(row: any): void {
      if (this.selectedId != null && this.selectedId != row.id) {
      }

      this.selectedId = row.id;


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


    ListPlanillas() {
      this.configuracionService.getPlanilla(this.filtroForm.get('empresa')!.value).subscribe(
      (result) => {
            this.filtroForm.get('planilla')!.setValue("00"); 
            this.listaPlanillas = result;  
          }, error => {
            console.log(error);
          }
        );
      }
      ListaEstados() {
        this.tablaService.getTodosByEmpresaTipo(
          this.tokenService.getCodEmpresa(),'PREST_ESTADO'
        ).subscribe(
        (result) => {
            this.filtroForm.get('estado')!.setValue("SO");           
              this.prestamoEstado = result;
      
            }, error => {
              console.log(error);
            }
          );
                  
      }

    inicializarForm(): void{
      this.filtroForm = this.fb.group({
        empresa: [this.tokenService.getCodEmpresa(), Validators.compose([Validators.required])],
        planilla: ['00', Validators.required],        
        estado: ['SO', Validators.required],
        })
    }

    onResetForm() {
      this.isProcessing = false;
      this.filtroForm.reset();
      this.filtroForm.get("empresa")!.setValue(this.tokenService.getCodEmpresa());
      this.filtroForm.get("planilla")!.setValue("00");
      this.filtroForm.get("estado")!.setValue("SO");
    }

  onFiltrar(){
    /*
    this.isProcessing = false;
    if (this.filtroForm.get('empresa')!.value === '00' || this.filtroForm.get('planilla')!.value === '00'
            || this.filtroForm.get('documento')!.value === '00' ) {
       this.alerta('Aviso','Debe seleccionar los valores correctos');
       return;
    }
    */
      this.isProcessing = true;
      this.desOpcionSeleccionar = 'Seleccionar todo';
      this.prestamosService.getConsultaPrestamos(
        this.filtroForm.get('empresa')!.value,
        this.filtroForm.get('planilla')!.value,
        this.filtroForm.get('estado')!.value,
        '000000',
        this.tokenService.getUserName()          
      ).pipe(finalize(()=>{
        this.isProcessing = false;
        this.selection.clear();
      }))
      .subscribe(
      (result) => {
            this.detalleData.data = result;
            this.detalleData.paginator = this.paginatordetalle;
          }, error => {
            console.log(error);
          }
        );

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

      /******* Manejo de Checkbox *****************************/
          /** Whether the number of selected elements matches the total number of rows. */
        isAllSelected() {
          const numSelected = this.selection.selected.length;
          const numRows = this.detalleData.data.length;
          return numSelected === numRows;
        }

        /** Selects all rows if they are not all selected; otherwise clear selection. */
        masterToggle() {

          if (Array.isArray(this.detalleData.data)) {
            this.isAllSelected() ?
                this.selection.clear() :
                (this.detalleData.data as IPrestamosRelacion[]).forEach(row => this.selection.select(row));            
          }

          if (this.isAllSelected()){
            this.desOpcionSeleccionar= 'Desmarcar Todo';
          }else{
            this.desOpcionSeleccionar= 'Seleccionar Todo';
          }
        }
        /*
        logSelection() {
          this.selection.selected.forEach(s => console.log(s.despersonal));
        }
        */

      /******* Manejo de Menu Contextual *****************************/

        openContextMenu(event: MouseEvent, row: any) {
          event.preventDefault(); // evita el menú nativo del navegador
          this.contextMenuPosition.x = event.clientX + 'px';
          this.contextMenuPosition.y = event.clientY + 'px';
          this.selectedRow = row;
          this.contextMenuTrigger.openMenu();
        }



    onEjecutar(accionSeleccionado: string) {
        this.accion = accionSeleccionado;
        let mensajePregunta: string ='';
        let mensajeConfirmacion: string ='';

        if (this.accion=='APROBAR'){
          mensajePregunta = '¿Esta seguro que desea aprobar los prestamos seleccionados?';
          mensajeConfirmacion = 'Se realizo la aprobacion';
        }
        if (this.accion=='TRANSFERIR'){
          mensajePregunta = '¿Esta seguro que desea transferir los prestamos seleccionados?';
          mensajeConfirmacion = 'Se realizo la transferencia';
        }
        if (this.accion=='RECHAZAR'){
          mensajePregunta = '¿Esta seguro que desea rechazar los prestamos seleccionados?';
          mensajeConfirmacion = 'Se realizo el rechazo';
        }
        if (this.accion=='REVERTIR'){
          mensajePregunta = '¿Esta seguro que desea revertir los prestamos seleccionados?';
          mensajeConfirmacion = 'Se realizo la reversion';         
        }

        if (this.selection.selected.length<=0){
          Swal.fire('Aviso', 'Debe seleccionar algun registro', 'warning');        
          return;
        };       

        //Validando
        if (this.accion=='APROBAR' || this.accion=='RECHAZAR'){
            if (this.selection.selected.find(s => s.estado !== 'SO')) {
                Swal.fire('Aviso', 'los prestamos seleccionados tienen que estar con estado Solicitado', 'warning');        
                return;
              }
        }
  
        if (this.accion=='TRANSFERIR'){
            if (this.selection.selected.find(s => s.estado !== 'AP')) {
              Swal.fire('Aviso', 'los prestamos seleccionados tienen que estar con estado Aprobado', 'warning');        
              return;
            }
        }
        if (this.accion=='REVERTIR'){
            if (this.selection.selected.find(s => s.estado == 'SO')) {
              Swal.fire('Aviso', 'los prestamos seleccionados no pueden estar con estado Solicitado', 'warning');        
              return;
            }
        }

        Swal.fire({
          title: 'Advertencia',
//          text: `¿Esta seguro que desea rechazar las vacaciones?`,
          text: mensajePregunta,
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#17a2b8',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Si, Continuar!',
          cancelButtonText: 'No, cancelar'
        }).then((result) => {
    //      if (result.value) {
        if (result.isConfirmed) {
            this.isProcessingApproval = true;
            this.llave = this.aprobacionesService.getDateTimeString();
            //this.tipoaprobacion= "VACACION";
//            this.accion= "RECHAZAR";
            this.usuarioActual=this.tokenService.getUserName();

            this.paramAprobacion = new ParamAprobacion(
              this.llave,this.tipoaprobacion,this.accion,this.usuarioActual
            );

            //Guardando la relacion de registros seleccionados en la base
            this.aprobacionesService.saveAll(
                this.GetListaSeleccionados(
                  this.llave,this.tipoaprobacion,this.accion,this.usuarioActual))
                .pipe(finalize(()=>{}))
                  .subscribe((result) => {
                    
                  //haciendo validaciones en base a los registros seleccionados
                  this.aprobacionesService.getValidaRegistro(
                              this.llave,this.tipoaprobacion,this.accion,this.usuarioActual)
                      .subscribe(
                        (result) => {
                          
                            if (result.length > 0){
                              Swal.fire({
                                title: 'Advertencia',
        //                        text: `No se puede guardar, ` + result[0].descripcion,
                                text: result[0].descripcion,
                                icon: 'warning',
                                showCancelButton: false,
                                confirmButtonColor: '#17a2b8',
                                cancelButtonColor: '#d33',
                                confirmButtonText: 'Aceptar!',
                                cancelButtonText: 'cancelar'
                              })
                                this.isProcessingApproval = false;      
                            } else {
                                //si pasa la validacion, finalmente ejecutamos el proceso 
                                  this.aprobacionesService.ejecutaAprobacion(
                                    this.paramAprobacion).subscribe(
                                    (result) => {
                                      this.isProcessingApproval=false
                                      this.onFiltrar();
                                      this.toastAcceptedAlert(mensajeConfirmacion);
                                      }, error => {
                                        console.log(error);
                                        })
                          }
                        }, error => {
                          this.isProcessingApproval=false;
                          console.log(error);
                        }
                      );    

                  }, error => {
                    this.isProcessingApproval=false;
                      console.log(error);
                  })
                                        
          }
        }) 

      //console.log('Opción 3 sobre', this.selectedRow);
//          this.toastAcceptedAlert("Opción Rechazar");
    }



    GetListaSeleccionados<T>(llave: string,tipoaprobacion: string,accion: string,usuario: string)
        {  let Array: Aprobaciones[] = [];
          /*const Array: {
              id: number|null;
              llave: string;
              tipoaprobacion: string;
              accion: string;
              usuario: string;
              empresa: string;
              personal: string;
              idsolicitud: number;
            }[] = [];
            */
    //        this.selection.selected.forEach(element => console.log(element.despersonal));
          this.selection.selected.forEach(element => {
            Array.push(
              {
                id: null,
              llave: llave,
              tipoaprobacion: tipoaprobacion,
              accion: accion,
              usuario: usuario,
              empresa: element.codempresa,
              personal: element.codpersonal,
              idsolicitud: element.id}
            );
          });
          return Array;
        }

}
