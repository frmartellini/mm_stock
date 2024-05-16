import { Component,ViewChild,AfterViewInit,OnInit} from '@angular/core';
import { ENV } from '../env';
import { HttpClient } from '@angular/common/http';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import { MatTableDataSource} from '@angular/material/table';
import { MovimentacaoService } from '../services/movimentacao.service';
import Utils from '../utils';
import { FormControl, FormGroup } from '@angular/forms';
import { DatePipe } from '@angular/common'
import { CookieService } from 'ngx-cookie-service';

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
  public displayColumn: string[] = ['id_movimentacao','data_hora','produto','tipo_mov','quantidade','num_pedido','cliente','obs']; //,'actions'
  @ViewChild(MatPaginator) paginator: MatPaginator | any;
  @ViewChild(MatSort) sort: MatSort | any;

  // "publicar" a funcao que retorna a descricao do tipo de movimentacao para o .html conseguir usar
  public getTipoMovText = Utils.getTipoMovText;

  // guarda as datas do filtro por periodo no formato yyyy/MM/dd
  dhinicio_str: string | null = "";
  dhfim_str: string | null = "";

  periodo_range = new FormGroup({
    dhinicio: new FormControl<Date | null>(null),
    dhfim: new FormControl<Date | null>(null),
  });

  constructor(private http: HttpClient
              , private movimentacaoService: MovimentacaoService
              , public datepipe: DatePipe
              , private cookieService: CookieService
              )
  {

  }

    //Inicialização dos dados na tabela
  ngOnInit(){

    // obter as datas dos cookies
    this.dhinicio_str = this.cookieService.get('movimentacao-cs-dhinicio');
    this.dhfim_str = this.cookieService.get('movimentacao-cs-dhfim');
    //console.log("dhinicio_str carregado do cookie=" + this.dhinicio_str);
    //console.log("dhfim_str carregado do cookie=" + this.dhfim_str);

    // setar as datas do "periodo_filtro_daterangepicker" com as datas obtidas dos cookies
    try {
      this.periodo_range.get("dhinicio")?.setValue(new Date(this.dhinicio_str));
      this.periodo_range.get("dhfim")?.setValue(new Date(this.dhfim_str));
    }
    catch {}

    this.fetchData();
  } // ngOnInit

  // Obtenção dos Dados da API
  fetchData(): void {
    
    // api que retorna tudo porque nao receb params de data de inicio de data de fim
    //this.http.get(ENV.REST_API_URL+'/movimentacao').subscribe(
    
    // exemplo de como fica a chamada a api movimentacao_por_periodo, atencao com o formato da data
    //this.http.get(ENV.REST_API_URL+'/movimentacao_por_periodo?dhinicio=2024-05-15&dhfim=2024-05-16').subscribe(
    
    // chamar a api que recebe a data inicial e a data final para retornar apenas as movimentacoes do periodo
    this.http.get(ENV.REST_API_URL+'/movimentacao_por_periodo?dhinicio='+ this.dhinicio_str +'&dhfim='+ this.dhfim_str + '/').subscribe(
        (response: any) =>
          {
            MOVIMENTACAO_DATA = response;
            this.dataSource = new MatTableDataSource(MOVIMENTACAO_DATA);
            this.dataSource.sortingDataAccessor = this.sortingDataAccessor;
            this.dataSource.sort = this.sort;
            this.dataSource.paginator = this.paginator;
            //console.log("subscribe do fetchData executou");
          }
    )
  } // fetchData

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

  // //Deletar Movimentação
  // excluirMovimentacao(id_movimentacao: number) {
  //   if (confirm('Tem certeza que deseja excluir esta Movimentação?')) {
  //       this.movimentacaoService.excluirMovimentacao(id_movimentacao).subscribe(() => {
  //       this.fetchData(); // Recarregar os itens após a exclusão

  //     });
  //   }
  // }

  //filtro digitado pelo usuario
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

  // botao Filtrar do filtro por periodo
  BtnFiltroPeriodoClick(event: Event) {
    
    var val_dhini_picker = this.periodo_range.get("dhinicio")?.value;
    var val_dhfim_picker = this.periodo_range.get("dhfim")?.value;
    //console.log("val_dhini_picker=" + val_dhini_picker);
    //console.log("val_dhfim_picker=" + val_dhfim_picker);

    //if ( ( isNaN (val_dhini_picker?.getTime()) )  || ( isNaN (val_dhfim_picker?.getTime()) )  ) {
    //if ( this.periodo_range.get("dhinicio")?.hasError('matDatepickerParse') || this.periodo_range.get("dhfim")?.hasError('matDatepickerParse') ) {
    if ( ( ! Utils.isDate(val_dhini_picker) ) || ( ! Utils.isDate(val_dhfim_picker) )  ) {  
      alert("As datas de início de fim devem ser informadas!");
      return;
    }

    this.dhinicio_str = this.datepipe.transform(val_dhini_picker, 'yyyy/MM/dd');
    this.dhfim_str = this.datepipe.transform(val_dhfim_picker, 'yyyy/MM/dd') ;
    //console.log("periodo=" + this.dhinicio_str + " - " + this.dhfim_str);
    
    // gravar os cookies com as datas do periodo do filtro
    this.cookieService.set( 'movimentacao-cs-dhinicio', this.dhinicio_str ?? "" );
    this.cookieService.set( 'movimentacao-cs-dhfim', this.dhfim_str ?? "" );

    this.fetchData();
  } // BtnFiltroPeriodoClick

} // class
