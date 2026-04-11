import { Component, OnInit } from '@angular/core';
import { Parametro } from 'src/app/Clases/parametro';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.css']
})
export class ErrorComponent implements OnInit {
  public strURLBASE: String = Parametro.SISTEMA_BASE;
  constructor() { }

  ngOnInit(): void {
  }

}
