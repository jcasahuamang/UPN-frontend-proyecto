import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ChartOptions, DeepPartial, IChartApi, SeriesMarker, Time, UTCTimestamp, createChart } from 'lightweight-charts';
import { Subscription, combineLatest, fromEvent, interval, startWith, switchMap, takeUntil } from 'rxjs';
import { CandleChartData as CandleChartData } from 'src/app/Clases/candle-chart-data';
import { DashboardChartsService } from 'src/app/services/dashboard-charts.service';
import { DatePipe } from '@angular/common';
import { PieChartService } from 'src/app/services/pie-chart.service';
import { PieChartData } from 'src/app/Clases/pie-chart-data';
declare var google: any;

@Component({
  selector: 'app-dashboard-charts',
  templateUrl: './dashboard-charts.component.html',
  styleUrls: ['./dashboard-charts.component.css']
})
export class DashboardChartsComponent implements OnInit, AfterViewInit {
  @ViewChild('chartContainer', { static: true }) chartContainer: ElementRef;
  @ViewChild('pieChartTotal') pieChartTotal: ElementRef;
  @ViewChild('pieChartAsistencia') pieChartAsistencia: ElementRef;
  public item: PieChartData = new PieChartData();
  isVisible: boolean = false;

  constructor(private datePipe: DatePipe, private dashboardChartsService: DashboardChartsService, private pieChartService: PieChartService) {
    this.oldSelectedDate = new Date();
    this.selectedDate = new Date();
  }

  public samplePoint = (i: number) => Math.round(Math.random()) * 2 - 1;
  public count: number = 0;
  selectedDate: Date;
  oldSelectedDate: Date;
  data: CandleChartData[] = [];
  chart: IChartApi;
  container: any;
  private subscription: Subscription;

