import { TablaService } from './../../services/tabla.service';
import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Tabla } from 'src/app/Clases/Tabla';
import { Vacaciones } from 'src/app/Clases/Vacaciones';
import { TokenService } from 'src/app/services/TokenService';
import { VacacionesService } from 'src/app/services/vacaciones.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-vacacion',
  templateUrl: './vacacion.component.html',
  styleUrls: ['./vacacion.component.css']
})
export class VacacionComponent implements OnInit {
/*  public vacacionDatos: Vacaciones = new Vacaciones;*/
  public listaVacaciones: Vacaciones[];
  public formVacacion: FormGroup;
  public vacacionEstado: Tabla[];
  public submitted = false;
  public isProcessing: boolean = false;
  public selectedId: any | null = null;
  public isEditMode: boolean = false;
  public accionNuevo: Boolean = true;
  public fFinMinimo: string;
  public fFinMaximo: string;
  public mensaje: string = "";

      detalleCol: string[] = ['Opciones','Fecha Inicio','Fecha Fin','Dias','Estado','Comentarios'];
      detalleData = new MatTableDataSource(); 
  
      @ViewChild('paginatordetalle', { static: true, read: MatPaginator }) paginatordetalle: MatPaginator;
      
      @ViewChild('closebutton') modal: ElementRef;

  constructor(
    private router:Router,
        private fb: FormBuilder,
            private tokenService: TokenService,
            private vacacionService: VacacionesService,
            private tablaService: TablaService,
            private changeDetectorRefs: ChangeDetectorRef,
            private datePipe: DatePipe,
            private dialog: MatDialog

  ) { }

  ngOnInit( ): void {
    this.ListaEstados();

    this.inicializarForm();
    this.onListVacaciones();
  }

    onRowClicked(row: any): void {
      if (this.selectedId != null && this.selectedId != row.id) {
        this.onEnableFormFields(false);
              this.mensaje = "";
      }

      this.selectedId = row.id;
      this.onObtieneDetalleVac(this.selectedId);

  }


    inicializarForm(): void{
      this.formVacacion = this.fb.group({
  
              id:[],
              empresa: [this.tokenService.getCodEmpresa(), Validators.compose([Validators.required,Validators.maxLength(4)])],
              codpersonal: [this.tokenService.getCodPersonal(), Validators.compose([Validators.required,Validators.maxLength(6)])],
              fecinicio: [{ value: this.formatDate(new Date(),'2'), disabled: true },Validators.compose([Validators.required])],
              fecfin: [{ value: '', disabled: true },Validators.compose([Validators.required])],
              numdias: [{ value: 0, disabled: true }, Validators.compose([Validators.required])],
              observacion: [{ value: '', disabled: true }],
              tipo: [{ value: 'NO', disabled: true }],
              estado: [{ value: 'SO', disabled: true }, Validators.compose([Validators.required])],
              usucreacion: [this.tokenService.getUserName()],
              feccreacion: [new Date()],
              codigotransferencia: []
        })

    }

      ListaEstados() {
        this.tablaService.getTodosByEmpresaTipo(
          this.tokenService.getCodEmpresa(),'VAC_ESTADO'
        ).subscribe(
        (result) => {
              this.vacacionEstado = result;
      
            }, error => {
              console.log(error);
            }
          );
                  
      }

      getDescripcionEstado(estado: string): string {
          if (!Array.isArray(this.vacacionEstado)) {
            return '';
          }

        const estadoEncontrado = this.vacacionEstado!.find(a => a.codigo === estado);
        return estadoEncontrado ? estadoEncontrado.descripcion : '';
      }

  onListVacaciones() {
    this.vacacionService.getTodosByEmpresaPersonal(
      this.tokenService.getCodEmpresa(),
      this.tokenService.getCodPersonal()
    ).subscribe(
    (result) => {
//          this.companias = result;
          this.detalleData.data = result;
          this.detalleData.paginator = this.paginatordetalle;

          if (this.detalleData.data && this.detalleData.data.length > 0) {
            this.onRowClicked(this.detalleData.data[0]);
              
            }

        }, error => {
          console.log(error);
        }
      );
    }

