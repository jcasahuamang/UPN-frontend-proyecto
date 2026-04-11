import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ActivationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import {map, filter} from 'rxjs/operators';
import { interval } from 'rxjs/internal/observable/interval';


@Component({
  selector: 'app-breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
  styleUrls: ['./breadcrumbs.component.css']
})
export class BreadcrumbsComponent implements OnDestroy {

  public titulo?:string;
  public reinicia?:number;
  public tituloSubs$:Subscription;
  public reiniciaSubs$:Subscription;
  @Input() showContador:number = 0;

  constructor(public router:Router) {
    this.tituloSubs$ = this.getArgumentos().subscribe(({titulo})=>{
      this.titulo = titulo;
      document.title = `Kiosko Multimedia - ${titulo}`;
    })

    this.reiniciaSubs$ = this.getArgumentos().subscribe(({reiniciar})=>{
      this.reinicia = reiniciar;
    })
   }

  ngOnDestroy(): void {
    this.tituloSubs$.unsubscribe();
  }

  getArgumentos(){
    return this.router.events.pipe(
      filter((event:any) => event instanceof ActivationEnd),
      filter((event:ActivationEnd)=> event.snapshot.firstChild === null),
      map(  (event:ActivationEnd)=> event.snapshot.data)
    );
  }

}
