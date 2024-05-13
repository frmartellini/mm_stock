import { Component } from '@angular/core';

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

  constructor(private authenticationService: AuthenticationService) { 
    //this.logado = this.ShowDeslogarBtn();
  }

  deslogar(){
    this.authenticationService.deslogar();
  }

  // ShowDeslogarBtn() :boolean {

  //   //console.log("ShowDeslogarBtn()");
    
  //   return this.authenticationService.IsLogado();

  // }

  showMenu(component: any): void {

    if (component instanceof LoginComponent) {
      this.menu = false;
    }
    else {
      this.menu = true;
    }
  }

}
