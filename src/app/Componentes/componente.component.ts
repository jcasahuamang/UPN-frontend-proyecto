import { DatePipe } from '@angular/common';
import { TokenService } from './../services/TokenService';
import { AnuncioService } from './../services/anuncio.service';
import { MatDialog } from '@angular/material/dialog';
import { Component, OnInit } from '@angular/core';
import { ModalanuncioComponent } from './modalanuncio/modalanuncio.component';

@Component({
  selector: 'app-componente',
  templateUrl: './componente.component.html',
  styleUrls: ['./componente.component.css']
})
export class ComponenteComponent implements OnInit {

  constructor(private dialog: MatDialog,
    private anuncioService: AnuncioService,
    private tokenService: TokenService,
    private datePipe: DatePipe
  ) { 

  }

  ngOnInit(): void {

    this.onAnuncio();
  }

    onAnuncio(){
      let usuario = this.tokenService.getUserName()??'';
      let empresa = this.tokenService.getCodEmpresa().length>0?this.tokenService.getCodEmpresa():'00';
//    let alcance: number = 0;   // 0  = interno    1 = externo
      let alcance: number = 0;   // 0  = Obligatorio    1 = No Obligatorio

      const hoy = new Date();
      const fechaActual = this.datePipe.transform(hoy,'yyyyMMdd')?.toString()!;
  
      this.anuncioService.getAnuncioAlerta(usuario,empresa,alcance,fechaActual)
      .subscribe(
        (result)=>{
          if (result.length>0){
                    const dialogRef = this.dialog.open(ModalanuncioComponent, {
                      width: '80vw',  // 90% del ancho de la ventana
                      maxWidth: '1000px', // Limita el ancho máximo
                      height: '130vh',  // 80% de la altura de la ventana
                      maxHeight: '580px', // Limita la altura máxima
                      panelClass: 'custom-modal',
                      disableClose: true,  // Prevenir el cierre al hacer clic fuera o presionar ESC
                      data: {
                        alcance: alcance
                      }
                    });
                    //To detect when anuncioCerrado event is emmited
                    dialogRef.componentInstance.anuncioCerrado.subscribe(
                      () => {
                    //   execute any other method
                      }
                    )
                    //To detect if user clicks the area outside
                    dialogRef.backdropClick().subscribe(()=>{
                    //   execute any other method
                    })
          }
        }  
      )
  

    }
}
