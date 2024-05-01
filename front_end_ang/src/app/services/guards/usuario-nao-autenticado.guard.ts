import { CanActivate } from '@angular/router';
import { Router } from '@angular/router';
import { Injectable } from '@angular/core';

import { AuthenticationService } from '../authentication.service';

@Injectable({
  providedIn: 'root'
})

export class UsuarioNaoAutenticadoGuard implements CanActivate{
    
  constructor(
    
    private authenticationService: AuthenticationService,
    
    private router: Router) { }
    
    canActivate() {
      
      if ( this.authenticationService.IsLogado() ) {
        this.router.navigate(['']);
        //console.log("executou o UsuarioNaoAutenticadoGuard.canActivate e vai retornar false");
        return false;
      }

      //console.log("executou o UsuarioNaoAutenticadoGuard.canActivate e vai retornar true");

      return true;

    }

}
