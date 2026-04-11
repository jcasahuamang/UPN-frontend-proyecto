import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ComponenteComponent } from './componente.component';
import { DashboardChartsComponent } from './dashboard-charts/dashboard-charts.component';
import { BoletapagoComponent } from './boletapago/boletapago.component';
import { BoletactsComponent } from './boletacts/boletacts.component';
import { CertificadoquintaComponent } from './certificadoquinta/certificadoquinta.component';
import { ConfigvisualizacionComponent } from './configvisualizacion/configvisualizacion.component';
import { AuditoriaComponent } from './auditoria/auditoria.component';
import { AuthGuard } from '../guards/auth.guard';
import { EmpresaComponent } from './empresa/empresa.component';
import { AnuncioComponent } from './anuncio/anuncio.component';
import { RegistroanuncioComponent } from './registroanuncio/registroanuncio.component';
import { VisualizareglamentoComponent } from './visualizareglamento/visualizareglamento.component';
import { VacacionComponent } from './vacacion/vacacion.component';
import { PermisoComponent } from './permiso/permiso.component';
import { PrestamoComponent } from './prestamo/prestamo.component';
import { VacacionaprobacionComponent } from './vacacionaprobacion/vacacionaprobacion.component';
import { PrestamoaprobacionComponent } from './prestamoaprobacion/prestamoaprobacion.component';
import { PermisoaprobacionComponent } from './permisoaprobacion/permisoaprobacion.component';
/*
const routes: Routes = [
  {
    path: 'dashboard', component: ComponenteComponent,
    children: [
      { path: 'dashboard', component: DashboardComponent, data: { titulo: 'Inicio' } },
      { path: 'dashboardChartsx', component: DashboardChartsComponent, data: { titulo: 'Dashboard' } },
      { path: 'boletapagox', component: BoletapagoComponent, data: { titulo: 'Boleta de Pago' } },
      { path: 'boletactsx', component: BoletactsComponent, data: { titulo: 'Boleta de CTS' } },
      { path: 'certificadoquintax', component: CertificadoquintaComponent, data: { titulo: 'Certificado de quinta' } },
    ]
  }
];
*/

const routes: Routes = [
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
      { path: 'anuncioregistro/:id', component: RegistroanuncioComponent, data: { titulo: 'Registrando Anuncios', reiniciar: 1  } },
     { path: 'empresa', component: EmpresaComponent, data: { titulo: 'Empresas', reiniciar: 1  } ,canActivate: [AuthGuard]},
     { path: 'visualizacion', component: ConfigvisualizacionComponent, data: { titulo: 'Configuración de Visualización', reiniciar: 1  } ,canActivate: [AuthGuard]},
      { path: 'auditoria', component: AuditoriaComponent, data: { titulo: 'Auditoria', reiniciar: 1  } ,canActivate: [AuthGuard]},
    ]
  }
];

/*,
    ,

*/
@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot(routes)],
//    RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ComponenteRoutingModule { }