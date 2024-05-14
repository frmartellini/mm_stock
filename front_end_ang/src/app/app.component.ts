import { Component } from '@angular/core';
import { Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, isPlatformServer } from "@angular/common";

import { AuthenticationService } from './services/authentication.service';
import { LoginComponent } from './login/login.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Controle de Estoque';
  //logado;
  menu:boolean = false;

  // vars que indicar se estah executando no servidor ou no browser
  isServer :boolean;
  isBrowser :boolean;

  constructor(private authenticationService: AuthenticationService
              ,@Inject(PLATFORM_ID) platformId: Object
              )
  { 
    // setar as vars que indicar se estah executando no servidor ou no browser
    this.isServer = isPlatformServer(platformId);
    this.isBrowser = isPlatformBrowser(platformId);
    //console.log("app.constructor.this.isServer=" + this.isServer);
    //console.log("app.constructor.this.isBrowser=" + this.isBrowser);
  }

  deslogar(){
    this.authenticationService.deslogar();
  }

  showMenu(component: any): void {

    if (component instanceof LoginComponent) {
      this.menu = false;
    }
    else {
      this.menu = true;
    }
  }

} // class
