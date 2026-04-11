import { AfterViewInit, Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements AfterViewInit,OnInit {

  constructor() { }

  year= new Date().getFullYear();

  ngOnInit(): void {
  }
  ngAfterViewInit() {
    setTimeout(() => {
      // Forzar el recalculo del alto después de la carga inicial
      window.dispatchEvent(new Event('resize'));
    }, 0);
  }

}
