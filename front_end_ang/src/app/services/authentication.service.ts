import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { inject } from "@angular/core"
import { Observable, of, throwError } from 'rxjs';
import * as bcrypt from "bcryptjs";

import Utils from "../utils";
import { ENV } from '../env';
import { LocalStorageService } from './local-storage.service';
import { USUARIO } from '../USUARIO';

@Injectable({
  providedIn: 'root'
})

export class AuthenticationService {

  // guarda se o usuario estah logado ou nao
  private isLogado :boolean;

  private router = inject(Router);

  // guarda o ID do usuario que estah logado no sistema
  // &todo& preencher quando o ocorrer o login do usuario
  public IDUsuarioLogado :number;

  // guarda o obj completo do usuario que estah logado no sistema
  // &todo& preencher quando o ocorrer o login do usuario
  public UsuarioLogado :USUARIO | null;

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private http: HttpClient
              ,private localStorageService: LocalStorageService
              )
  { 
    //console.log("AuthenticationService.constructor");
    this.isLogado = false;

    this.IDUsuarioLogado = 0;

    this.UsuarioLogado = null;
  }

  public IsLogado() : boolean {

    if ( this.isLogado ) {
      return this.isLogado;
    }
    else {

      let status = false;

      if (this.localStorageService.getItem('isLogado') == "true") {

        var login_localstorage: string = "";
        login_localstorage = this.localStorageService.getItem('login') ?? "";
        //console.log("login_localstorage="+ login_localstorage);

        var token_localstorage: string = "";
        token_localstorage = this.localStorageService.getItem('token') ?? "";
        //console.log("token_localstorage="+ token_localstorage);

        //console.log("antes do bcrypt.compareSync");
        if ( bcrypt.compareSync(login_localstorage.toString(), token_localstorage.toString()) ) {

          //console.log("dentro do then bcrypt.compareSync");

          this.isLogado = true;

          status = true;

        }
        else {
          //console.log("dentro do else bcrypt.compareSync");
          status = false;
        }
      }
      else {
        status = false;
      }

      //console.log(" IsLogado() foi executado e vai retornar "+ status);

      return status;
    }
  }

  setLogado(pLogin: string) {
    this.isLogado = true;

    var token: string = "";
    
    token = bcrypt.hashSync(pLogin,10);

    this.localStorageService.setItem("isLogado", this.isLogado.toString());
    this.localStorageService.setItem("login", pLogin);
    this.localStorageService.setItem("token", token);
    //console.log("setLogado() executado e gravou no localStorage isLogado="+ this.isLogado);
  }

  setDeslogado() {
    this.isLogado = false;
    this.localStorageService.setItem("isLogado", this.isLogado.toString());
    this.localStorageService.setItem("login", "");
    this.localStorageService.setItem("token", "");
    //console.log("setDeslogado() executado e gravou no localStorage isLogado="+ this.isLogado);
  }
  
  logar(pLogin: string) {

    this.setLogado(pLogin);

    this.router.navigate(['home']);

  }

  deslogar() {

    this.setDeslogado();

    this.router.navigate(['login']);

  }

  updatePassword_http(pNewPW: string
                      ,pOldPW : string
                      ): Observable<any> {
    //console.log(Utils.getDateTimeString() + " updatePassword_http - pNewPW=" + pNewPW);

    // Montar um obj com as props "senha_nova" e "senha_atual" para enviar para back-end.
    // Estas props devem ter estes nomes mesmo porque sao os nomes que a rotina do back-end espera.
    const obj = JSON.parse('{"senha_nova":"' + pNewPW  + '", "senha_atual":"' +  pOldPW +'" }');
    
    // montar a chamada PUT para enviar o obj com a nova senha
    return this.http.put(ENV.REST_API_URL+'/config/alter', JSON.stringify(obj), this.httpOptions).pipe(
      //tap(_ => console.log(`senha foi alterada`))
    );
  } // updatePassword_http

  // alterar a senha do usuario admin no bd
  updatePassword(pNewPW: string
                 ,pOldPW : string
                 ,pOnPwChangeSuccess_CallBackFunction: () => void
                 ,pOnPwChangeError_CallBackFunction: () => void
                 ) : void {
    
    //console.log(Utils.getDateTimeString() + " updatePassword - pNewPW=" + pNewPW);

    // executar a rotina que vai realmente enviar pro back-end a nova senha que deve ser gravada passando as tres callback functions 
    // que serao executadas conforme necessario
    this.updatePassword_http(pNewPW, pOldPW).subscribe( {

      next: response => {
        //console.log(Utils.getDateTimeString() + " updatePassword - response recebido=" + JSON.stringify( response ));
      },

      error: error => {
        console.log(Utils.getDateTimeString() + " updatePassword - erro ao tentar gravar a nova senha. " + JSON.stringify(error) );
        console.log(Utils.getDateTimeString() + " updatePassword - antes de chamar a pOnPwChangeError_CallBackFunction");
        pOnPwChangeError_CallBackFunction();
      },

      complete() {
        //window.alert('Nova senha gravada com sucesso!');
        //console.log(Utils.getDateTimeString() + " updatePassword - antes de chamar a pOnPwChangeSuccess_CallBackFunction");
        pOnPwChangeSuccess_CallBackFunction();
      },
      
    });
    
  } // updatePassword

  AlterSenhaUsuario_http(pIDUsuario: number
                         ,pNewPW: string
                         ,pOldPW : string
                         ): Observable<any> {
    //console.log(Utils.getDateTimeString() + " updatePassword_http - pNewPW=" + pNewPW);

    // Montar um obj com as props "senha_nova" e "senha_atual" para enviar para back-end.
    // Estas props devem ter estes nomes mesmo porque sao os nomes que a rotina do back-end espera.
    const obj = JSON.parse('{"senha_nova":"' + pNewPW  + '", "senha_atual":"' +  pOldPW +'" }');

    //// montar a chamada PUT para enviar o obj com a nova senha
    //return this.http.put(ENV.REST_API_URL+'/config/alter', JSON.stringify(obj), this.httpOptions).pipe(
    ////tap(_ => console.log(`senha foi alterada`))
    //);

    // chamar a api "patch" com o caminho    /usuario/:id/senha
    return this.http.patch(ENV.REST_API_URL+'/usuario/'+ pIDUsuario +'/senha', JSON.stringify(obj), this.httpOptions).pipe(
    //tap(_ => console.log('senha foi alterada'))
    );

  }

  // alterar a senha de um usuario no bd
  AlterSenhaUsuario(pIDUsuario: number
                    ,pNewPW: string
                    ,pOldPW : string
                    ,pOnPwChangeSuccess_CallBackFunction: () => void
                    ,pOnPwChangeError_CallBackFunction: () => void
                    ) : void {

    //console.log(Utils.getDateTimeString() + " AlterSenhaUsuario - pNewPW=" + pNewPW);

    // executar a rotina que vai realmente enviar pro back-end a nova senha que deve ser gravada passando as tres callback functions 
    // que serao executadas conforme necessario
    this.AlterSenhaUsuario_http(pIDUsuario, pNewPW, pOldPW).subscribe( {

      // callback executada se NAO houve erro na chamada a api
      next: response => {
        //console.log(Utils.getDateTimeString() + " AlterSenhaUsuario_http - response recebido=" + JSON.stringify( response ));
      },

      // callback executada se HOUVE erro na chamada a api
      error: error => {
        //console.log(Utils.getDateTimeString() + " AlterSenhaUsuario_http - erro ao tentar gravar a nova senha. " + JSON.stringify(error) );
        //console.log(Utils.getDateTimeString() + " AlterSenhaUsuario_http - antes de chamar a pOnPwChangeError_CallBackFunction");
        pOnPwChangeError_CallBackFunction();
      },

      // callback executada se NAO houve erro na chamada a api
      complete() {
        //window.alert('Nova senha gravada com sucesso!');
        //console.log(Utils.getDateTimeString() + " updatePassword - antes de chamar a pOnPwChangeSuccess_CallBackFunction");
        pOnPwChangeSuccess_CallBackFunction();
      },

    }); // subscribe

  } // AlterSenhaUsuario

  // chama a api post do back-end para validar o login/senha informado pelo usuario
  login_http(pLogin: string
              ,pSenha : string
              ): Observable<any> {

                console.log(Utils.getDateTimeString() + " login_http - pLogin=" + pLogin);
    //console.log(Utils.getDateTimeString() + " login_http - pSenha=" + pSenha);
    
    // Estas props devem ter estes nomes mesmo porque sao os nomes que a rotina do back-end espera.
    const obj = JSON.parse('{ "login":"' + pLogin  + '", "senha":"' + pSenha +'" }');

    // montar a chamada PUT para enviar o obj com a nova senha
    return this.http.post(ENV.REST_API_URL+'/config/login', JSON.stringify(obj), this.httpOptions).pipe(
    //tap(_ => console.log(`senha foi alterada`))
    );

  } // login_http

  // alterar a senha do usuario admin no bd
  login(pLogin: string
        ,pSenha : string
        ,pOnLoginSuccess_CallBackFunction: () => void
        ,pOnLoginFail_CallBackFunction: () => void
        ) : void {

    //console.log(Utils.getDateTimeString() + " login - pLogin=" + pLogin);
    //console.log(Utils.getDateTimeString() + " senha - pSenha=" + pSenha);

    // executar a rotina que vai realmente enviar pro back-end a nova senha que deve ser gravada passando as tres callback functions 
    // que serao executadas conforme necessario
    this.login_http(pLogin, pSenha).subscribe( {

      next: response => {
        //console.log(Utils.getDateTimeString() + " login - response recebido=" + JSON.stringify( response ));
      },

      error: error => {
        console.log(Utils.getDateTimeString() + " login - falha no login. " + JSON.stringify(error) );
        console.log(Utils.getDateTimeString() + " login - antes de chamar a pOnLoginFail_CallBackFunction");
        pOnLoginFail_CallBackFunction();
      },

      complete() {
        //window.alert('Nova senha gravada com sucesso!');
        //console.log(Utils.getDateTimeString() + " login - antes de chamar a pOnLoginSuccess_CallBackFunction");
        pOnLoginSuccess_CallBackFunction();
      },

    }); // this.login_http

  } // login

} // class