  onObtieneDetalleVac(id: number) {
    this.vacacionService.getDatos(id.toString()).subscribe(
    (result) => {
      this.formVacacion.patchValue({
              id: result.id,
              empresa: result.empresa,
              codpersonal: result.codpersonal,
              //Cuando usas matDatepicker, es sofuciente con esto
//              fecinicio: result.fecinicio,
//              fecfin: result.fecfin,
              fecinicio: this.formatDate(new Date(result.fecinicio),'2'),
              fecfin: this.formatDate(new Date(result.fecfin),'2'),
              numdias: result.numdias,
              observacion: result.observacion,
              tipo: result.tipo,
              estado: result.estado,
              usucreacion: result.usucreacion,
              feccreacion: result.feccreacion,
              codigotransferencia: result.codigotransferencia

            });
        }, error => {
          console.log(error);
        }
      );
    }

    private closeModal(): void {
      this.modal.nativeElement.click();
    }

    get f() {
      return this.formVacacion.controls;
    }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;

    this.detalleData.filter = filterValue.trim().toLowerCase();


    if (this.detalleData.paginator) {
      this.detalleData.paginator.firstPage();
    }
  }

  onResetFormVacacion() {
    this.submitted = false;
    this.accionNuevo = true;
    this.selectedId = 0;
    this.formVacacion.reset();
    this.onEnableFormFields(false);
  }

  onEnableFormFields(isEdit: boolean): void {
    this.isEditMode = isEdit;
    if (this.isEditMode) {
      this.formVacacion.get('fecinicio')?.enable();
//      this.formVacacion.get('fecfin')?.enable();
      this.formVacacion.get('numdias')?.enable();
      this.formVacacion.get('observacion')?.enable();
    } else {
      this.formVacacion.get('fecinicio')?.disable();
  //    this.formVacacion.get('fecfin')?.disable();
      this.formVacacion.get('numdias')?.disable();
      this.formVacacion.get('observacion')?.disable();
    }
   } 

   changeFechaDias(){
    const fecinicio = this.formVacacion.get('fecinicio')!.value;
    const numDias = this.formVacacion.get('numdias')!.value;

    if (fecinicio && numDias) {
      this.fFinMinimo = this.onAumentarDias(fecinicio, 1);
      this.fFinMaximo = this.onAumentarDias(fecinicio, 30); 
      this.formVacacion.get('fecfin')!.setValue(this.onAumentarDias(fecinicio, numDias));

    } else {
      this.fFinMinimo = '';
      this.fFinMaximo = '';
    }
   }

   onAumentarDias(fecinicio: any, numdias: number): string {
       const fecha = new Date(fecinicio);
      fecha.setDate(fecha.getDate() + numdias); // Sumar un día
      return this.formatDate(fecha, '2');
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

    onChange(detalle: Vacaciones){
      this.submitted = false;
      this.accionNuevo = true;
      this.onEnableFormFields(false);
      this.mensaje= "";
  
      if (detalle.estado === 'SO') {//SOLICITADO
        this.accionNuevo = false;
        this.onEnableFormFields(true);        
        this.mensaje= "Modificando una solicitud";
      } else {
          Swal.fire('Aviso', 'Sólo se puede editar las vacaciones con estado Solicitado', 'warning');
      }

    }

    
    onAddNew(){
      this.onResetFormVacacion();
      this.accionNuevo = true;
      //this.inicializarForm();
     
      this.fFinMinimo = this.formatDate(new Date(),'2');

      this.formVacacion.patchValue({
        empresa: this.tokenService.getCodEmpresa(),
        codpersonal: this.tokenService.getCodPersonal(),
        fecinicio:this.formatDate(new Date(),'2'),
        fecfin:this.formatDate(new Date(),'2'),
        numdias:1,
        tipo: 'NO', // Tipo por defecto al crear una nueva vacación
        estado: 'SO', // Estado por defecto al crear una nueva vacación
        usucreacion: this.tokenService.getUserName(),
        feccreacion: new Date(),

      });

      this.mensaje= "Registrando una nueva solicitud";
      this.onEnableFormFields(true);
    }

    onSubmit(){
        this.submitted = true;
        this.isProcessing = false;
        if (this.formVacacion.invalid) {
          return;
        }
      /*
        console.log("Formulario detalle with value, solo considera los campos habilitados");
        console.log(this.formVacacion.value);
        
        console.log("Formulario detalle with Rawvalue, considerar todos los campos");
        console.log(this.formVacacion.getRawValue());
        */
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
//          if (result.value) {
          if (result.isConfirmed) {
              if (this.validaFecha( this.formVacacion.get('fecinicio')!.value,
                                this.formVacacion.get('fecfin')!.value) != 0)
              {
                  return;

              };

              const fecinicio = new Date(this.formVacacion.get('fecinicio')!.value) ;
              const fecfin = new Date(this.formVacacion.get('fecfin')!.value);
              fecinicio.setDate(fecinicio.getDate()+1);
              fecfin.setDate(fecfin.getDate()+1);
              this.formVacacion.get("fecinicio")!.setValue(fecinicio);
              this.formVacacion.get("fecfin")!.setValue(fecfin);
                
        /*
        console.log(this.datePipe.transform(this.formVacacion.get("fecinicio")!.value,'yyyyMMdd')?.toString()!);
        console.log(this.datePipe.transform(this.formVacacion.get("fecfin")!.value,'yyyyMMdd')?.toString()!);
          */
            const fechaIniValida = this.datePipe.transform(this.formVacacion.get("fecinicio")!.value,'yyyyMMdd')?.toString()!;
            const fechaFinValida = this.datePipe.transform(this.formVacacion.get("fecfin")!.value,'yyyyMMdd')?.toString()!; 
              /*
              console.log("Fecha Inicio: " + fechaIniValida);
              console.log("Fecha Fin: " + fechaFinValida);
              */
                
            this.isProcessing = true;

            if (this.accionNuevo){


              this.vacacionService.getValidaRegistro(
                  this.tokenService.getCodEmpresa(),
                  this.tokenService.getCodPersonal(),
                  'NUEVO',0,fechaIniValida,fechaFinValida
              ).subscribe(
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
                        this.isProcessing = false;
                        return;      
                    } else {

                      this.vacacionService.create(this.formVacacion.getRawValue())
                      .subscribe(
                        (result) => {
                          if (result) {
                            this.onResetFormVacacion();
                            this.onListVacaciones();
                            this.changeDetectorRefs.detectChanges();
                            this.toastAcceptedAlert("Se registro con exito");
                            this.isProcessing = false;      
                            this.mensaje="";                  
                          } else {
                          }
                        }, error => {
                          console.log(error);
                        }
                      );


                  }
                }, error => {
                  console.log(error);
                }
              );    


            }else{


              this.vacacionService.getValidaRegistro(
                  this.tokenService.getCodEmpresa(),
                  this.tokenService.getCodPersonal(),
                  'MODIFICA',this.formVacacion.get('id')!.value,fechaIniValida,fechaFinValida
              ).subscribe(
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
                        this.isProcessing = false;      
                    } else {

                        this.vacacionService.update(this.formVacacion.getRawValue()).subscribe(
                          (result) => {
                            if (result) {
                              this.onResetFormVacacion();
                              this.onListVacaciones();
                              this.changeDetectorRefs.detectChanges();
                              this.toastAcceptedAlert("Se actualizo con exito");
                              this.isProcessing = false;
                              this.mensaje="";
                            } else {
                            }
                          }, error => {
                            console.log(error);
                          }
                        );

                  }
                }, error => {
                  console.log(error);
                }
              );    

              

            }

          }
        })        
    }

    onDelete(detalle: Vacaciones){
      Swal.fire({
        title: 'Advertencia',
        text: `¿Esta seguro que desea Eliminar el registro?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#17a2b8',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si, Eliminar!',
        cancelButtonText: 'No, cancelar'
      }).then((result) => {
  //      if (result.value) {
      if (result.isConfirmed) {


        
              this.vacacionService.getValidaRegistro(
                  this.tokenService.getCodEmpresa(),
                  this.tokenService.getCodPersonal(),
                  'ELIMINA',this.formVacacion.get('id')!.value,'00000000','00000000'
              ).subscribe(
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
                        this.isProcessing = false;      
                    } else {

                        this.vacacionService.delete(detalle.id).subscribe(
                          (result) => {
                            this.onListVacaciones();
                            this.toastAcceptedAlert("Se Elimino con exito");
                            }, error => {
                              console.log(error);
                              })

                  }
                }, error => {
                  console.log(error);
                }
              );    

        }
      })
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
