import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { CLIENTE_PESQ } from '../CLIENTE_PESQ';
import { ENV } from '../env';


interface Icliente {
  //nome_completo, telefone, email, nome_loja, cnpj, cpf, tipo_cliente, endereco, numero, complemento, cidade, uf
  nome_completo: string;
  telefone: string;
  email: string;
  nome_loja: string;
  cpf: string;
  tipo_cliente: string;
  endereco: string;
  numero: string;
  complemento: string;
  cidade: string;
  uf: string;

}

@Injectable({
  providedIn: 'root'
})

export class ClienteService {

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private http: HttpClient
  )
  {

  }

  // obter todos os clientes cadastrados (só os campos id_cliente e nome_completo)
  getAllClientesPesq_http(): Observable<CLIENTE_PESQ[]>  {
    return this.http.get<CLIENTE_PESQ[]>(ENV.REST_API_URL + '/clientes/names').pipe(
    );
  }
  excluirCliente(id_cliente: number) {
    return this.http.delete(ENV.REST_API_URL + '/cliente/'+id_cliente);
  }

  public criarNovoCliente(cliente: Icliente): Observable<any> {
    //return this.http.post<any>('${ENV.REST_API_URL}/cliente/create', cliente);
    return this.http.post<any>(ENV.REST_API_URL + '/cliente/create', cliente, this.httpOptions);
  }

  public editarCliente(cliente: Icliente, id_cliente: number): Observable<any> {
    return this.http.put<any>(ENV.REST_API_URL + '/cliente/'+id_cliente, cliente, this.httpOptions);
  }

}
