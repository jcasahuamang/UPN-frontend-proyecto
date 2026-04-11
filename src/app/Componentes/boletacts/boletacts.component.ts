import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ParamRegistraVisualiza } from 'src/app/Clases/paramregistravisualiza';
import { Configuracion } from 'src/app/services/configuracion-global';
import { ConfiguracionService } from 'src/app/services/configuracion.service';
import { PersonalService } from 'src/app/services/personal.service';
import { TokenService } from 'src/app/services/TokenService';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-boletacts',
  templateUrl: './boletacts.component.html',
  styleUrls: ['./boletacts.component.css']
})
export class BoletactsComponent implements OnInit {
  public filtroForm: FormGroup;
  public numdocidentidadpersonal: string;
  paramRegistraVisualiza: ParamRegistraVisualiza;
  isProcessing: boolean = false;
  public mesesLista?: any[];
  isVisualiza: boolean = false;
  isDescarga: boolean = false;

  constructor(private personalService: PersonalService,
    private configuracionService: ConfiguracionService,
      private tokenService: TokenService,
      private fb: FormBuilder) { }

  ngOnInit(): void {
    this.inicializarForm();
    this.ListaMeses();
  }

      ListaMeses() {
        this.mesesLista = new Configuracion().mesesCts;
      }
    inicializarForm(): void{
      this.filtroForm = this.fb.group({
        year: ['', Validators.compose([Validators.required])],
        month: ['00', Validators.required],
       })
    }

    onResetForm() {
      this.isProcessing = false;
      this.isVisualiza = false;
      this.isDescarga = false;
      this.filtroForm.reset();
      this.filtroForm.get("year")!.setValue("");
      this.filtroForm.get("month")!.setValue("00");
    }

