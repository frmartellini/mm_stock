import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { USUARIO } from '../USUARIO';
import { ENV } from '../env';

@Injectable({
  providedIn: 'root'
})

export class UsuarioService {

 // "tabela em memoria" com os privilegios do sistema
 // sao 3 colunas:
 // pos = posicao do provilegio na string
 // cod = codigo do privilegio
 // desc = descricao do privilegio
 public static PrivilegiosObj = [
   { "pos": "1",  "cod": "CadCliCon", "desc":"Cadastro de Clientes - Consulta" }
  ,{ "pos": "2",  "cod": "CadCliInc", "desc":"Cadastro de Clientes - Inclusão" }
  ,{ "pos": "3",  "cod": "CadCliEdi", "desc":"Cadastro de Clientes - Edição" }
  ,{ "pos": "4",  "cod": "CadCliExc", "desc":"Cadastro de Clientes - Exclusão" }

  ,{ "pos": "5",  "cod": "CadProdCon", "desc":"Cadastro de Produtos - Consulta" }
  ,{ "pos": "6",  "cod": "CadProdInc", "desc":"Cadastro de Produtos - Inclusão" }
  ,{ "pos": "7",  "cod": "CadProdEdi", "desc":"Cadastro de Produtos - Edição" }
  ,{ "pos": "8",  "cod": "CadProdExc", "desc":"Cadastro de Produtos - Exclusão" }

  ,{ "pos": "9",  "cod": "CadFornCon", "desc":"Cadastro de Fornecedores - Consulta" }
  ,{ "pos": "10", "cod": "CadFornInc", "desc":"Cadastro de Fornecedores - Inclusão" }
  ,{ "pos": "11", "cod": "CadFornEdi", "desc":"Cadastro de Fornecedores - Edição" }
  ,{ "pos": "12", "cod": "CadFornExc", "desc":"Cadastro de Fornecedores - Exclusão" }

  ,{ "pos": "13", "cod": "CadUsuCon", "desc":"Cadastro de Usuários - Consulta" }
  ,{ "pos": "14", "cod": "CadUsuInc", "desc":"Cadastro de Usuários - Inclusão" }
  ,{ "pos": "15", "cod": "CadUsuEdi", "desc":"Cadastro de Usuários - Edição" }
  ,{ "pos": "16", "cod": "CadUsuExc", "desc":"Cadastro de Usuários - Exclusão" }

  ,{ "pos": "17", "cod": "Entrada",   "desc":"Entrada de Produto" }
  ,{ "pos": "18", "cod": "Saida",     "desc":"Saída de Produto" }
  ,{ "pos": "19", "cod": "CsMovEstq", "desc":"Consulta de Movimentação do Estoque" }
  ,{ "pos": "20", "cod": "AnEstoque", "desc":"Gráfico de Análise de Estoque" }
  ,{ "pos": "21", "cod": "AnVendas", "desc":"Gráfico de Análise de Vendas" }

];

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

  public async getUsuarioByLogin_http_sync(pLogin: string) {
    const url = `${ENV.REST_API_URL}/usuario/GetByLogin/${pLogin}`;
    //console.log("getUsuarioByLogin_http_sync - " + url);
    return this.http.get<USUARIO>(url).toPromise();
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
