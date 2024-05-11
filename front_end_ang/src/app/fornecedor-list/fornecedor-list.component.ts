import { Component,ViewChild,AfterViewInit,OnInit } from '@angular/core';
import { ENV } from '../env';
import { HttpClient } from '@angular/common/http';
import {MatPaginator,} from '@angular/material/paginator';
import {MatSort, } from '@angular/material/sort';
import { MatTableDataSource} from '@angular/material/table';

export interface fornecedorData{
  id_fornecedor: number;
  nome_fornecedor: string;
  nome_responsavel: string;
  contato_telefonico: string;
  redes_sociais: string;
  materiais_fornecidos: string;
  cnpj: string;
  endereco:string;
  numero:number;
  complemento:string;
  cidade:string;
  uf:string;

}

let FORNECEDOR_DATA: fornecedorData[]=[];
@Component({
  selector: 'app-fornecedor-list',
  templateUrl: './fornecedor-list.component.html',
  styleUrl: './fornecedor-list.component.css'
})
export class FornecedorListComponent implements AfterViewInit, OnInit {
  dataSource : any;
  public displayColumn: string[] = ['id_fornecedor','nome_fornecedor','nome_responsavel','contato_telefonico','redes_sociais','cnpj','endereco','numero','complemento','cidade','uf','actions'];
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
  // Obtenção dos Dados da API
  fetchData(): void {
    this.http.get(ENV.REST_API_URL+'/fornecedor').subscribe(
        (response: any) =>
          {
            FORNECEDOR_DATA = response;
            this.dataSource = new MatTableDataSource(FORNECEDOR_DATA);
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
