import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';
import { HttpClient } from '@angular/common/http';

import * as bcrypt from 'bcryptjs';

import { ToastrService } from 'ngx-toastr';

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
              ,private toastr: ToastrService
            ) { 

    this.username = "";
    this.password = "";

  }

  // &todo& a verificacao do usuario e senah devem ser feitas dentro de uma rotina do back-end para nao ser uma falha de seguranca
  login() {

    if ( this.username.toLowerCase() != "admin") {
      //console.error("login invalido");
      
      this.toastr.error('Usuário inválido!' , '', {
        timeOut: 5000
        ,positionClass: 'toast-top-center'
      });

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

                this.toastr.success('Login efetuado!' , '', {
                  timeOut: 3000
                  ,positionClass: 'toast-top-center'
                });

                // Se a senha estah correta, redirecione para a página principal
                this.authService.logar(); 
              }
              else {
                //console.error("login nao foi realizado");
                this.toastr.error('Usuário ou senha inválidos!' , '', {
                  timeOut: 5000
                  ,positionClass: 'toast-top-center'
                });
              }
            }
          );
          
        }
      );

  } // login

} // class