  public pieChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: function (context: any) {
            let label = context.label || '';
            if (label) {
              label += ': ';
            }
            if (context.raw !== null) {
              label += new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
              }).format(context.raw);
            }
            return label;
          },
        },
      },
    },
  };

  public pieChartLabels: string[] = ['Red', 'Blue', 'Yellow'];
  public pieChartData: number[] = [300, 500, 100];
  public pieChartType = 'pie';

  /* public chartData: ChartData[] = [
    { fecha: '2024-05-25T08:00:00', tipo: 'Puntual', nombre: 'Juan' },
    { fecha: '2024-05-25T08:30:00', tipo: 'Puntual', nombre: 'María' },
    { fecha: '2024-05-25T08:45:00', tipo: 'Tardanza', nombre: 'Pedro' },
    { fecha: '2024-05-25T09:00:00', tipo: 'Puntual', nombre: 'Laura' },
    { fecha: '2024-05-25T09:30:00', tipo: 'Tardanza', nombre: 'Carlos' },
  ]; */

  toggleVisibility(): void {
    this.isVisible = !this.isVisible;
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    // Cancelar la suscripción al destruir el componente para evitar fugas de memoria
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  getFormattedDate(): string {
    const fecha = this.datePipe.transform(this.selectedDate, 'yyyyMMdd')!;
    console.log(fecha);
    return fecha;
  }

  playSound(): void {
    const audio = new Audio('assets/sounds/beep-sound-8333.mp3');
    audio.play();
  }

  ngAfterViewInit(): void {

    const unloadEvent$ = fromEvent(window, 'unload');

    if (this.subscription) {
      this.subscription.unsubscribe();
    }

    this.updateChart(this.data);

    this.subscription = interval(5000)
      .pipe(
        startWith(0),
        switchMap(() =>
          combineLatest([
            this.dashboardChartsService.getCandleChartData(this.getFormattedDate()),
            this.pieChartService.getPieChartData(this.getFormattedDate())
          ])
        ),
        takeUntil(unloadEvent$)
      )
      .subscribe(([candleData, pieData]: [CandleChartData[], PieChartData]) => {
        console.count("Iteración");

        if (candleData.length !== this.count || this.selectedDate !== this.oldSelectedDate) {
          this.playSound();
          this.chart.remove();
          this.count = candleData.length;
          this.oldSelectedDate = this.selectedDate;

          const existingButtonsContainer = this.container.querySelector('.buttons-container');

          if (existingButtonsContainer) {
            this.container.removeChild(existingButtonsContainer);
          }

          this.updateChart(candleData);
          this.actualizarPie(pieData);
        }
      });
  }

  actualizarPie(pieData: PieChartData) {
    console.log(pieData);

    const drawChart = () => {

      const data = google.visualization.arrayToDataTable([
        ['Concepto', 'Cantidad'],
        /* ['Marca', pieData.totPersonalMarca], */
        ['Asistencia', pieData.totPersonalMarcaAsistencia],
        ['Falta', pieData.totPersonalFalta],
        ['Permisos', pieData.totPersonalPermisos],
        /* ['Tardanzas', pieData.totPersonalTardanzas] */
      ]);

      const dataAsistencia = google.visualization.arrayToDataTable([
        ['Concepto', 'Cantidad'],
        /* ['Marca', pieData.totPersonalMarca], */
        ['Puntuales', (pieData.totPersonalMarca - pieData.totPersonalTardanzas)],
        ['Tardanzas', pieData.totPersonalTardanzas]
      ]);

      const options = {
        title: 'Total',
        backgroundColor: '#F4F6F9',
        legend: { position: 'top' },
        /* is3D: true, */
        pieHole: 0.4,
      };

      const optionsAsistencia = {
        title: 'Asistencias',
        backgroundColor: '#F4F6F9',
        legend: { position: 'top' },
        /* is3D: true, */
        pieHole: 0.4,
      };

      this.item.horaPriMarcaDia = this.convertToAmPm(pieData.horaPriMarcaDia);
      this.item.horaUltMarcaDia = this.convertToAmPm(pieData.horaUltMarcaDia);
      this.item.totDiasFaltaMesNoHoy = pieData.totDiasFaltaMesNoHoy;
      this.item.totDiasFaltaAnhoNoHoy = pieData.totDiasFaltaAnhoNoHoy;
      this.item.totHoraTardanzaMesNoHoy = pieData.totHoraTardanzaMesNoHoy;
      this.item.totHoraTardanzaAnhoNoHoy = pieData.totHoraTardanzaAnhoNoHoy;

      const chart = new google.visualization.PieChart(this.pieChartTotal.nativeElement);
      chart.draw(data, options);

      const chart2 = new google.visualization.PieChart(this.pieChartAsistencia.nativeElement);
      chart2.draw(dataAsistencia, optionsAsistencia);
    }

    if (!google.visualization || !google.visualization.PieChart) {
      google.charts.load('current', { 'packages': ['corechart'] });
      google.charts.setOnLoadCallback(drawChart);
    } else {
      drawChart();
    }
  }

  convertToAmPm(time: string): string {
    if (!time) {
      return '';
    }
    const [hours, minutes] = time.split(':');
    let hoursInt = parseInt(hours, 10);
    const suffix = hoursInt >= 12 ? 'PM' : 'AM';
    if (hoursInt > 12) {
      hoursInt -= 12;
    } else if (hoursInt === 0) {
      hoursInt = 12;
    }
    return `${hoursInt}:${minutes} ${suffix}`;
  }

  updateChart(chartData: CandleChartData[]) {

    let index = 0;

    const chartOptions: DeepPartial<ChartOptions> = {
      layout: {
        textColor: 'black',
        background: { color: 'white' },
      },
      height: 200,
      timeScale: {
        tickMarkFormatter: (time: UTCTimestamp) => {
          if (chartData && chartData[index]) {
            const fecha = new Date(chartData[index].fecha);
            let hours = fecha.getHours();
            const ampm = hours >= 12 ? 'PM' : 'AM';
            hours = hours % 12 || 12;
            const minutes = fecha.getMinutes().toString().padStart(2, '0');
            const seconds = fecha.getSeconds().toString().padStart(2, '0');
            index++;
            return `${hours}:${minutes}:${seconds} ${ampm}`;
          } else {
            return '';
          }
        }
      }
    };

    this.container = this.chartContainer.nativeElement;
    this.chart = createChart(this.container, chartOptions);

    window.addEventListener('resize', () => {
      this.chart.applyOptions({ height: 200 });
    });

    const series = this.chart.addCandlestickSeries({
      upColor: '#26a69a',
      downColor: '#ef5350',
      borderVisible: false,
      wickUpColor: '#26a69a',
      wickDownColor: '#ef5350',
    });

    chartData.map((item, index) => {
      const open = item.tipo === 'P' ? 0 : 1;
      const close = item.tipo === 'P' ? 1 : 0;
      return {
        time: index,
        open,
        high: 1,
        low: 0,
        close,
        color: item.tipo === 'P' ? '#26a69a' : '#ef5350'
      };
    });

    let data = this.generateData(chartData, 20, 1000);


    const markers: SeriesMarker<Time>[] = chartData.map(item => {
      const fecha = new Date(item.fecha);
      fecha.setMinutes(fecha.getMinutes() - 300); // UTC -5
      const time: UTCTimestamp = (fecha.getTime() / 1000) as UTCTimestamp;
      return {
        time,
        position: item.tipo === 'P' ? 'aboveBar' : 'belowBar',
        color: item.tipo === 'P' ? '#26a69a' : '#e91e63',
        shape: item.tipo === 'P' ? 'arrowDown' : 'arrowUp',
        text: item.tipo === 'P' ? `Puntual \n@${item.nombre}` : `Tardanza \n@${item.nombre}`
        /* text: item.tipo === 'P' ? 'Puntual @' + item.nombre : 'Tardanza @' + item.nombre */
      };
    });

    series.setMarkers(markers);
    series.setData(data.initialData);

    this.chart.timeScale().fitContent();
    this.chart.timeScale().scrollToPosition(5, true);

    // simulate real-time data
    function* getNextRealtimeUpdate(realtimeData: { time: any; open: any; high: any; low: any; close: any; }[]) {
      for (const dataPoint of realtimeData) {
        yield dataPoint;
      }
      return null;
    }

    const streamingDataProvider = getNextRealtimeUpdate(data.realtimeUpdates);

    const intervalID = setInterval(() => {
      const update = streamingDataProvider.next();
      if (update.done) {
        clearInterval(intervalID);
        return;
      }
      series.update(update.value);
    }, 100);

    const styles = `
      .buttons-container {
        display: flex;
        flex-direction: row;
        gap: 8px;
        margin-top: 8px;
      }
      .buttons-container button {
        all: initial;
        font-family: -apple-system, BlinkMacSystemFont, 'Trebuchet MS', Roboto, Ubuntu,
          sans-serif;
        font-size: 16px;
        font-style: normal;
        font-weight: 510;
        line-height: 24px; /* 150% */
        letter-spacing: -0.32px;
        padding: 8px 24px;        
        color: white;
        background-color: #002034;
        border-radius: 8px;
        cursor: pointer;
      }

      .buttons-container button:hover {
        background-color: rgba(224, 227, 235, 1);
      }

      .buttons-container button:active {
        background-color: rgba(209, 212, 220, 1);
      }
    `;

    const stylesElement = document.createElement('style');
    stylesElement.innerHTML = styles;
    this.container.appendChild(stylesElement);

    const buttonsContainer = document.createElement('div');
    buttonsContainer.classList.add('buttons-container');
    const button = document.createElement('button');
    button.innerText = 'Ver en tiempo real';
    button.addEventListener('click', () => this.chart.timeScale().scrollToRealTime());
    buttonsContainer.appendChild(button);

    this.container.appendChild(buttonsContainer);
    button.click();
  }

  generateData(
    chartData: CandleChartData[],
    updatesPerCandle = 5,
    startAt = 100
  ) {
    const createCandle = (val: number, time: number) => {
      const open = 0; // Siempre empezamos desde 0
      const close = val; // Valor aleatorio para el cierre
      const high = 1; // El máximo entre el valor de apertura y cierre
      const low = -1; // El mínimo entre el valor de apertura y cierre
      return { time, open, high, low, close };
    };

    const updateCandle = (candle: { time: any; open: any; high: any; low: any; close: any; }, val: number) => ({
      time: candle.time,
      close: val,
      open: candle.open,
      low: -1,
      high: 1,
    });

    const initialData = [];
    const realtimeUpdates = [];
    let lastCandle: any;

    for (let i = 0; i < chartData.length * updatesPerCandle; ++i) {
      const dataIndex = Math.floor(i / updatesPerCandle);
      const time = new Date(chartData[dataIndex].fecha).getTime();
      /*  let value = this.samplePoint(i); */
      const fecha2 = new Date(chartData[dataIndex].fecha);
      fecha2.setMinutes(fecha2.getMinutes() - 300); // UTC -5
      const time2: UTCTimestamp = (fecha2.getTime() / 1000) as UTCTimestamp;
      let value = chartData[dataIndex].tipo === 'P' ? 1 : -1;

      if (i % updatesPerCandle === 0) {
        const candle = createCandle(value, time2);
        lastCandle = candle;
        if (i >= startAt) {
          realtimeUpdates.push(candle);
        }
      } else {
        const newCandle = updateCandle(lastCandle, value);
        lastCandle = newCandle;
        if (i >= startAt) {
          realtimeUpdates.push(newCandle);
        } else if ((i + 1) % updatesPerCandle === 0) {
          initialData.push(newCandle);
        }
      }
    }

    return {
      initialData,
      realtimeUpdates,
    };
  }
}