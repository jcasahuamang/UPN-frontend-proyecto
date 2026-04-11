import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { finalize } from 'rxjs';
import { MaeEmpresas } from 'src/app/Clases/maeempresa';
import { Planillas } from 'src/app/Clases/planillas';
import { Configuracion } from 'src/app/services/configuracion-global';
import { ConfiguracionService } from 'src/app/services/configuracion.service';
import { EmpresaService } from 'src/app/services/empresa.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-auditoria',
  templateUrl: './auditoria.component.html',
  styleUrls: ['./auditoria.component.css']
})
export class AuditoriaComponent implements OnInit {

  public filtroForm: FormGroup;
  public listaEmpresas: MaeEmpresas[];
 public listaPlanillas: Planillas[];
 public isProcessing: boolean = false;
 public mesesLista?: any[];
 public listaDocumentos?: any[];

  constructor(private fb: FormBuilder,
        private empresaService: EmpresaService,
        private configuracionService: ConfiguracionService
  ) { }

  ngOnInit(): void {
    this.inicializarForm();
    this.ListCompanias();
    this.ListPlanillas();
    this.ListaMeses();
    this.ListaDocumentosTrab();
  }

  ListaMeses() {
    this.mesesLista = new Configuracion().meses;
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
          empresa: ['0000', Validators.compose([Validators.required])],
          planilla: ['00', Validators.required],        
          documento: ['000', Validators.required],
          year: ['', Validators.compose([Validators.required])],
          month: ['00', Validators.required],        
         })
      }

      onResetForm() {
        this.isProcessing = false;
        this.filtroForm.reset();
        this.filtroForm.get("empresa")!.setValue("0000");
        this.filtroForm.get("planilla")!.setValue("00");
        this.filtroForm.get("documento")!.setValue("000");
        this.filtroForm.get("year")!.setValue("");
        this.filtroForm.get("month")!.setValue("00");            
      }


      onExportar(){
        this.isProcessing = false;
            if (this.filtroForm.get('empresa')!.value === '0000' ) {
              Swal.fire({
                title: 'Aviso',
                text: 'Debe seleccionar la empresa',
                icon: 'warning',
                width: '350px',  // Establecer el ancho del popup
                padding: '10px', // Ajustar el padding para que el contenido quede bien dentro
                backdrop: true,  // Mantener el fondo de la ventana oscurecido
                confirmButtonText: 'Aceptar', // Botón de confirmación
              });
              return;
            }

            if (this.filtroForm.get('year')!.value === null || this.filtroForm.get('year')!.value ===''){
              this.filtroForm.get('year')!.setValue("0000"); 
            }

            this.isProcessing = true;
            this.configuracionService.getExcelAuditoriaConsultaDoc(
              this.filtroForm.get('empresa')!.value,
              this.filtroForm.get('planilla')!.value,
              this.filtroForm.get('year')!.value,
              this.filtroForm.get('month')!.value,
              this.filtroForm.get('documento')!.value).pipe(finalize(()=>{
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
}
