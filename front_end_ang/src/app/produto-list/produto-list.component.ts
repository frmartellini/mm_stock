import { Component,ViewChild,OnInit} from '@angular/core';
import { ENV } from '../env';
import { HttpClient } from '@angular/common/http';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import { MatTableDataSource} from '@angular/material/table';
import { ProdutoService } from '../services/produto.service';
import { ToastrService } from 'ngx-toastr';

export interface produtoData{

  id_produto: number;
  descricao: string;
  cor: string;
  tamanho: string;
  tipo_material: string;
  preco_venda: number;
  quantidade_atual: number;
}

let PRODUTO_DATA: produtoData[]=[];
@Component({
  selector: 'app-produto-list',
  templateUrl: './produto-list.component.html',
  styleUrl: './produto-list.component.css',

})
export class ProdutoListComponent implements OnInit {
  public dataSource : any; // apenas declarar aqui porque este obj vai ser criado soh depois quando os regs forem obtidos do bd
  public displayColumn: string[] = ['id_produto','descricao','cor','tamanho','tipo_material','preco_venda','quantidade_atual','actions'];
  @ViewChild(MatPaginator) paginator: MatPaginator | any;
  @ViewChild(MatSort) sort: MatSort | any;

  constructor(private http: HttpClient
              ,private produtoService: ProdutoService
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
    this.http.get(ENV.REST_API_URL+'/produto').subscribe(
        (response: any) =>
          {
            PRODUTO_DATA = response;
            this.dataSource = new MatTableDataSource(PRODUTO_DATA);
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
  excluirItem(id_produto: number) {
    if (confirm('Tem certeza que deseja excluir este produto?')) {
      this.produtoService.excluirItem(id_produto).subscribe(() => {
        // avisar o usuario
        this.toastr.success('Produto excluído com sucesso!' , '', {
          timeOut: 3000
          ,positionClass: 'toast-top-center'
        });
        this.fetchData(); // Recarregar os itens após a exclusão
      },
      (error) => {
        console.error('Erro ao deletar post:', error.error);
        // error.error contém a mensagem de erro enviada pelo servidor
        alert(error.error.error);
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

  ngOnChanges(){
    this.dataSource.sort = this.sort;
    console.log(this.sort)
    this.dataSource.paginator = this.paginator;
    console.log("paginador",this.paginator);

  }

}
