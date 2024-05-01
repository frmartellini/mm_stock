import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { inject } from "@angular/core"

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  private isLogado :boolean ;

  private router = inject(Router);

  //constructor(private http: HttpClient) { 
    constructor() { 

    this.isLogado = false;

  }

  login(username: string, password: string) : boolean {

    //const bcrypt = require('bcryptjs')

    // Hash da senha
    //const hashedPassword = bcrypt.hashSync(password, 10);


    this.isLogado = this.mockUsuarioLogin(username, password);
    return this.isLogado;
    
    
    // Enviar a solicitação de login para o backend
    //return this.http.post<any>('<http://seu-backend.com/login>', { username, password: hashedPassword });
  }

  deslogar() {

    this.isLogado = false;

    this.router.navigate(['login']);

  }


  private mockUsuarioLogin(username: string, password :string): boolean {
    if (username === "admin" && password == "123") {
      return true;
    }
    return false;
  }

  public IsLogado() : boolean {

    //console.log(" IsLogado() foi executado e vai retornar "+ this.isLogado);

    return this.isLogado;
  }

}