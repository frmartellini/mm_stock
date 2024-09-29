import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { USUARIO } from '../USUARIO';
import { ENV } from '../env';

@Injectable({
  providedIn: 'root'
})

export class UsuarioService {

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private http: HttpClient
  )
  {

  }

  /* obter um usuario pelo id */
  public getUsuario_http(id: number): Observable<USUARIO> {
    const url = `${ENV.REST_API_URL}/usuario/${id}`;
    console.log(url);
    return this.http.get<USUARIO>(url).pipe(
    );
  }

  /* obter um usuario pelo id */
  public getUsuarioByLogin_http(pLogin: string): Observable<USUARIO> {
    const url = `${ENV.REST_API_URL}/usuario/GetByLogin/${pLogin}`;
    console.log(url);
    return this.http.get<USUARIO>(url).pipe(
    );
  }

  public excluirUsuario(id_usuario: number) {
    return this.http.delete(ENV.REST_API_URL + '/usuario/'+id_usuario);
  }

  public criarNovoUsuario(usuario: USUARIO): Observable<any> {
    return this.http.post<any>(ENV.REST_API_URL + '/usuario/create', usuario, this.httpOptions);
  }

  public editarUsuario(usuario: USUARIO, id_usuario: number): Observable<any> {
    return this.http.put<any>(ENV.REST_API_URL + '/usuario/'+id_usuario, usuario, this.httpOptions);
  }

} // UsuarioService
