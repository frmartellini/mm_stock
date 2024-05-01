import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  public username: string;
  public password: string;

  constructor(private router: Router, private authService: AuthenticationService) { 

    this.username = "";
    this.password = "";

  }

  login() {

    if ( this.authService.login(this.username, this.password) ) {

      // Se o login for bem-sucedido, redirecione para a página principal
      this.router.navigate(['/']);

    }
    else {

      // Em caso de erro, manipule-o de acordo (ex: exibir mensagem de erro)
      console.error("login nao foi realizado");

    }

    /*
    this.authService.login(this.username, this.password)
      .subscribe(
        data => {
          // Se o login for bem-sucedido, redirecione para a página principal
          this.router.navigate(['/']);
        },
        error => {
          // Em caso de erro, manipule-o de acordo (ex: exibir mensagem de erro)
          console.error(error);
        }
      );
    */
  }
}
