import { Component,ViewChild,AfterViewInit,OnInit } from '@angular/core';
import { ENV } from '../env';
import { HttpClient } from '@angular/common/http';
import {MatPaginator,} from '@angular/material/paginator';
import {MatSort, } from '@angular/material/sort';
import { MatTableDataSource} from '@angular/material/table';
import { FornecedorService } from '../services/fornecedor.service';
import { FORNECEDOR } from '../FORNECEDOR';


let FORNECEDOR_DATA: FORNECEDOR[]=[];
@Component({
  selector: 'app-fornecedor-list',
  templateUrl: './fornecedor-list.component.html',
  styleUrl: './fornecedor-list.component.css'
})
export class FornecedorListComponent implements OnInit {
  dataSource : any;
  public displayColumn: string[] = ['id_fornecedor','nome_fornecedor','nome_responsavel','contato_telefonico','redes_sociais','cnpj','cidade','uf','actions'];
  @ViewChild(MatPaginator) paginator: MatPaginator | any;
  @ViewChild(MatSort) sort: MatSort | any;

  constructor(private http: HttpClient, private fornecedorService: FornecedorService){}
    //Inicialização dos dados na tabela
  ngOnInit(){
    this.fetchData();


  }
  // Obtenção dos Dados da API
  fetchData(): void {
    this.http.get(ENV.REST_API_URL+'/fornecedor').subscribe(
        (response: any) =>
          {
            FORNECEDOR_DATA = response;
            this.dataSource = new MatTableDataSource(FORNECEDOR_DATA);
            this.dataSource.sort = this.sort;
            this.dataSource.paginator = this.paginator;
           /* setTimeout(() => {
              console.log(this.sort) //not undefined
              this.dataSource.sort = this.sort;
            })*/

          }
    )
  }

  //Deletar cadastro
  excluirFornecedor(id_fornecedor: number) {
    if (confirm('Tem certeza que deseja excluir este fornecedor?')) {
      this.fornecedorService.excluirFornecedor(id_fornecedor).subscribe(() => {
        this.fetchData(); // Recarregar os itens após a exclusão
      },
      (error) => {
        console.error('Erro ao deletar post:', error.error);
        // error.error contém a mensagem de erro enviada pelo servidor
        alert(error.error);
      });
    }
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
