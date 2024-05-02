import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';
import { HttpClient } from '@angular/common/http';

import * as bcrypt from 'bcryptjs';

import { CONFIG } from "../CONFIG";

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
            ) { 

    this.username = "";
    this.password = "";

  }

  // &todo& a verificacao do usuario e senah devem ser feitas dentro de uma rotina do back-end para nao ser uma falha de seguranca
  login() {

    if ( this.username.toLocaleLowerCase() != "admin") {
      //console.error("login invalido");
      window.alert('Usuário inválido!');
      return;
    }

    this.http.get<CONFIG[]>('http://localhost:3000/config')
      .subscribe( 

        configs => {
          var cfg = configs[0];
          //console.log("login()  - this.configs=" + JSON.stringify(cfg));
          //console.log("this.password=" + this.password);

          const hashedPassword = bcrypt.hashSync(this.password, 10);

          //console.log("hashedPassword=" + hashedPassword);

          bcrypt.compare(this.password, cfg.CFG01).then(
            (isCorrect) => { 
              //console.log("isCorrect=" + isCorrect);
              if ( isCorrect ) {
                // Se a senha estah correta, redirecione para a página principal
                this.authService.logar(); 
              }
              else {
                //console.error("login nao foi realizado");
                window.alert('Usuário ou senha inválidos!');
              }
            }
          );
          
        }
      );

  } // login

} // class
