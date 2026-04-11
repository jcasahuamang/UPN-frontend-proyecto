import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Prestamos } from 'src/app/Clases/Prestamos';
import { Tabla } from 'src/app/Clases/Tabla';
import { PrestamosService } from 'src/app/services/prestamos.service';
import { TablaService } from 'src/app/services/tabla.service';
import { TokenService } from 'src/app/services/TokenService';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-prestamo',
  templateUrl: './prestamo.component.html',
  styleUrls: ['./prestamo.component.css']
})
export class PrestamoComponent implements OnInit {

   public listaPrestamos: Prestamos[];
    public formPrestamo: FormGroup;
    public prestamoEstado: Tabla[];
    public prestamoTipo: Tabla[];    
   public monedaTipo: Tabla[];    
  
    public submitted = false;
    public isProcessing: boolean = false;
    public selectedId: any | null = null;
    public isEditMode: boolean = false;
    public accionNuevo: Boolean = true;
    public fFinMinimo: string;
    public fFinMaximo: string;
    public mensaje: string = "";
  
        detalleCol: string[] = ['Opciones','Tipo','Fecha Solicitud','Moneda','Importe','Cuotas','Estado','Comentarios'];
        detalleData = new MatTableDataSource(); 
    
        @ViewChild('paginatordetalle', { static: true, read: MatPaginator }) paginatordetalle: MatPaginator;
        
        @ViewChild('closebutton') modal: ElementRef;
  


  constructor(
        private router:Router,
            private fb: FormBuilder,
                private tokenService: TokenService,
                private prestamoService: PrestamosService,
                private tablaService: TablaService,
                private changeDetectorRefs: ChangeDetectorRef,
                private datePipe: DatePipe,
                private dialog: MatDialog

  ) { }

  ngOnInit(): void {
    this.ListaEstados();
    this.ListaTipos();
    this.ListaMonedas();
    this.inicializarForm();
    this.onListPrestamos();

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
          this.formPrestamo = this.fb.group({
      
                  id:[],
                  empresa: [this.tokenService.getCodEmpresa(), Validators.compose([Validators.required,Validators.maxLength(4)])],
                  codpersonal: [this.tokenService.getCodPersonal(), Validators.compose([Validators.required,Validators.maxLength(6)])],
                  tipo: [{ value: '', disabled: true },Validators.compose([Validators.required])],
                  fecsolicitud: [{ value: this.formatDate(new Date(),'2'), disabled: true },Validators.compose([Validators.required])],
                  moneda: [{ value: '01', disabled: true }, Validators.compose([Validators.required])],
                  importe: [{ value: 0, disabled: true }, Validators.compose([Validators.required])],
                  cuotas: [{ value: 0, disabled: true }, Validators.compose([Validators.required])],
                  observacion: [{ value: '', disabled: true }],
                  estado: [{ value: 'SO', disabled: true }, Validators.compose([Validators.required])],
                  usucreacion: [this.tokenService.getUserName()],
                  feccreacion: [new Date()],
                  codigotransferencia: []
            })
    
        }
    
          ListaEstados() {
            this.tablaService.getTodosByEmpresaTipo(
              this.tokenService.getCodEmpresa(),'PREST_ESTADO'
            ).subscribe(
            (result) => {
                  this.prestamoEstado = result;
          
                }, error => {
                  console.log(error);
                }
              );
                      
          }
    
          ListaTipos() {
            this.tablaService.getTodosByEmpresaTipo(
              this.tokenService.getCodEmpresa(),'PREST_TIPO'
            ).subscribe(
            (result) => {
                  this.prestamoTipo = result;
          
                }, error => {
                  console.log(error);
                }
              );
                      
          }

          ListaMonedas() {
            this.tablaService.getTodosByEmpresaTipo(
              this.tokenService.getCodEmpresa(),'MAE_MONEDA'
            ).subscribe(
            (result) => {
                  this.monedaTipo = result;
          
                }, error => {
                  console.log(error);
                }
              );
                      
          }
          
  
          getDescripcionEstado(estado: string): string {
              if (!Array.isArray(this.prestamoEstado)) {
                return '';
              }
    
            const estadoEncontrado = this.prestamoEstado!.find(a => a.codigo === estado);
            return estadoEncontrado ? estadoEncontrado.descripcion : '';
          }
    
          getDescripcionTipo(tipo: string): string {
              if (!Array.isArray(this.prestamoTipo)) {
                return '';
              }
    
            const tipoEncontrado = this.prestamoTipo!.find(a => a.codigo === tipo);
            return tipoEncontrado ? tipoEncontrado.descripcion : '';
          }

           getDescripcionMoneda(tipo: string): string {
              if (!Array.isArray(this.monedaTipo)) {
                return '';
              }
    
            const tipoEncontrado = this.monedaTipo!.find(a => a.codigo === tipo);
            return tipoEncontrado ? tipoEncontrado.descripcion : '';
          }
  
