import { Component, ViewChild, AfterViewInit, OnInit } from '@angular/core';
import { ENV } from '../env';
import { HttpClient } from '@angular/common/http';
import {MatPaginator,} from '@angular/material/paginator';
import {MatSort, } from '@angular/material/sort';
import { MatTableDataSource} from '@angular/material/table';
import { ClienteService } from '../services/cliente.service';
import { clienteData } from '../CLIENTEDATA';
import { ToastrService } from 'ngx-toastr';

import { AuthenticationService } from '../services/authentication.service';
import Utils from '../utils';
import { MatSelectionList } from '@angular/material/list';
import { UsuarioService } from '../services/usuario.service';

let CLIENT_DATA: clienteData[] = [];

{


}


@Component({
  selector: 'app-cliente-list',
  templateUrl: './cliente-list.component.html',
  styleUrl: './cliente-list.component.scss',

})

export class ClienteListComponent implements OnInit {
  public dataSource : any;
  public displayColumn: string[] = ['id_cliente','nome_completo','telefone','email','nome_loja','cnpj','cpf','tipo_cliente','cidade','uf','actions'];
  @ViewChild(MatPaginator) paginator: MatPaginator | any;
  @ViewChild(MatSort) sort: MatSort | any;
public bPodeIncluir : boolean = false;
public bPodeEditar : boolean = false;
public bPodeExcluir : boolean = false;
// precisa ter esta declaracao public para poder chamar do template HTML
public GetEditarLink = Utils.GetEditarLink;


  constructor(private http: HttpClient
    ,private authservice: AuthenticationService
    ,private clienteService: ClienteService
    ,private toastr: ToastrService
  )
  {

  // inicializar as vars
  this.bPodeIncluir = this.authservice.CheckPrivilegio("CadCliInc");
  //console.log("bPodeIncluir=" + this.bPodeIncluir);
  this.bPodeEditar = this.authservice.CheckPrivilegio("CadCliEdi");
  //console.log("bPodeEditar=" + this.bPodeEditar);
  this.bPodeExcluir = this.authservice.CheckPrivilegio("CadCliExc");
  //console.log("bPodeExcluir=" + this.bPodeExcluir);




  }
  public PrivilegiosObj = UsuarioService.PrivilegiosObj;
  @ViewChild('privilegios') ListPrivilegios: MatSelectionList = {} as MatSelectionList;
    // obter uma string com zeros e uns (a partir do controle mat-selection-list) representando os privilegios do usuario
    public GetStrPriv(pCtrlList :MatSelectionList) : string {

      let str_privs : string = ""; // var que serah retornada pela funcao
  
      // se o pCtrlList eh valido e possui opcoes
      if ( pCtrlList && pCtrlList.options) {
        // inicializar a strng com zero em cada char da string
        str_privs = "0".repeat(pCtrlList.options.length);
        //console.log("str_privs inicialziado="+str_privs+ " length="+ str_privs.length);
        // passar pelos itens (privilegios)
        for ( let i = 0; i < pCtrlList.options.length; i++ ) {
  
          if ( pCtrlList.options.get(i)?.selected ) {
            // remontar a string trocando o char da posicao i de 0 para 1
            str_privs = str_privs.substring(0,i) + "1" + str_privs.substring(i+1);
          }
  
          //console.log(i + "  str_privs final="+str_privs + " length="+ str_privs.length);
        } // for
        
      } // if
  
      //console.log("str_privs final="+str_privs + " length="+ str_privs.length);
      return str_privs;
    } // GetStrPriv
  
    // selecionar os itens do mat-selection-list a partir da string contendo os zeros e uns indicando os privilegios
    public RestoreStrPriv(pCtrlList :MatSelectionList, pStrPrivs :String) {
      //console.log("RestoreStrPriv - inicio");
      //console.log("pStrPrivs=" + pStrPrivs);
      let str_privs : string = "";
  
      if ( pCtrlList && pCtrlList.options && pStrPrivs ) {
        //console.log("RestoreStrPriv - entrou no if");
        // passar por cada opcao e selecionar a opcao se o char da string for 1
        for (let i = 0; i < pCtrlList.options.length; i++ ) {
          if ( pStrPrivs.charAt(i) == '1' ) {
            pCtrlList.options.get(i)?._setSelected(true);
          }
        } // for
      } // if
      //console.log("RestoreStrPriv - fim");
      return str_privs;
    } // RestoreStrPriv  
  //Inicialização dos dados na tabela
  ngOnInit(){
    this.fetchData();
    //console.log("UsuarioListComponent.ngOnInit - this.authservice.UsuarioLogado=" + JSON.stringify(this.authservice.UsuarioLogado));
  }
  // Obtenção dos Dados da API
    fetchData(): void {
    this.http.get(ENV.REST_API_URL+'/cliente').subscribe(
        (response: any) =>
          {
            CLIENT_DATA = response;
            this.dataSource = new MatTableDataSource(CLIENT_DATA);
            this.dataSource.sort = this.sort;
            this.dataSource.paginator = this.paginator;
          }
    )
 }

   //Deletar cadastro
   excluirCliente(id_cliente: number) {
    if (confirm('Tem certeza que deseja excluir este cliente?')) {
      this.clienteService.excluirCliente(id_cliente).subscribe(() => {
        // avisar o usuario
        this.toastr.success('Cliente excluído com sucesso!' , '', {
          timeOut: 3000
          ,positionClass: 'toast-top-center'
        });
        this.fetchData(); // Recarregar os itens após a exclusão
      },
      (error) => {
        console.error('Erro ao deletar post:', error.error);
        // error.error contém a mensagem de erro enviada pelo servidor
        alert(error.error);
      }); // subscribe
    } // confirm
  } // excluirCliente

  //filtro
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

}