  onGenerarPDF(tipo: string) {
    this.isProcessing = false;
    this.isVisualiza = false;
    this.isDescarga = false;

    if (!this.filtroForm.valid || this.filtroForm.get('month')!.value === '00') {
      this.alerta('Aviso','Debe ingresar el año y mes correctamente');
//      Swal.fire('Aviso', 'Debe ingresar el año y mes correctamente', 'warning');
//      alert("Debe ingresar el año y mes correctamente");
      return;
    }
    
    if (!this.tokenService.isCodificado()) {
        this.alerta('Aviso','Su usuario no tiene configurado un código de personal');
          return;
        }
        this.numdocidentidadpersonal = ''; 

          //Obteniendo el numero de doc de identidad
          this.personalService.getDatos(this.tokenService.getCodEmpresa(),this.tokenService.getCodPersonal(),
                          this.tokenService.getUserName()).subscribe(
          (result) => {
              this.numdocidentidadpersonal = result.numdocidentidad;
  
              this.personalService.getPersonalValidaVisualizacion(
                    this.tokenService.getCodEmpresa(),
                    this.filtroForm.get('year')!.value,
                    this.filtroForm.get('month')!.value,
                    '001',
                    this.tokenService.getCodPersonal(),
                    this.tokenService.getUserName(),
                    this.numdocidentidadpersonal,'CTS').
                    subscribe(
                (valor) => {
                  if(valor===0)//Si es cero significa que se puede generar la boleta
                    { 
        
                      this.isProcessing = true;
                      if (tipo === 'Descarga'){ this.isDescarga = true;}  
                      if (tipo === 'Visualiza'){ this.isVisualiza = true;}
  
                        //Generando la boleta de cts
                        this.personalService.getPersonalBoletaCts(
                          this.tokenService.getCodEmpresa(),
                          this.filtroForm.get('year')!.value,
                          this.filtroForm.get('month')!.value,
                          this.tokenService.getCodPersonal()).subscribe(
                          (result) => {
                    
                          
                              if (result.size === 0) {// Verificar si el archivo PDF está vacío
                                this.isProcessing = false;
                                alert("El archivo PDF generado está vacío.");
                                return;
                              }
                              
                              if (tipo === 'Descarga'){  
                                const url = window.URL.createObjectURL(result);
                                // Crear un enlace temporal para forzar la descarga
                                const link = document.createElement('a');
                                link.href = url;
                                link.target = '_blank';  // Abrir en una nueva pestaña

                                // Establecer el nombre del archivo PDF para la descarga (si lo deseas)
                                link.download = 'BoletaCTS'+this.numdocidentidadpersonal+'.pdf';  // Puedes cambiar 'archivo.pdf' por el nombre que desees

                                // Simular un clic en el enlace para iniciar la descarga
                                link.click();

                                // Liberar el objeto URL después de usarlo
                                window.URL.revokeObjectURL(url);
                                this.isProcessing = false;
                                    // El PDF se cargó correctamente
        //                                      alert("El PDF CTS se ha cargado correctamente.");                                         

                                            this.paramRegistraVisualiza = new ParamRegistraVisualiza(
                                              this.tokenService.getCodEmpresa(),
                                              this.filtroForm.get('year')!.value.toString(),
                                              this.filtroForm.get('month')!.value,
                                              this.tokenService.getCodPersonal(),
                                              this.tokenService.getUserName(),
                                              this.numdocidentidadpersonal,'CTS');
                                    
                                              this.onResetForm();
                                              //Registrando en la tabla de auditoria
                                              this.configuracionService.registraVisualizacion(this.paramRegistraVisualiza).subscribe(
                                                (result)=>{
                                                  if (result.valueOf() === 1){
                                                  }
                                                }, error => {
                                                  this.isProcessing = false;
                                                  console.log(error);
                                                }
                                              );
                              }

                              if (tipo === 'Visualiza'){
                                  const url = window.URL.createObjectURL(result);//     window.open(url);
                                  const modal = document.getElementById('pdfModal') as HTMLElement;
                                  const pdfViewer = document.getElementById('pdfViewer') as HTMLEmbedElement;
                                  pdfViewer.src = url;  // Establecer la URL del PDF en el <embed> para mostrarlo
                                  modal.style.display = 'block';         // Mostrar el modal con el PDF

                                  pdfViewer.onload = () => {
                                    this.isProcessing = false;
                                    // El PDF se cargó correctamente
        //                                      alert("El PDF CTS se ha cargado correctamente.");                                         

                                            this.paramRegistraVisualiza = new ParamRegistraVisualiza(
                                              this.tokenService.getCodEmpresa(),
                                              this.filtroForm.get('year')!.value.toString(),
                                              this.filtroForm.get('month')!.value,
                                              this.tokenService.getCodPersonal(),
                                              this.tokenService.getUserName(),
                                              this.numdocidentidadpersonal,'CTS');
                                    
                                              this.onResetForm();
                                              //Registrando en la tabla de auditoria
                                              this.configuracionService.registraVisualizacion(this.paramRegistraVisualiza).subscribe(
                                                (result)=>{
                                                  if (result.valueOf() === 1){
                                                  }
                                                }, error => {
                                                  this.isProcessing = false;
                                                  console.log(error);
                                                }
                                              );
                                            

                                    // Aquí puedes agregar cualquier lógica adicional que desees, como un mensaje de éxito en la interfaz.
                                  };
                              }
                          }, error => {
                            this.isProcessing = false;
                            console.log(error);
                          });
                  }else{
                      if (valor ===1){
                        this.isProcessing = false;
                        this.alerta('Aviso','La visualización de documentos aún no esta habilitada para este periodo');
                       }else{
                        if (valor===2){
                          this.isProcessing = false;
                          this.alerta('Aviso','No existe información para este periodo');
                        }else{
                          this.isProcessing = false;
                          this.alerta('Aviso','No se puede generar el documento');
                        }
                      }
                  }              
                  
                  
                }, error => {
                  this.isProcessing = false;
                  console.log(error);
                });
      
          }, error => {
            this.isProcessing = false;
            console.log(error);
          }
          );
  
        /*******************************************************************/
        




  }

    // Función para cerrar el modal
    closePdfModal() {
      const modal = document.getElementById('pdfModal') as HTMLElement;
      const pdfViewer = document.getElementById('pdfViewer') as HTMLEmbedElement;
      // Ocultar el modal y limpiar la URL del PDF
      modal.style.display = 'none';
      pdfViewer.src = '';
      this.onResetForm();
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
