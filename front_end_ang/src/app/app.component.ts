import { Component } from '@angular/core';

import { AuthenticationService } from './services/authentication.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Controle de Estoque';
  logado;

  constructor(private authenticationService: AuthenticationService) { 
    this.logado = this.ShowDeslogarBtn();
  }

  deslogar(){
    this.authenticationService.deslogar();
  }

  ShowDeslogarBtn() :boolean {

    //console.log("ShowDeslogarBtn()");
    
    return this.authenticationService.IsLogado();

  }

}
