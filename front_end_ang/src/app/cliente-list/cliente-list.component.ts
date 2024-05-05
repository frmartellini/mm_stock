import { Component, ViewChild } from '@angular/core';
import { ENV } from '../env';
import {MatPaginator, } from '@angular/material/paginator';
import {MatSort,} from '@angular/material/sort';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-cliente-list',
  templateUrl: './cliente-list.component.html',
  styleUrl: './cliente-list.component.css',
})
export class ClienteListComponent {
  public dataSource: any = [];
  public displayColumn: string[] = ['id_cliente','nome_completo','telefone','email','nome_loja','cnpj','cpf','tipo_cliente','endereco','numero','complemento','cidade','uf'];
  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;
  @ViewChild(MatSort) sort: MatSort | undefined;

  constructor(private http: HttpClient){}
  //Paginador
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  //Inicialização dos dados na tabela
  ngOnInit(){
    this.fetchData();
  }
  // Obtenção dos Dados da API
    fetchData(): void {
    this.http.get(ENV.REST_API_URL+'/cliente').subscribe(
        (response: any) =>
          {this.dataSource = response;
          console.table(this.dataSource)

      })

  }
  //filtro
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
