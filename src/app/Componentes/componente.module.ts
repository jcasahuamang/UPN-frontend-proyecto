import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ComponenteComponent } from './componente.component';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModulosComponent } from './modulos/modulos.component';
import { MatCardModule } from '@angular/material/card';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { VallidaComponent } from './vallida/vallida.component';
import { DashboardChartsComponent } from './dashboard-charts/dashboard-charts.component';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { GoogleChartsModule } from 'angular-google-charts';
import { LoadingModalComponent } from './loading-modal/loading-modal.component';
import { BoletapagoComponent } from './boletapago/boletapago.component';
import { BoletactsComponent } from './boletacts/boletacts.component';
import { CertificadoquintaComponent } from './certificadoquinta/certificadoquinta.component';
import { ConfigvisualizacionComponent } from './configvisualizacion/configvisualizacion.component';
import { AuditoriaComponent } from './auditoria/auditoria.component';
import { EmpresaComponent } from './empresa/empresa.component';
import { AnuncioComponent } from './anuncio/anuncio.component';
import { RegistroanuncioComponent } from './registroanuncio/registroanuncio.component';
import { NgxSummernoteModule } from 'ngx-summernote';
import { ModalanuncioComponent } from './modalanuncio/modalanuncio.component';
import { MatIconModule } from '@angular/material/icon';
import { VisualizareglamentoComponent } from './visualizareglamento/visualizareglamento.component';
import { VacacionComponent } from './vacacion/vacacion.component';
import { PermisoComponent } from './permiso/permiso.component';
import { PrestamoComponent } from './prestamo/prestamo.component';
import { VacacionaprobacionComponent } from './vacacionaprobacion/vacacionaprobacion.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
//import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatMenuModule } from '@angular/material/menu';
import { PrestamoaprobacionComponent } from './prestamoaprobacion/prestamoaprobacion.component';
import { PermisoaprobacionComponent } from './permisoaprobacion/permisoaprobacion.component';

@NgModule({
  declarations: [
    DashboardChartsComponent,
    DashboardComponent,
    ComponenteComponent,
    ModulosComponent,
    VallidaComponent,
    LoadingModalComponent,
    BoletapagoComponent,
    BoletactsComponent,
    CertificadoquintaComponent,
    ConfigvisualizacionComponent,
    AuditoriaComponent,
    EmpresaComponent,
    AnuncioComponent,
    RegistroanuncioComponent,
    ModalanuncioComponent,
    VisualizareglamentoComponent,
    VacacionComponent,
    PermisoComponent,
    PrestamoComponent,
    VacacionaprobacionComponent,
    PrestamoaprobacionComponent,
    PermisoaprobacionComponent
  ],
  imports: [
    MatIconModule,
    NgxSummernoteModule,
    GoogleChartsModule.forRoot(),
    MatInputModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatNativeDateModule,
    CommonModule,
    RouterModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatPaginatorModule,
    MatTableModule,
    MatCheckboxModule,
    MatMenuModule
    
  ],
  exports: [
    MatInputModule,
    DashboardComponent,
    FormsModule,
    ReactiveFormsModule
  ],
  providers:[
  ]
})
export class ComponenteModule { }