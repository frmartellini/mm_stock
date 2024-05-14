import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { PRODUTO } from '../PRODUTO';
import { ENV } from '../env';

@Injectable({
  providedIn: 'root'
})

export class ProdutoService {

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private http: HttpClient
  )
  {

  }

  /* obter um produto pelo id */
  getProduto_http(id: number): Observable<PRODUTO> {
    const url = `${ENV.REST_API_URL}/produto/${id}`;
    console.log(url);
    return this.http.get<PRODUTO>(url).pipe(
    );
  }

  // obter todos os produtos cadastrados
  getAllProdutos_http(): Observable<PRODUTO[]>  {
    return this.http.get<PRODUTO[]>(ENV.REST_API_URL + '/produto').pipe(
    );
  }


  excluirItem(id_produto: number) {
    return this.http.delete(ENV.REST_API_URL + '/produto/'+id_produto);
  }

  public criarNovoProduto(produto: PRODUTO): Observable<any> {
    return this.http.post<any>(ENV.REST_API_URL + '/produto/create', produto, this.httpOptions);
  }

  public editarProduto(produto: PRODUTO, id_produto: number): Observable<any> {
    return this.http.put<any>(ENV.REST_API_URL + '/produto/'+id_produto, produto, this.httpOptions);
  }

}
