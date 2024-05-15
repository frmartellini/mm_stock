import { Component,ViewChild,AfterViewInit,OnInit} from '@angular/core';
import { ENV } from '../env';
import { HttpClient } from '@angular/common/http';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import { MatTableDataSource} from '@angular/material/table';
import { MovimentacaoService } from '../services/movimentacao.service';
import Utils from '../utils';

export interface movimentacaoData{

  id_movimentacao: number;
  data_hora: string;
  id_produtor: number;
  tipo_mov: string;
  quantidade: number;
  num_pedido: number;
  id_cliente: number;
  obs: string;
  nome_completo: string;
  descricao: string;
}

let MOVIMENTACAO_DATA: movimentacaoData[]=[];

@Component({
  selector: 'app-movimentacao-cs',
  templateUrl: './movimentacao-cs.component.html',
  styleUrl: './movimentacao-cs.component.css'
})
export class MovimentacaoCsComponent implements OnInit {

  public dataSource : any; // apenas declarar aqui porque este obj vai ser criado soh depois quando os regs forem obtidos do bd
  // colunas que serao exibidas pelo table
  public displayColumn: string[] = ['id_movimentacao','data_hora','produto','tipo_mov','quantidade','num_pedido','cliente','obs','actions'];
  @ViewChild(MatPaginator) paginator: MatPaginator | any;
  @ViewChild(MatSort) sort: MatSort | any;

  // "publicar" a funcao que retorna a descricao do tipo de movimentacao para o .html conseguir usar
  public getTipoMovText = Utils.getTipoMovText;

  constructor(private http: HttpClient, private movimentacaoService: MovimentacaoService){}
    //Inicialização dos dados na tabela
  ngOnInit(){
    this.fetchData();
  }
   // Obtenção dos Dados da API
   fetchData(): void {
    this.http.get(ENV.REST_API_URL+'/movimentacao').subscribe(
        (response: any) =>
          {
            MOVIMENTACAO_DATA = response;
            this.dataSource = new MatTableDataSource(MOVIMENTACAO_DATA);
            this.dataSource.sortingDataAccessor = this.sortingDataAccessor;
            this.dataSource.sort = this.sort;
            this.dataSource.paginator = this.paginator;
          }
    )
  }

  // Funcao para customizar a ordenacao do table e configurar a ordenacao de algumas colunas especificas.
  // Esta funcao eh executada uma vez para cada linha da tabela quando a ordenacao eh alterada.
  // "property" contem uma string com o nome da coluan clicada
  // "item" eh o obj com os dados da linha que estah sendo avaliada no processo de ordenacao.
  // "item" contem props com os mesmos nomes dos campos retornados pela API do back-end.
  private sortingDataAccessor (item :any, property: string)  {
    //console.log("sortingDataAccessor - property=" + property);
    //console.log("sortingDataAccessor - item=" + JSON.stringify(item));
    switch (property) {
      case 'produto': return item.id_produto;
      case 'cliente': return item.nome_completo;
      default: return item[property] || '';
    }
  } // sortingDataAccessor

  //Deletar Movimentação
  excluirMovimentacao(id_movimentacao: number) {
    if (confirm('Tem certeza que deseja excluir esta Movimentação?')) {
        this.movimentacaoService.excluirMovimentacao(id_movimentacao).subscribe(() => {
        this.fetchData(); // Recarregar os itens após a exclusão

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
