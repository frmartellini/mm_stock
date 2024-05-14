import { CanActivate } from '@angular/router';
import { Router } from '@angular/router';
import { Injectable } from '@angular/core';

import { AuthenticationService } from '../authentication.service';

@Injectable({
  providedIn: 'root'
})

export class UsuarioAutenticadoGuard implements CanActivate {

  constructor(private authenticationService: AuthenticationService
    , private router: Router
  ) {

  }

  canActivate() {

    //console.log("UsuarioAutenticadoGuard.canActivate executado");

    var is_logado :boolean = this.authenticationService.IsLogado();
    
    //console.log("UsuarioAutenticadoGuard - is_logado=" + is_logado);

    // se estah logado, retorna true pra indicar que o componente pode ser acessado
    if ( is_logado ) {
      //console.log("UsuarioAutenticadoGuard.canActivate vai retornar true");
      return true;
    }
    // se estah logado, retorna false pra indicar que o componente NAO pode ser acessado e vai redirecionar pro login
    else if ( is_logado == false) {
      //console.log("UsuarioAutenticadoGuard.canActivate vai redirecionar pro login");
      this.router.navigate(['login']);

      //console.log("UsuarioAutenticadoGuard.canActivate vai retornar false");
      return false;
    }
    return false;
  } // canActivate

} // class
