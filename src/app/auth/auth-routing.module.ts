import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { AuthComponent } from './auth/auth.component';
import { ErrorComponent } from './error/error.component';

const routes: Routes = [
  {path:'login', component: LoginComponent},
//  {path:'login',redirectTo:'/login',pathMatch:'full'},
//  {path:'auth', component: AuthComponent},
//  {path:'error', component: ErrorComponent},
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot(routes)
  ],
  exports:[
    RouterModule
  ]
})
export class AuthRoutingModule { }
