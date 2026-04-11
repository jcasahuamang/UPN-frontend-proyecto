import { Injectable,EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable,BehaviorSubject } from 'rxjs';


const ADMLEVEL_KEY = 'AuthAdmLevel';
const AUTHORITIES_KEY = 'AuthAuthorities';
const CODEMPRESA_KEY = 'AuthCodEmpresa';
const DESEMPRESA_KEY = 'AuthDesEmpresa';
const CODPERSONAL_KEY = 'AuthCodPersonal';
const TOKEN_KEY = 'AuthToken';
const USERFULLNAME_KEY = 'AuthUserFullName';
const USERNAME_KEY = 'AuthUserName';



@Injectable({
  providedIn: 'root'
})
export class TokenService {

  private _admLevel: string;
  roles: Array<string> = [];
  private _codEmpresa: string;
  private _desEmpresa: string;
  private _codPersonal: string;
  private _token: string;
  private _userFullName: string;
  private _userName: string;


  constructor(private dialog: MatDialog) { 
  }

 /******************************************************************/
  public setToken(token: string): void{
    if (token === null) {token = ""}
    window.sessionStorage.removeItem(TOKEN_KEY);
    window.sessionStorage.setItem(TOKEN_KEY,token);
    /*
    this.tokenSubject.next(token);
    if (token.length>0)
      {this.logeado.next(true);}
    else{
      this.logeado.next(false);
    }
    */
  }

  public getToken():string {
    return sessionStorage.getItem(TOKEN_KEY)!;
  }
  /******************************************************************/

  public setUserName(userName: string): void{
    if (userName === null) {userName = ""}
    window.sessionStorage.removeItem(USERNAME_KEY);
    window.sessionStorage.setItem(USERNAME_KEY,userName);
  }

  public getUserName(): string  {
    return sessionStorage.getItem(USERNAME_KEY)!;
  }

   /******************************************************************/

  public setAuthorities(authorities: string[]): void{
    window.sessionStorage.removeItem(AUTHORITIES_KEY);
    window.sessionStorage.setItem(AUTHORITIES_KEY,JSON.stringify(authorities));
  }
  public getAuthorities():string[] {
    this.roles = [];
    if(sessionStorage.getItem(AUTHORITIES_KEY)){
      JSON.parse(sessionStorage.getItem(AUTHORITIES_KEY)!).forEach((authority: { authority: string; }) => {
        this.roles.push(authority.authority);
      });
    }
    return this.roles;
  }
 /******************************************************************/
  public setUserFullName(useFullName: string):void {
    if (useFullName === null) {useFullName = ""}
    window.sessionStorage.removeItem(USERFULLNAME_KEY);
    window.sessionStorage.setItem(USERFULLNAME_KEY,useFullName);
  }

  public getUserFullName():string {
    return sessionStorage.getItem(USERFULLNAME_KEY)!;
  }

  
  /********** VARIABLES GLOBALES **************************************/
  public setAdmlevel(admLevel: string): void{
    if (admLevel === null) {admLevel = ""}
    window.sessionStorage.removeItem(ADMLEVEL_KEY);
    window.sessionStorage.setItem(ADMLEVEL_KEY,admLevel);
  }

  public getAdmlevel():string {
    return sessionStorage.getItem(ADMLEVEL_KEY)!;
  }
 /******************************************************************/
  public setCodEmpresa(codEmpresa: string): void{
    if (codEmpresa === null) {codEmpresa = ""}
    window.sessionStorage.removeItem(CODEMPRESA_KEY);
    window.sessionStorage.setItem(CODEMPRESA_KEY,codEmpresa);
  }

  public getCodEmpresa():string {
    return sessionStorage.getItem(CODEMPRESA_KEY)!;
  }
 /******************************************************************/
  public setDesEmpresa(desEmpresa: string): void{
    if (desEmpresa === null) {desEmpresa = ""}
    window.sessionStorage.removeItem(DESEMPRESA_KEY);
    window.sessionStorage.setItem(DESEMPRESA_KEY,desEmpresa);
  }

  public getDesEmpresa():string {
    return sessionStorage.getItem(DESEMPRESA_KEY)!;
  }

 /******************************************************************/
  public setCodPersonal(codPersonal: string): void{
    if (codPersonal === null) {codPersonal = ""}
    window.sessionStorage.removeItem(CODPERSONAL_KEY);
    window.sessionStorage.setItem(CODPERSONAL_KEY,codPersonal);
  }

  public getCodPersonal():string {
      return sessionStorage.getItem(CODPERSONAL_KEY)!;
      }
  /********** VARIABLES GLOBALES **************************************/

  isAuthenticated(): boolean{
    if (this.getToken() != null && this.getUserName()!= null && 
            this.getToken().length>0 && this.getUserName().length>0){
      return true;
    }
    return false;
  }
  isCodificado(): boolean{
    if (this.getCodPersonal() != null && this.getCodPersonal().length>0){
      return true;
    }
    return false;
  }

  /****************************************************************/
  public logOut(): void{
    this.dialog.closeAll();
    console.clear();
    window.sessionStorage.clear();

  }

}
