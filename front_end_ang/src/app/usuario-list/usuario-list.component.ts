import { Component, ViewChild, AfterViewInit, OnInit } from '@angular/core';
import { ENV } from '../env';
import { HttpClient } from '@angular/common/http';
import {MatPaginator,} from '@angular/material/paginator';
import {MatSort, } from '@angular/material/sort';
import { MatTableDataSource} from '@angular/material/table';
import { UsuarioService } from '../services/usuario.service';
import { USUARIO } from '../USUARIO';
import { ToastrService } from 'ngx-toastr';

let USUARIO_DATA: USUARIO[] = [];

@Component({
  selector: 'app-usuario-list',
  templateUrl: './usuario-list.component.html',
  styleUrl: './usuario-list.component.scss',

})

export class UsuarioListComponent implements OnInit {
  public dataSource : any;
  public displayColumn: string[] = ['id_usuario','login','nome','actions'];
  @ViewChild(MatPaginator) paginator: MatPaginator | any;
  @ViewChild(MatSort) sort: MatSort | any;

  constructor(private http: HttpClient
              ,private usuarioService: UsuarioService
              ,private toastr: ToastrService
            )
  {

  }

    //Inicialização dos dados na tabela
  ngOnInit(){
    this.fetchData();
  }
  // Obtenção dos Dados da API
    fetchData(): void {
    this.http.get(ENV.REST_API_URL+'/usuario').subscribe(
        (response: any) =>
          {
            USUARIO_DATA = response;
            this.dataSource = new MatTableDataSource(USUARIO_DATA);
            this.dataSource.sort = this.sort;
            this.dataSource.paginator = this.paginator;
          }
    )
 }

  //Deletar cadastro
  excluirUsuario(id_usuario: number) {
    if (confirm('Tem certeza que deseja excluir este usuário?')) {
      this.usuarioService.excluirUsuario(id_usuario).subscribe(() => {
        // avisar o usuario
        this.toastr.success('Usuário excluído com sucesso!' , '', {
          timeOut: 3000
          ,positionClass: 'toast-top-center'
        });
        this.fetchData(); // Recarregar os itens após a exclusão
      },
      (error) => {
        console.error('Erro ao deletar usuario:', error.error);
        // error.error contém a mensagem de erro enviada pelo servidor
        alert(error.error);
      }); // subscribe
    } // confirm
  } // excluirUsuario

  //filtro
  
  // todo& parece que este filtro estah considerando os campos que nao sao exibidos na tabela e precisa corrigir isso
  
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

} // class