      onListPrestamos() {
        this.prestamoService.getTodosByEmpresaPersonal(
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
        this.prestamoService.getDatos(id.toString()).subscribe(
        (result) => {
          this.formPrestamo.patchValue({
                  id: result.id,
                  empresa: result.empresa,
                  codpersonal: result.codpersonal,
                  tipo: result.tipo,
                  fecsolicitud: this.formatDate(new Date(result.fecsolicitud),'2'),
                  moneda: result.moneda,
                  importe: result.importe,
                  cuotas: result.cuotas,
                  observacion: result.observacion,
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
          return this.formPrestamo.controls;
        }
    
      applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
    
        this.detalleData.filter = filterValue.trim().toLowerCase();
    
    
        if (this.detalleData.paginator) {
          this.detalleData.paginator.firstPage();
        }
      }
    
      onResetFormPrestamo() {
        this.submitted = false;
        this.accionNuevo = true;
        this.selectedId = 0;
        this.formPrestamo.reset();
        this.onEnableFormFields(false);
      }
    
      onEnableFormFields(isEdit: boolean): void {
        this.isEditMode = isEdit;
        if (this.isEditMode) {
          this.formPrestamo.get('tipo')?.enable();
          this.formPrestamo.get('fecsolicitud')?.enable();
          this.formPrestamo.get('moneda')?.enable();
          this.formPrestamo.get('importe')?.enable();
          this.formPrestamo.get('cuotas')?.enable();
          this.formPrestamo.get('observacion')?.enable();
        } else {
          this.formPrestamo.get('tipo')?.disable();
          this.formPrestamo.get('fecsolicitud')?.disable();
          this.formPrestamo.get('moneda')?.disable();
          this.formPrestamo.get('importe')?.disable();
          this.formPrestamo.get('cuotas')?.disable();
          this.formPrestamo.get('observacion')?.disable();
        }
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
 
      onChange(detalle: Prestamos){
        this.submitted = false;
        this.accionNuevo = true;
        this.onEnableFormFields(false);
        this.mensaje= "";
    
        if (detalle.estado === 'SO') {//SOLICITADO
          this.accionNuevo = false;
          this.onEnableFormFields(true);        
          this.mensaje= "Modificando una solicitud";
        } else {
            Swal.fire('Aviso', 'Sólo se puede editar los prestamos con estado Solicitado', 'warning');
        }
  
      }

      onAddNew(){
        this.onResetFormPrestamo();
        this.accionNuevo = true;
        //this.inicializarForm();
       
        this.fFinMinimo = this.formatDate(new Date(),'2');
  
        this.formPrestamo.patchValue({
          empresa: this.tokenService.getCodEmpresa(),
          codpersonal: this.tokenService.getCodPersonal(),
          tipo: '', 
          fecsolicitud:this.formatDate(new Date(),'2'),
          moneda:'01',
          importe:0,
          cuotas:1,
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
          if (this.formPrestamo.invalid) {
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
 
                const fecinicio = new Date(this.formPrestamo.get('fecsolicitud')!.value) ;
                fecinicio.setDate(fecinicio.getDate()+1);
                this.formPrestamo.get("fecsolicitud")!.setValue(fecinicio);
                  
              const fechaIniValida = this.datePipe.transform(this.formPrestamo.get("fecsolicitud")!.value,'yyyyMMdd')?.toString()!;
                /*
                console.log("Fecha Inicio: " + fechaIniValida);
                console.log("Fecha Fin: " + fechaFinValida);
                */
                  
              this.isProcessing = true;

              if (this.accionNuevo){


                this.prestamoService.getValidaRegistro(
                    this.tokenService.getCodEmpresa(),
                    this.tokenService.getCodPersonal(),
                    'NUEVO',0,fechaIniValida,
                    this.formPrestamo.get('moneda')!.value,
                    this.formPrestamo.get('importe')!.value,                    
                    this.formPrestamo.get('cuotas')!.value                    
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

                        this.prestamoService.create(this.formPrestamo.getRawValue())
                        .subscribe(
                          (result) => {
                            if (result) {
                              this.onResetFormPrestamo();
                              this.onListPrestamos();
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
    

                this.prestamoService.getValidaRegistro(
                    this.tokenService.getCodEmpresa(),
                    this.tokenService.getCodPersonal(),
                    'MODIFICA',this.formPrestamo.get('id')!.value,fechaIniValida,
                    this.formPrestamo.get('moneda')!.value,
                    this.formPrestamo.get('importe')!.value,                    
                    this.formPrestamo.get('cuotas')!.value
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

                          this.prestamoService.update(this.formPrestamo.getRawValue()).subscribe(
                            (result) => {
                              if (result) {
                                this.onResetFormPrestamo();
                                this.onListPrestamos();
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


      onDelete(detalle: Prestamos){
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
          
                this.prestamoService.getValidaRegistro(
                    this.tokenService.getCodEmpresa(),
                    this.tokenService.getCodPersonal(),
                    'ELIMINA',this.formPrestamo.get('id')!.value,'00000000',
                    '01',0,0
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
  
                          this.prestamoService.delete(detalle.id).subscribe(
                            (result) => {
                              this.onListPrestamos();
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
  

      preventInvalidKeys(event: KeyboardEvent): void {
      const invalidKeys = ['e', 'E', '+', '-', ' '];
      if (invalidKeys.includes(event.key)) {
        event.preventDefault();
      }
    }

    formatImporteRealTime(event: Event): void {
      const input = event.target as HTMLInputElement;
      const rawValue = input.value;

      // Elimina cualquier carácter que no sea número o punto decimal
      const numericValue = rawValue.replace(/[^0-9.]/g, '');

      // Evita múltiples puntos decimales
      const parts = numericValue.split('.');
      if (parts.length > 2) {
        input.value = rawValue.slice(0, -1); // elimina el último carácter
        return;
      }

      const numberValue = parseFloat(numericValue);

      if (!isNaN(numberValue)) {
        // Formatear con separadores de miles y dos decimales
        const formatted = numberValue.toLocaleString('en-US', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });

        input.value = formatted;

        // Actualiza el formControl (sin formato)
        this.formPrestamo.get('importe')?.setValue(numberValue);
      } else {
        // Si el valor es inválido, limpia el control
        this.formPrestamo.get('importe')?.setValue(null);
      }
    }

      
}
