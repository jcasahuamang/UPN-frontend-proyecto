import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Permisos } from 'src/app/Clases/Permisos';
import { Tabla } from 'src/app/Clases/Tabla';
import { PermisosService } from 'src/app/services/permisos.service';
import { TablaService } from 'src/app/services/tabla.service';
import { TokenService } from 'src/app/services/TokenService';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-permiso',
  templateUrl: './permiso.component.html',
  styleUrls: ['./permiso.component.css']
})
export class PermisoComponent implements OnInit {

   public listaPermisos: Permisos[];
    public formPermiso: FormGroup;
    public permisoEstado: Tabla[];
    public permisoTipo: Tabla[];    
    public submitted = false;
    public isProcessing: boolean = false;
    public selectedId: any | null = null;
    public isEditMode: boolean = false;
    public accionNuevo: Boolean = true;
    public fFinMinimo: string;
    public fFinMaximo: string;
    public mensaje: string = "";
  
        detalleCol: string[] = ['Opciones','Tipo','Fecha Inicio','Fecha Fin','Dias','Estado','Comentarios'];
        detalleData = new MatTableDataSource(); 
    
        @ViewChild('paginatordetalle', { static: true, read: MatPaginator }) paginatordetalle: MatPaginator;
        
        @ViewChild('closebutton') modal: ElementRef;
  

  constructor(
        private router:Router,
            private fb: FormBuilder,
                private tokenService: TokenService,
                private permisoService: PermisosService,
                private tablaService: TablaService,
                private changeDetectorRefs: ChangeDetectorRef,
                private datePipe: DatePipe,
                private dialog: MatDialog
  ) { }

  ngOnInit(): void {
        this.ListaEstados();
        this.ListaTipos();
    this.inicializarForm();
    this.onListPermisos();
  }

      onRowClicked(row: any): void {
        if (this.selectedId != null && this.selectedId != row.id) {
          this.onEnableFormFields(false);
                this.mensaje = "";
        }
  
        this.selectedId = row.id;
        this.onObtieneDetallePer(this.selectedId);
  
    }
  
  
      inicializarForm(): void{
        this.formPermiso = this.fb.group({
    
                id:[],
                empresa: [this.tokenService.getCodEmpresa(), Validators.compose([Validators.required,Validators.maxLength(4)])],
                codpersonal: [this.tokenService.getCodPersonal(), Validators.compose([Validators.required,Validators.maxLength(6)])],
                fecinicio: [{ value: this.formatDate(new Date(),'2'), disabled: true },Validators.compose([Validators.required])],
                fecfin: [{ value: '', disabled: true },Validators.compose([Validators.required])],
                numdias: [{ value: 0, disabled: true }, Validators.compose([Validators.required])],
                observacion: [{ value: '', disabled: true }],
                tipo: [{ value: '', disabled: true },Validators.compose([Validators.required])],
                estado: [{ value: 'SO', disabled: true }, Validators.compose([Validators.required])],
                usucreacion: [this.tokenService.getUserName()],
                feccreacion: [new Date()],
                codigotransferencia: []
          })
  
      }
  
        ListaEstados() {
          this.tablaService.getTodosByEmpresaTipo(
            this.tokenService.getCodEmpresa(),'AUS_ESTADO'
          ).subscribe(
          (result) => {
                this.permisoEstado = result;
        
              }, error => {
                console.log(error);
              }
            );
                    
        }
  
        ListaTipos() {
          this.tablaService.getTodosByEmpresaTipo(
            this.tokenService.getCodEmpresa(),'AUS_TIPO'
          ).subscribe(
          (result) => {
                this.permisoTipo = result;
        
              }, error => {
                console.log(error);
              }
            );
                    
        }

        getDescripcionEstado(estado: string): string {
            if (!Array.isArray(this.permisoEstado)) {
              return '';
            }
  
          const estadoEncontrado = this.permisoEstado!.find(a => a.codigo === estado);
          return estadoEncontrado ? estadoEncontrado.descripcion : '';
        }
  
        getDescripcionTipo(tipo: string): string {
            if (!Array.isArray(this.permisoTipo)) {
              return '';
            }
  
          const tipoEncontrado = this.permisoTipo!.find(a => a.codigo === tipo);
          return tipoEncontrado ? tipoEncontrado.descripcion : '';
        }

