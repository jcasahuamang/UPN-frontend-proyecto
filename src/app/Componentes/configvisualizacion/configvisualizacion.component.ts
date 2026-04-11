import { EmpresaService } from 'src/app/services/empresa.service';
import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MaeEmpresas } from 'src/app/Clases/maeempresa';
import { ConfiguracionService } from 'src/app/services/configuracion.service';
import { PeriodoVisualizacion } from 'src/app/Clases/periodovisualizacion';
import Swal from 'sweetalert2';
import { ParamConfiguraVisualiza } from 'src/app/Clases/paramconfigvisualiza';
import {  Planillas } from 'src/app/Clases/planillas';
import { finalize } from 'rxjs';
import { Configuracion } from 'src/app/services/configuracion-global';

@Component({
  selector: 'app-configvisualizacion',
  templateUrl: './configvisualizacion.component.html',
  styleUrls: ['./configvisualizacion.component.css']
})
export class ConfigvisualizacionComponent implements OnInit {

  public filtroForm: FormGroup;
  public detalle: PeriodoVisualizacion = new PeriodoVisualizacion();
  public listaEmpresas: MaeEmpresas[];
  paramConfiguraVisualiza: ParamConfiguraVisualiza;
  public listaPlanillas: Planillas[];
  isProcessing: boolean = false;
  public listaDocumentos?: any[];
  public selectedId: any | null = null;

  detalleCol: string[] = ['Opciones', 'Empresa','Planilla','Documento','Periodo','Estado'];
  detalleData = new MatTableDataSource(); 

  @ViewChild('paginatordetalle', { static: true, read: MatPaginator }) paginatordetalle: MatPaginator;
  @ViewChild('closeDetalle') modalDetalle: ElementRef;

  constructor(private changeDetectorRefs: ChangeDetectorRef,private fb: FormBuilder,
    private empresaService: EmpresaService,
    private configuracionService: ConfiguracionService
  ) { }

  ngOnInit(): void {
    this.inicializarForm();
    this.ListCompanias();
    this.ListPlanillas();
    this.ListaDocumentosTrab();
  }

   onRowClicked(row: any): void {
         this.selectedId = row.desperiodo;
  }

    ListaDocumentosTrab() {
      this.listaDocumentos = new Configuracion().documentosTrabajador;
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
    
    inicializarForm(): void{
      this.filtroForm = this.fb.group({
        empresa: ['00', Validators.compose([Validators.required])],
        planilla: ['00', Validators.required],        
        documento: ['00', Validators.required],
        year: ['', Validators.compose([Validators.required])],
//        month: ['00', Validators.required],        
       })
    }

    onResetForm() {
      this.isProcessing = false;
      this.filtroForm.reset();
      this.filtroForm.get("empresa")!.setValue("00");
      this.filtroForm.get("planilla")!.setValue("00");
      this.filtroForm.get("documento")!.setValue("00");
      this.filtroForm.get("year")!.setValue("");            
    }

  onHabilitar(detalle:PeriodoVisualizacion){

        this.paramConfiguraVisualiza = new ParamConfiguraVisualiza(
          detalle.empresa,detalle.anoproceso,
          detalle.mesproceso,detalle.planilla,
          detalle.documento,"INS"
        );

        this.configuracionService.configuraVisualizacion(this.paramConfiguraVisualiza).subscribe(
          (result)=>{
            if (result.valueOf() === 1){
              this.onFiltrar();
              this.changeDetectorRefs.detectChanges();
              this.toastAcceptedAlert("Se Habilito el periodo seleccionado");
            }
          }, error => {
            console.log(error);
          }
        );

    
  }

  onDeshabilitar(detalle: PeriodoVisualizacion){
          this.paramConfiguraVisualiza = new ParamConfiguraVisualiza(
            detalle.empresa,detalle.anoproceso,
            detalle.mesproceso,detalle.planilla,
            detalle.documento,"DEL"
          );

          this.configuracionService.configuraVisualizacion(this.paramConfiguraVisualiza).subscribe(
            (result)=>{
              if (result.valueOf() === 1){
                this.onFiltrar();
                this.changeDetectorRefs.detectChanges();
                this.toastAcceptedAlert("Se Deshabilito el periodo seleccionado");
              }
            }, error => {
              console.log(error);
            }
          );
  }


  onExportExcel(){

  }

  onFiltrar(){
    this.isProcessing = false;
    if (this.filtroForm.get('empresa')!.value === '00' || this.filtroForm.get('planilla')!.value === '00'
            || this.filtroForm.get('documento')!.value === '00' ) {
       this.alerta('Aviso','Debe seleccionar los valores correctos');
       return;
    }

    if (this.filtroForm.get('documento')!.value != '5TA' && 
         (this.filtroForm.get('year')!.value === null || this.filtroForm.get('year')!.value ==='') ) {

        this.alerta('Aviso','Debe seleccionar el año');
        return;
      }

      if (this.filtroForm.get('year')!.value === null || this.filtroForm.get('year')!.value ===''){
        this.filtroForm.get('year')!.setValue("0000"); 
      }
      this.isProcessing = true;
      this.configuracionService.getPeriodo(
        this.filtroForm.get('empresa')!.value,
        this.filtroForm.get('planilla')!.value,
        this.filtroForm.get('documento')!.value,
        this.filtroForm.get('year')!.value              
      ).pipe(finalize(()=>{
        this.isProcessing = false;
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

}
