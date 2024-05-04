import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { inject } from "@angular/core"
import { Observable, of, throwError } from 'rxjs';

import Utils from "../utils";
import { ENV } from '../env';

@Injectable({
  providedIn: 'root'
})

export class AuthenticationService {

  // guarda se o usuario estah logado ou nao
  private isLogado :boolean;

  private router = inject(Router);

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private http: HttpClient) { 
    console.log("AuthenticationService.constructor");
    this.isLogado = false;
  }

  public IsLogado() : boolean {

    //console.log(" IsLogado() foi executado e vai retornar "+ this.isLogado);

    return this.isLogado;
  }

  setLogado() {
    this.isLogado = true;
  }

  setDeslogado() {
    this.isLogado = false;
  }
  
  logar() {

    this.setLogado();

    this.router.navigate(['']);

  }

  deslogar() {

    this.setDeslogado();

    this.router.navigate(['login']);

  }

  updatePassword_http(pNewPW: string
                      ,pOldPW : string
                      ): Observable<any> {
    console.log(Utils.getDateTimeString() + " updatePassword_http - pNewPW=" + pNewPW);

    // Montar um obj com as props "senha_nova" e "senha_atual" para enviar para back-end.
    // Estas props devem ter estes nomes mesmo porque sao os nomes que a rotina do back-end espera.
    const obj = JSON.parse('{"senha_nova":"' + pNewPW  + '", "senha_atual":"' +  pOldPW +'" }');
    
    // montar a chamada PUT para enviar o obj com a nova senha
    return this.http.put(ENV.REST_API_URL+'/config/alter', JSON.stringify(obj), this.httpOptions).pipe(
      //tap(_ => console.log(`senha foi alterada`))
    );
  }

  // alterar a senah do usuario admin no bd
  updatePassword(pNewPW: string
                 ,pOldPW : string
                 ,pOnPwChangeSuccess_CallBackFunction: () => void
                 ,pOnPwChangeError_CallBackFunction: () => void
                 ) : void {
    
    console.log(Utils.getDateTimeString() + " updatePassword - pNewPW=" + pNewPW);

    // executar a rotina que vai realmente enviar pro back-end a nova senha que deve ser gravada passando as tres callback functions 
    // que serao executadas conforme necessario
    this.updatePassword_http(pNewPW, pOldPW).subscribe( {

      next: response => {
        console.log(Utils.getDateTimeString() + " updatePassword - response recebido=" + JSON.stringify( response ));
      },

      error: error => {
        console.log(Utils.getDateTimeString() + " updatePassword - erro ao tentar gravar a nova senha. " + JSON.stringify(error) );
        console.log(Utils.getDateTimeString() + " updatePassword - antes de chamar a pOnPwChangeError_CallBackFunction");
        pOnPwChangeError_CallBackFunction();
      },

      complete() {
        //window.alert('Nova senha gravada com sucesso!');
        console.log(Utils.getDateTimeString() + " updatePassword - antes de chamar a pOnPwChangeSuccess_CallBackFunction");
        pOnPwChangeSuccess_CallBackFunction();
      },
      
    });
    
  } // updatePassword

} // class