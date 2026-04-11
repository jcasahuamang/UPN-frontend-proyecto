import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-modulos',
  templateUrl: './modulos.component.html',
  styleUrls: ['./modulos.component.css']
})
export class ModulosComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
    sessionStorage.setItem('showmenu','0');
  }

  redireccion(menu:string){
    var nomusr:string = sessionStorage.getItem('usuario')?.toString() || ''; ;
    if ( menu == '1'){
      if ( nomusr == 'ysolis') {
        sessionStorage.setItem('menu','1');
      }else {
        sessionStorage.setItem('menu','3');
      }
    }
    if ( menu == '2'){
      sessionStorage.setItem('menu','2');
    }
    if ( menu == '3') {
      sessionStorage.setItem('menu','4');
    }
    sessionStorage.setItem('showmenu','1');
    sessionStorage.setItem('carga', '0');
    this.router.navigateByUrl('/dashboard');
  }

}
