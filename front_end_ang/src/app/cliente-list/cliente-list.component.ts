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

let CLIENT_DATA: clienteData[] = [];

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
        console.error('Erro ao deletar cliente:', error.error);
        // error.error contém a mensagem de erro enviada pelo servidor
        //alert(error.error);
        this.toastr.error(error.error , 'Erro', {
          disableTimeOut: true
          ,positionClass: 'toast-top-center'
        });
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
