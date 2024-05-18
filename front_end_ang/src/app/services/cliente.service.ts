import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { CLIENTE_PESQ } from '../CLIENTE_PESQ';
import { clienteData } from '../CLIENTEDATA';
import { ENV } from '../env';

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

  /* obter um cliente pelo id */
  getCliente_http(id: number): Observable<clienteData> {
    const url = `${ENV.REST_API_URL}/cliente/${id}`;
    console.log(url);
    return this.http.get<clienteData>(url).pipe(
    );
  }

  // obter todos os clientes cadastrados (só os campos id_cliente e nome_completo)
  getAllClientesPesq_http(): Observable<CLIENTE_PESQ[]>  {
    return this.http.get<CLIENTE_PESQ[]>(ENV.REST_API_URL + '/clientes/names').pipe(
    );
  }
  excluirCliente(id_cliente: number) {
    return this.http.delete(ENV.REST_API_URL + '/cliente/'+id_cliente);
  }

  public criarNovoCliente(cliente: clienteData): Observable<any> {
    //return this.http.post<any>('${ENV.REST_API_URL}/cliente/create', cliente);
    return this.http.post<any>(ENV.REST_API_URL + '/cliente/create', cliente, this.httpOptions);
  }

  public editarCliente(cliente: clienteData, id_cliente: number): Observable<any> {
    return this.http.put<any>(ENV.REST_API_URL + '/cliente/'+id_cliente, cliente, this.httpOptions);
  }

}
