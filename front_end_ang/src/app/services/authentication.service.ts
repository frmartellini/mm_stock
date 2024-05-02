import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { inject } from "@angular/core"
import { Observable, of, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { CONFIG } from "../CONFIG";

@Injectable({
  providedIn: 'root'
})

export class AuthenticationService {

  private isLogado :boolean;

  private router = inject(Router);

  private configs : CONFIG[] = [];

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

}