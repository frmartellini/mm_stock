import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot } from '@angular/router';
import { Router } from '@angular/router';
import { Injectable } from '@angular/core';

import { AuthenticationService } from '../authentication.service';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})

export class UsuarioAutenticadoGuard implements CanActivate {

  constructor(private authenticationService: AuthenticationService
    , private router: Router
    , private toastr: ToastrService
  ) {

  }

  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

    //console.log("UsuarioAutenticadoGuard.canActivate - inicio");

    //console.log("UsuarioAutenticadoGuard.canActivate - state.url=" + state.url);

    var is_logado :boolean = await this.authenticationService.IsLogado();
    
    //console.log("UsuarioAutenticadoGuard.canActivate - depois do IsLogado()");

    //console.log("UsuarioAutenticadoGuard - is_logado=" + is_logado);

    // se estah logado, retorna true pra indicar que o componente pode ser acessado
    if ( is_logado ) {

      let CodPriv : string = this.authenticationService.GetCodPrivForRoute(state.url)
      //console.log("UsuarioAutenticadoGuard.canActivate - CodPriv=" + CodPriv);
      if (!(CodPriv == "")) {
        if ( !this.authenticationService.CheckPrivilegio(CodPriv)) {
          //console.log("UsuarioAutenticadoGuard.canActivate - acesso negado=");
          // avisar o usuario
          this.toastr.error('Acesso negado!' , '', {
            timeOut: 3000
            ,positionClass: 'toast-top-center'
          });
          this.router.navigate(['/home']); // se nao fizer isso a tela fica branca e nao carrega a home
          return false;
        }
      }

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
