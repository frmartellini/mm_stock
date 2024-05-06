import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { MOVIMENTACAO } from '../MOVIMENTACAO';
import { ENV } from '../env';

@Injectable({
  providedIn: 'root'
})

export class MovimentacaoService {

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private http: HttpClient
              )
  {
    
  }

  /* obter uma movimentacao pelo id */
  getMovimentacao_http(id: number): Observable<MOVIMENTACAO> {
    const url = `${ENV.REST_API_URL}/movimentacao/${id}`;
    console.log(url);
    return this.http.get<MOVIMENTACAO>(url).pipe(
    );
  }

  // incluir uma nova movimentacao
  createMovimentacao_http(mov: MOVIMENTACAO): Observable<any> {
    return this.http.post(ENV.REST_API_URL+'/movimentacao/create', JSON.stringify(mov), this.httpOptions).pipe(
    );
  }

}
