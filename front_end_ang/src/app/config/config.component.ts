import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { AuthenticationService } from '../services/authentication.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-config',
  templateUrl: './config.component.html',
  styleUrl: './config.component.scss'
})

export class ConfigComponent {

  public username: string;
  public password: string;
  public minutos: number | null;
  public token: string;

  constructor(private authService: AuthenticationService
              ,private toastr: ToastrService
              ,private router: Router
              )
  {

    this.username = "";
    this.password = "";
    this.minutos = null;
    this.token = "";

  } // constructor

  // funcao executada quando ha sucesso na obtencao do token de seguranca
  On_get_api_token_Success_CallBackFunction(pToken : string) {

    //console.log(Utils.getDateTimeString() + " On_get_api_token_Success_CallBackFunction foi executada");

    this.toastr.success('Token obtido com sucesso!' , '', {
      timeOut: 3000
      ,positionClass: 'toast-top-center'
    });

    // Se deu certo, guardar o token de seguranca nesta var qeu serah exibida na tela para o usuario utiliza-lo onde quiser
    this.token = pToken;

  } // On_get_api_token_Success_CallBackFunction

  // funcao executada quando ha falha
  On_get_api_token_Fail_CallBackFunction() {

    //console.log(Utils.getDateTimeString() + " On_get_api_token_Fail_CallBackFunction foi executada");

    //console.error("login nao foi realizado");
    this.toastr.error('Usuário ou senha inválidos!' , '', {
      timeOut: 5000
      ,positionClass: 'toast-top-center'
    });

  } // On_get_api_token_Fail_CallBackFunction

  onSegAPISubmit() {

    //console.log(this.confirmPwd?.value);

    this.authService.get_api_token(this.username.toLowerCase()
                           ,this.password
                           ,this.minutos as number
                           ,this.On_get_api_token_Success_CallBackFunction.bind(this)
                           ,this.On_get_api_token_Fail_CallBackFunction.bind(this)
                          );

  } // onSegAPISubmit

} // class
