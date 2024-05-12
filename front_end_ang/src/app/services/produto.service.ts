import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { PRODUTO } from '../PRODUTO';
import { ENV } from '../env';


interface Iproduto {
  nome_produto: string;
  descricao: string;
  preco: string;
  quantidade: string;
  fornecedor: string;
}

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

  // obter todos os produtos cadastrados
  getAllProdutos_http(): Observable<PRODUTO[]>  {
    return this.http.get<PRODUTO[]>(ENV.REST_API_URL + '/produto').pipe(
    );
  }


  excluirItem(id_produto: number) {
    return this.http.delete(ENV.REST_API_URL + '/produto/'+id_produto);
  }

  public criarNovoProduto(produto: Iproduto): Observable<any> {
    return this.http.post<any>(ENV.REST_API_URL + '/produto/create', produto, this.httpOptions);
  }
}
