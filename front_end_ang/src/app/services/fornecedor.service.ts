import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {FORNECEDOR} from'../FORNECEDOR';
import { ENV } from '../env';

@Injectable({
  providedIn: 'root'
})

export class FornecedorService {

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private http: HttpClient
  )
  {

  }

  // obter todos os fornecedores cadastrados
  getAllFornecedores_http(): Observable<FORNECEDOR[]>  {
    return this.http.get<FORNECEDOR[]>(ENV.REST_API_URL + '/fornecedor').pipe(
    );
  }


  excluirFornecedor(id_fornecedor: number) {
    return this.http.delete(ENV.REST_API_URL + '/fornecedor/'+id_fornecedor);
  }
}
