import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { SidebarService } from 'src/app/services/sidebar.service';
import { MenuOption } from 'src/app/Clases/menu-option.model';
import { TokenService } from 'src/app/services/TokenService';

declare var $: any;

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  menuOptions: MenuOption[] = [];
  menuItems?: any[];
  showmenu: string = '0';
  usuario: string;
  user: string;
  userImgGoogle: any;

  isLogged = false;
  public compania: string = "Sin Compañia";
  public admLevel: string;

  constructor(private sideBarServices: SidebarService, 
    private router: Router, private authService: AuthService,
  private tokenService: TokenService) {
  //  this.menuItems = this.sideBarServices.setMenu(this.tokenService.getUserName() || '');
  
  }

  ngOnInit(): void {
    if (this.tokenService.getToken()){
      this.isLogged = true;
      this.loadAccessMenu();
    }else{
      this.isLogged=false;
    }

  }

  loadAccessMenu() {
    this.usuario = this.tokenService.getUserName();
//    console.log(this.tokenService.getAdmlevel());
    
    if (this.usuario != null) {
        this.menuItems = this.sideBarServices.setMenu(this.tokenService.getAdmlevel()); 
      }

    this.user = this.tokenService.getUserFullName();
    this.usuario = this.tokenService.getUserName();
  }

  // Método para alternar la visibilidad del submenú
  toggleSubmenu(option: any) {

    this.menuItems?.forEach(i => {
      if (i !== option) {
        i.expanded = false; // Cerramos los submenús de otros elementos
      }
    });
    option.expanded = !option.expanded;    
  }


}