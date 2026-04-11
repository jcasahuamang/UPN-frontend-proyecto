import { TokenService } from './../../services/TokenService';
import { AnuncioService } from 'src/app/services/anuncio.service';
import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {DatePipe} from  '@angular/common';
import { IAnuncios } from 'src/app/Clases/IAnuncios';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { finalize } from 'rxjs';
import { paramRegistraAnuncioVisualiza } from 'src/app/Clases/paramRegistraAnuncioVisualiza';

@Component({
  selector: 'app-modalanuncio',
  templateUrl: './modalanuncio.component.html',
  styleUrls: ['./modalanuncio.component.css']
})
export class ModalanuncioComponent implements OnInit {

  public usuario: string;
  public empresa: string;
  public alcance: number;
  public fechaActual: string;
  public listaAnunciosAlerta: IAnuncios[];
  public currentIndex: number = 0;
  public contenidoHtml: SafeHtml="";
  public previoHtml: string ="";
  public isVisible: boolean = false;  // Initially invisible


  @Output() anuncioCerrado = new EventEmitter<void>(); 

  constructor(
    private tokenService: TokenService,
    private anuncioService: AnuncioService,
    private dialogRef: MatDialogRef<ModalanuncioComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {alcance: number|null },
    private datePipe: DatePipe,
    private sanitizer: DomSanitizer
  ) { 
//    this.usuario = data.usuario??'';
//    this.empresa = data.empresa ?? '';
    this.alcance = data.alcance ?? 1; // 0  = Obligatorio    1 = No Obligatorio

  }

  ngOnInit(): void {
    this.usuario = this.tokenService.getUserName()??'';
    this.empresa = this.tokenService.getCodEmpresa().length>0?this.tokenService.getCodEmpresa():'00';
    const hoy = new Date();
    this.fechaActual = this.datePipe.transform(hoy,'yyyyMMdd')?.toString()!;
    this.onListaAnuncios(this.usuario,this.empresa,this.alcance,this.fechaActual);

    setInterval(() => {
      this.next();
    }, 4000); // Change every 4 seconds

  }

  onListaAnuncios(usuario: string, empresa: string,alcance: number,fecha: string){

      this.anuncioService.getAnuncioAlerta(usuario,empresa,alcance,fecha)
      .pipe(finalize(()=>{
          if (this.listaAnunciosAlerta.length===0 ){
            this.anuncioCerrado.emit();
            this.dialogRef.close();          
            return
          }else{
            this.isVisible = true;
          }
      }

      )
      )
      .subscribe(
        (result)=>{
          
            this.listaAnunciosAlerta =result;
           if (result.length>0){
              this.previoHtml = this.listaAnunciosAlerta[this.currentIndex].contenido;
              this.contenidoHtml = this.sanitizer.bypassSecurityTrustHtml(this.previoHtml);  
          }          
        },error=>{
          console.log(error);
        }
      )
  }

// Method to go to the next anuncio
next() {
  if (this.currentIndex < this.listaAnunciosAlerta.length - 1) {
    this.currentIndex++;
  } else {
    this.currentIndex = 0;  // Loop back to the first anuncio
  }
  if (this.listaAnunciosAlerta.length>0){
    this.previoHtml = this.listaAnunciosAlerta[this.currentIndex].contenido;
    this.contenidoHtml = this.sanitizer.bypassSecurityTrustHtml(this.previoHtml);  
  }

}

// Method to go to the previous anuncio
previous() {
  if (this.currentIndex > 0) {
    this.currentIndex--;
  } else {
    this.currentIndex = this.listaAnunciosAlerta.length - 1;  // Loop back to the last anuncio
  }
  this.previoHtml = this.listaAnunciosAlerta[this.currentIndex].contenido;
  this.contenidoHtml = this.sanitizer.bypassSecurityTrustHtml(this.previoHtml);

}

  closeModal(): void {
        const parametro = new paramRegistraAnuncioVisualiza(
            this.listaAnunciosAlerta[this.currentIndex].id,
            this.usuario,
            this.empresa);
        this.anuncioService.registraVisualizacion(parametro)
        .pipe(finalize(
          ()=>{

            this.onListaAnuncios(this.usuario,this.empresa,this.alcance,this.fechaActual);
          }
        ))
        .subscribe(
          (result)=>{

          }
        )


  }


}
