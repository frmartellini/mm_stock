import { Component,ViewChild,AfterViewInit,OnInit} from '@angular/core';
import { ENV } from '../env';
import { HttpClient } from '@angular/common/http';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import { MatTableDataSource} from '@angular/material/table';


export interface movimentacaoData{

  id_movimentacao: number;
  data_hora: string;
  id_produtor: number;
  tipo_mov: string;
  quantidade: number;
  num_pedido: number;
  id_cliente: number;
  obs: string;
}

let MOVIMENTACAO_DATA: movimentacaoData[]=[];

@Component({
  selector: 'app-movimentacao-cs',
  templateUrl: './movimentacao-cs.component.html',
  styleUrl: './movimentacao-cs.component.css'
})
export class MovimentacaoCsComponent implements AfterViewInit, OnInit {

  public dataSource : any; // apenas declarar aqui porque este obj vai ser criado soh depois quando os regs forem obtidos do bd
  public displayColumn: string[] = ['id_movimentacao','data_hora','id_produtor','tipo_mov','quantidade','num_pedido','id_cliente','obs','actions'];
  @ViewChild(MatPaginator) paginator: MatPaginator | any;
  @ViewChild(MatSort) sort: MatSort | any;

  constructor(private http: HttpClient,){}
    //Inicialização dos dados na tabela
  ngOnInit(){
    this.fetchData();
    console.table(this.dataSource);
    this.dataSource.sort = this.sort;
    console.log(this.sort)
    this.dataSource.paginator = this.paginator;
    console.log("paginador",this.paginator);

  }
   // Obtenção dos Dados da API
   fetchData(): void {
    this.http.get(ENV.REST_API_URL+'/movimentacao').subscribe(
        (response: any) =>
          {
            MOVIMENTACAO_DATA = response;
            this.dataSource = new MatTableDataSource(MOVIMENTACAO_DATA);
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

  ngOnChanges(){
    this.dataSource.sort = this.sort;
    console.log(this.sort)
    this.dataSource.paginator = this.paginator;
    console.log("paginador",this.paginator);

  }

}
