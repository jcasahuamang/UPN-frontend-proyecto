import { OnInit, ViewChild, ElementRef, Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Parametro } from 'src/app/Clases/parametro';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-contadorsesion',
  templateUrl: './contadorsesion.component.html',
  styleUrls: ['./contadorsesion.component.css']
})
export class ContadorsesionComponent implements OnInit {
  public hours: number = 0;
  public minutes: number = 0;
  public seconds: number = 0;
  private timer: any;
  private date = new Date();
  @Input() reinicia?:number= 0;

  constructor(private router:Router) { }

  ngOnInit(): void {
    this.hours = 0;
    this.minutes = 10;
    this.seconds = 0;
    this.start();
 }

  start() {
    if ( this.minutes > 0 || this.seconds > 0) {

      this.updateTimer();

      if(this.seconds > 0){
        this.timer = setInterval(() => {
          this.updateTimer();
        }, 1000);
      }
    }
  }

  updateTimer() {

    this.date.setHours(this.hours);
    this.date.setMinutes(this.minutes);
    this.date.setSeconds(this.seconds);
    this.date.setMilliseconds(0);
    const time = this.date.getTime();
    this.date.setTime(time - 1000);  //---

    this.hours = this.date.getHours();
    this.minutes = this.date.getMinutes();
    this.seconds = this.date.getSeconds();

    if (this.date.getHours() === 0 &&
      this.date.getMinutes() === 0 &&
      this.date.getSeconds() === 0) {
      //stop interval
      clearInterval(this.timer);
      setTimeout(() => {
        this.stop();
      }, 5000);
    }
  }

  stop() {
    clearInterval(this.timer);
    console.log('Termino');
    var strUrl: string = Parametro.SISTEMA_BASE;
    Swal.fire('Aviso', 'Su sesion ha terminado, vuelva a ingresar', 'warning');
    setTimeout( function() { window.location.href = strUrl; }, 3000 );
    //this.router.navigateByUrl('/login');
    //this.reset();
  }

  reset() {
    this.hours = 0;
    this.minutes = 10;
    this.seconds = 0;
    this.start();
  }
}
