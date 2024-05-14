import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { PRODUTO } from '../PRODUTO';
import { ENV } from '../env';
import { PRODUTO_COR } from '../PRODUTO_COR';
import { PRODUTO_TAMANHO } from '../PRODUTO_TAMANHO';
import { PRODUTO_TIPOMATERIAL } from '../PRODUTO_TIPOMATERIAL';

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

  // obter as cores dos produtos cadastrados
  getCoresProdutos_http(): Observable<PRODUTO_COR[]>  {
    return this.http.get<PRODUTO_COR[]>(ENV.REST_API_URL + '/produto/cores').pipe(
    );
  }

  // obter os tamanhos dos produtos cadastrados
  getTamanhosProdutos_http(): Observable<PRODUTO_TAMANHO[]>  {
    return this.http.get<PRODUTO_TAMANHO[]>(ENV.REST_API_URL + '/produto/tamanhos').pipe(
    );
  }

  // obter os tipos de material dos produtos cadastrados
  getTiposMaterialProdutos_http(): Observable<PRODUTO_TIPOMATERIAL[]>  {
    return this.http.get<PRODUTO_TIPOMATERIAL[]>(ENV.REST_API_URL + '/produto/tipos_material').pipe(
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
