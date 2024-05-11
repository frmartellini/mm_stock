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

    return this.authenticationService.IsLogado();
    
  }

}
