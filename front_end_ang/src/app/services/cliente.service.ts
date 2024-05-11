import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { CLIENTE_PESQ } from '../CLIENTE_PESQ';
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

  // obter todos os clientes cadastrados (só os campos id_cliente e nome_completo)
  getAllClientesPesq_http(): Observable<CLIENTE_PESQ[]>  {
    return this.http.get<CLIENTE_PESQ[]>(ENV.REST_API_URL + '/clientes/names').pipe(
    );
  }
  excluirCliente(id_cliente: number) {
    return this.http.delete(ENV.REST_API_URL + '/cliente/'+id_cliente);
  }

}
