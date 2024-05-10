import { Component, ViewChild, AfterViewInit, OnInit } from '@angular/core';
import { ENV } from '../env';
import { HttpClient } from '@angular/common/http';
import {MatPaginator,} from '@angular/material/paginator';
import {MatSort, } from '@angular/material/sort';
import { MatTableDataSource} from '@angular/material/table';


export interface clienteData{
  id_cliente: number;
  nome_completo: string;
  telefone: string;
  email: string;
  nome_loja: string;
  cnpj: string;
  cpf: string;
  tipo_cliente: string;
  endereco:string;
  numero:number;
  complemento:string;
  cidade:string;
  uf:string;

}

let CLIENT_DATA: clienteData[] = [];


@Component({
  selector: 'app-cliente-list',
  templateUrl: './cliente-list.component.html',
  styleUrl: './cliente-list.component.css',

})
export class ClienteListComponent implements AfterViewInit, OnInit {
  public dataSource : any;
  public displayColumn: string[] = ['id_cliente','nome_completo','telefone','email','nome_loja','cnpj','cpf','tipo_cliente','endereco','numero','complemento','cidade','uf','actions'];
  @ViewChild(MatPaginator) paginator: MatPaginator | any;
  @ViewChild(MatSort) sort: MatSort | any;

  constructor(private http: HttpClient,){}
    //Inicialização dos dados na tabela
  ngOnInit(){
    this.fetchData();
    this.dataSource.sort = this.sort;
    console.log(this.sort)
    this.dataSource.paginator = this.paginator;
    console.log("paginador",this.paginator);

  }
  ngOnChanges(){
    this.dataSource.sort = this.sort;
    console.log(this.sort)
    this.dataSource.paginator = this.paginator;
    console.log("paginador",this.paginator);

  }
  // Obtenção dos Dados da API
    fetchData(): void {
    this.http.get(ENV.REST_API_URL+'/cliente').subscribe(
        (response: any) =>
          {
            CLIENT_DATA = response;
            this.dataSource = new MatTableDataSource(CLIENT_DATA);
            setTimeout(() => {
              console.log(this.sort) //not undefined
              this.dataSource.sort = this.sort;
            })

          }
    )

  }
  //Paginador
  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    console.log(this.sort)
    this.dataSource.paginator = this.paginator;
    console.log("paginador",this.paginator);


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
