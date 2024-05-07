import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';
import { HttpClient } from '@angular/common/http';

import * as bcrypt from 'bcryptjs';

import { ToastrService } from 'ngx-toastr';

import Utils from '../utils';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent {

  public username: string;
  public password: string;

  constructor(private http: HttpClient
              ,private router: Router
              ,private authService: AuthenticationService
              ,private toastr: ToastrService
            ) {

    this.username = "";
    this.password = "";

  }

  // funcao executada quando ha sucesso no login
  OnLoginSuccess_CallBackFunction() {

    console.log(Utils.getDateTimeString() + " OnLoginSuccess_CallBackFunction foi executada");

    this.toastr.success('Login efetuado!' , '', {
      timeOut: 3000
      ,positionClass: 'toast-top-center'
    });

    // Se a senha estah correta, executar o metodo "logar"que vai processar o login do usuario no sistema
    this.authService.logar(this.username.toLowerCase());

  } // OnLoginSuccess_CallBackFunction

  // funcao executada quando ha falha no login
  OnLoginFail_CallBackFunction() {

    console.log(Utils.getDateTimeString() + " OnLoginFail_CallBackFunction foi executada");

    //console.error("login nao foi realizado");
    this.toastr.error('Usuário ou senha inválidos!' , '', {
      timeOut: 5000
      ,positionClass: 'toast-top-center'
    });

  } // OnLoginFail_CallBackFunction

  // funcao executada pelo botao submit do form deste component do login
  login() {

    this.authService.login(this.username.toLowerCase()
                           ,this.password
                           ,this.OnLoginSuccess_CallBackFunction.bind(this)
                           ,this.OnLoginFail_CallBackFunction.bind(this)
                          );

  } // login

} // class
