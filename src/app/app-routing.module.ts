import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ModulosComponent } from './Componentes/modulos/modulos.component';
import { VallidaComponent } from './Componentes/vallida/vallida.component';
import { ErrorComponent } from './auth/error/error.component';
import { ComponenteComponent } from './Componentes/componente.component';
import { DashboardComponent } from './Componentes/dashboard/dashboard.component';
import { LoginComponent } from './auth/login/login.component';
import { DashboardChartsComponent } from './Componentes/dashboard-charts/dashboard-charts.component';
import { BoletapagoComponent } from './Componentes/boletapago/boletapago.component';
import { BoletactsComponent } from './Componentes/boletacts/boletacts.component';
import { CertificadoquintaComponent } from './Componentes/certificadoquinta/certificadoquinta.component';
import { ConfigvisualizacionComponent } from './Componentes/configvisualizacion/configvisualizacion.component';
import { AuditoriaComponent } from './Componentes/auditoria/auditoria.component';
import { ComponenteRoutingModule } from './Componentes/componente-routing.module';
import { AuthRoutingModule } from './auth/auth-routing.module';
import { AuthGuard } from './guards/auth.guard';
import { EmpresaComponent } from './Componentes/empresa/empresa.component';
import { AnuncioComponent } from './Componentes/anuncio/anuncio.component';
import { RegistroanuncioComponent } from './Componentes/registroanuncio/registroanuncio.component';
import { VisualizareglamentoComponent } from './Componentes/visualizareglamento/visualizareglamento.component';
import { VacacionComponent } from './Componentes/vacacion/vacacion.component';
import { PermisoComponent } from './Componentes/permiso/permiso.component';
import { PrestamoComponent } from './Componentes/prestamo/prestamo.component';
import { VacacionaprobacionComponent } from './Componentes/vacacionaprobacion/vacacionaprobacion.component';
import { PrestamoaprobacionComponent } from './Componentes/prestamoaprobacion/prestamoaprobacion.component';
import { PermisoaprobacionComponent } from './Componentes/permisoaprobacion/permisoaprobacion.component';

const routes: Routes = [
//  { path: '', component: LoginComponent },
  {path:'', redirectTo:'/login', pathMatch: 'full'},
   { path: 'login', component: LoginComponent },
//  { path: 'error', component: ErrorComponent },
 // { path: 'auth', component: ErrorComponent },
 // { path: 'auth/user/:usr/token/:id', component: VallidaComponent },
 {
  path: 'inicio', component: ComponenteComponent,
  children: [
    { path: '', component: DashboardComponent, data: { titulo: '' } },
    { path: 'info', component: DashboardComponent, data: { titulo: '' },canActivate: [AuthGuard] },      
    { path: 'reglamento', component: VisualizareglamentoComponent, data: { titulo: 'Reglamentos y Politicas' },canActivate: [AuthGuard] },      
    { path: 'dashboardCharts', component: DashboardChartsComponent, data: { titulo: 'Principal', reiniciar: 1 },canActivate: [AuthGuard] },
    { path: 'boletapago', component: BoletapagoComponent, data: { titulo: 'Boleta de Pago', reiniciar: 1 } ,canActivate: [AuthGuard]},
    { path: 'boletacts', component: BoletactsComponent, data: { titulo: 'Boleta de CTS', reiniciar: 1  } ,canActivate: [AuthGuard]},
    { path: 'certificadoquinta', component: CertificadoquintaComponent, data: { titulo: 'Certificado de quinta', reiniciar: 1  } ,canActivate: [AuthGuard]},
    { path: 'vacacion', component: VacacionComponent, data: { titulo: 'Vacaciones', reiniciar: 1 } ,canActivate: [AuthGuard]},
    { path: 'prestamo', component: PrestamoComponent, data: { titulo: 'Prestamos', reiniciar: 1 } ,canActivate: [AuthGuard]},
    { path: 'permiso', component: PermisoComponent, data: { titulo: 'Permisos', reiniciar: 1 } ,canActivate: [AuthGuard]},
   
    { path: 'aprobacionvac', component: VacacionaprobacionComponent, data: { titulo: 'Aprobaciones', reiniciar: 1 } ,canActivate: [AuthGuard]},
    { path: 'aprobacionprest', component: PrestamoaprobacionComponent, data: { titulo: 'Aprobaciones', reiniciar: 1 } ,canActivate: [AuthGuard]},
    { path: 'aprobacionperm', component: PermisoaprobacionComponent, data: { titulo: 'Aprobaciones', reiniciar: 1 } ,canActivate: [AuthGuard]},
    { path: 'anuncio', component: AnuncioComponent, data: { titulo: 'Anuncios', reiniciar: 1  } ,canActivate: [AuthGuard]},
    { path: 'anuncioregistro/:id', component: RegistroanuncioComponent, data: { titulo: 'Registrando Anuncios', reiniciar: 1  }},
    { path: 'empresa', component: EmpresaComponent, data: { titulo: 'Empresas', reiniciar: 1  } ,canActivate: [AuthGuard]},
    { path: 'visualizacion', component: ConfigvisualizacionComponent, data: { titulo: 'Configuración de Visualización', reiniciar: 1  } ,canActivate: [AuthGuard]},
    { path: 'auditoria', component: AuditoriaComponent, data: { titulo: 'Auditoria', reiniciar: 1  } ,canActivate: [AuthGuard]},
  ]
  
}

];

@NgModule({
  imports: [
    //CommonModule,
    RouterModule.forRoot(routes, { useHash: true }),
    //ComponenteRoutingModule,
    //AuthRoutingModule
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