    onListPermisos() {
      this.permisoService.getTodosByEmpresaPersonal(
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
  
    onObtieneDetallePer(id: number) {
      this.permisoService.getDatos(id.toString()).subscribe(
      (result) => {
        this.formPermiso.patchValue({
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
        return this.formPermiso.controls;
      }
  
    applyFilter(event: Event) {
      const filterValue = (event.target as HTMLInputElement).value;
  
      this.detalleData.filter = filterValue.trim().toLowerCase();
  
  
      if (this.detalleData.paginator) {
        this.detalleData.paginator.firstPage();
      }
    }
  
    onResetFormPermiso() {
      this.submitted = false;
      this.accionNuevo = true;
      this.selectedId = 0;
      this.formPermiso.reset();
      this.onEnableFormFields(false);
    }
  
    onEnableFormFields(isEdit: boolean): void {
      this.isEditMode = isEdit;
      if (this.isEditMode) {
        this.formPermiso.get('tipo')?.enable();
        this.formPermiso.get('fecinicio')?.enable();
  //      this.formPermiso.get('fecfin')?.enable();
        this.formPermiso.get('numdias')?.enable();
        this.formPermiso.get('observacion')?.enable();
      } else {
        this.formPermiso.get('tipo')?.disable();
        this.formPermiso.get('fecinicio')?.disable();
    //    this.formPermiso.get('fecfin')?.disable();
        this.formPermiso.get('numdias')?.disable();
        this.formPermiso.get('observacion')?.disable();
      }
     } 
  
     changeFechaDias(){
      const fecinicio = this.formPermiso.get('fecinicio')!.value;
      const numDias = this.formPermiso.get('numdias')!.value;
  
      if (fecinicio && numDias) {
        this.fFinMinimo = this.onAumentarDias(fecinicio, 1);
        this.fFinMaximo = this.onAumentarDias(fecinicio, 30); 
        this.formPermiso.get('fecfin')!.setValue(this.onAumentarDias(fecinicio, numDias));
  
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
  
      onChange(detalle: Permisos){
        this.submitted = false;
        this.accionNuevo = true;
        this.onEnableFormFields(false);
        this.mensaje= "";
    
        if (detalle.estado === 'SO') {//SOLICITADO
          this.accionNuevo = false;
          this.onEnableFormFields(true);        
          this.mensaje= "Modificando una solicitud";
        } else {
            Swal.fire('Aviso', 'Sólo se puede editar los permisos con estado Solicitado', 'warning');
        }
  
      }
  
      
      onAddNew(){
        this.onResetFormPermiso();
        this.accionNuevo = true;
        //this.inicializarForm();
       
        this.fFinMinimo = this.formatDate(new Date(),'2');
  
        this.formPermiso.patchValue({
          empresa: this.tokenService.getCodEmpresa(),
          codpersonal: this.tokenService.getCodPersonal(),
          fecinicio:this.formatDate(new Date(),'2'),
          fecfin:this.formatDate(new Date(),'2'),
          numdias:1,
          tipo: '', // Tipo por defecto al crear un nuevo permiso
          estado: 'SO', // Estado por defecto al crear un nuevo permiso
          usucreacion: this.tokenService.getUserName(),
          feccreacion: new Date(),
  
        });
  
        this.mensaje= "Registrando una nueva solicitud";
        this.onEnableFormFields(true);
      }
  
      onSubmit(){
          this.submitted = true;
          this.isProcessing = false;
          if (this.formPermiso.invalid) {
            return;
          }
        /*
          console.log("Formulario detalle with value, solo considera los campos habilitados");
          console.log(this.formPermiso.value);
          
          console.log("Formulario detalle with Rawvalue, considerar todos los campos");
          console.log(this.formPermiso.getRawValue());
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
                if (this.validaFecha( this.formPermiso.get('fecinicio')!.value,
                                  this.formPermiso.get('fecfin')!.value) != 0)
                {
                    return;
  
                };
  
                const fecinicio = new Date(this.formPermiso.get('fecinicio')!.value) ;
                const fecfin = new Date(this.formPermiso.get('fecfin')!.value);
                fecinicio.setDate(fecinicio.getDate()+1);
                fecfin.setDate(fecfin.getDate()+1);
                this.formPermiso.get("fecinicio")!.setValue(fecinicio);
                this.formPermiso.get("fecfin")!.setValue(fecfin);
                  
          /*
          console.log(this.datePipe.transform(this.formPermiso.get("fecinicio")!.value,'yyyyMMdd')?.toString()!);
          console.log(this.datePipe.transform(this.formPermiso.get("fecfin")!.value,'yyyyMMdd')?.toString()!);
            */
              const fechaIniValida = this.datePipe.transform(this.formPermiso.get("fecinicio")!.value,'yyyyMMdd')?.toString()!;
              const fechaFinValida = this.datePipe.transform(this.formPermiso.get("fecfin")!.value,'yyyyMMdd')?.toString()!; 
                /*
                console.log("Fecha Inicio: " + fechaIniValida);
                console.log("Fecha Fin: " + fechaFinValida);
                */
                  
              this.isProcessing = true;
  
              if (this.accionNuevo){
  
  
                this.permisoService.getValidaRegistro(
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
  
                        this.permisoService.create(this.formPermiso.getRawValue())
                        .subscribe(
                          (result) => {
                            if (result) {
                              this.onResetFormPermiso();
                              this.onListPermisos();
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
  
  
                this.permisoService.getValidaRegistro(
                    this.tokenService.getCodEmpresa(),
                    this.tokenService.getCodPersonal(),
                    'MODIFICA',this.formPermiso.get('id')!.value,fechaIniValida,fechaFinValida
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
  
                          this.permisoService.update(this.formPermiso.getRawValue()).subscribe(
                            (result) => {
                              if (result) {
                                this.onResetFormPermiso();
                                this.onListPermisos();
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
  
      onDelete(detalle: Permisos){
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
  
  
          
                this.permisoService.getValidaRegistro(
                    this.tokenService.getCodEmpresa(),
                    this.tokenService.getCodPersonal(),
                    'ELIMINA',this.formPermiso.get('id')!.value,'00000000','00000000'
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
  
                          this.permisoService.delete(detalle.id).subscribe(
                            (result) => {
                              this.onListPermisos();
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
