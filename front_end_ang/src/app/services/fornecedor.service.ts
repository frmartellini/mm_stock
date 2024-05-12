import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {FORNECEDOR} from'../FORNECEDOR';
import { ENV } from '../env';

interface Ifornecedor {
  nome_fornecedor: string;
  nome_responsavel: string;
  contato_telefonico: string;
  redes_sociais: string;
  materiais_fornecidos: string;
  cnpj: string;
  endereco: string;
  numero: string;
  complemento: string;
  cidade: string;
  uf: string;
}


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

  public criarNovoFornecedor(fornecedor: Ifornecedor): Observable<any> {
    return this.http.post<any>(ENV.REST_API_URL + '/fornecedor/create', fornecedor, this.httpOptions);
  }
}
