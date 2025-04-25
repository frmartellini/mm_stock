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
import { Observable, of } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';

export interface movimentacaoData{

  id_movimentacao: number;
  data_hora: string;
  id_produto: number;
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
  styleUrl: './movimentacao-cs.component.scss'
})
export class MovimentacaoCsComponent implements OnInit {

  filtroControl = new FormControl('');
  filteredOptions: Observable<{ type: string; value: string; }[]> | undefined;
  clientesOptions: {id: number, nome: string}[] = [];
  produtosOptions: {id: number, descricao: string}[] = [];

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
  // guarda as datas do filtro por periodo em obj tipo Date
  val_dhini_picker : any; // Date
  val_dhfim_picker : any;  // Date

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

    // se a data inicio ou data fim do "periodo_range" for invalido/vazio, vamos inicializar com o periodo sendo o fim a data atual e o inicio vai ser 6 dias atras
    if ( ( ! Utils.isDate(this.periodo_range.get("dhinicio")?.value) ) || ( ! Utils.isDate(this.periodo_range.get("dhinicio")?.value) )  ) {
      this.periodo_range.get("dhfim")?.setValue(new Date());
      // calcular a data inicial que vai ser a data atual menos 6 dias
      var data_fim :Date;
      data_fim = new Date();
      data_fim.setDate(data_fim.getDate() - 6);
      this.periodo_range.get("dhinicio")?.setValue(data_fim );

      // atualziar as vars Date e string usadas no filtro por periodo
      this.Update_vars_dh_filtro();
    }

    this.fetchData();

    // Configura o filtro de autocomplete
    this.filteredOptions = this.filtroControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filterOptions(value || ''))
  );
  } // ngOnInit

  // Obtenção dos Dados da API
  fetchData(): void {

    // api que retorna tudo porque nao receb params de data de inicio de data de fim
    //this.http.get(ENV.REST_API_URL+'/movimentacao').subscribe(

    // exemplo de como fica a chamada a api movimentacao_por_periodo, atencao com o formato da data
    //this.http.get(ENV.REST_API_URL+'/movimentacao_por_periodo?dhinicio=2024-05-15&dhfim=2024-05-16').subscribe(

    // chamar a api que recebe a data inicial e a data final para retornar apenas as movimentacoes do periodo
    // precisa passar a hora23:59:59 no param dhfim para considerar o dia final todo
    this.http.get(ENV.REST_API_URL+'/movimentacao_por_periodo?dhinicio='+ this.dhinicio_str +'&dhfim='+ this.dhfim_str + ' 23:59:59/').subscribe(
      (response: any) => {
        MOVIMENTACAO_DATA = response;
        this.dataSource = new MatTableDataSource(MOVIMENTACAO_DATA);
        this.dataSource.sortingDataAccessor = this.sortingDataAccessor;
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;

        // Extrair opções únicas para autocomplete dos dados recebidos
        this.extrairOpcoesAutocomplete(response);
            //console.log("subscribe do fetchData executou");
          }
    )
  } // fetchData

  // Método para extrair opções únicas dos dados recebidos
extrairOpcoesAutocomplete(data: movimentacaoData[]) {
  const clientesMap = new Map<number, string>();
  const produtosMap = new Map<number, string>();

  data.forEach(item => {
    // Extrair clientes únicos
    if (item.id_cliente && item.nome_completo) {
      clientesMap.set(item.id_cliente, item.nome_completo);
    }

    // Extrair produtos únicos
    if (item.id_produto && item.descricao) {
      produtosMap.set(item.id_produto, item.id_produto + " - " + item.descricao);
    }
  });

  // Converter Map para array de objetos
  this.clientesOptions = Array.from(clientesMap).map(([id, nome]) => ({ id, nome }));
  this.produtosOptions = Array.from(produtosMap).map(([id, descricao]) => ({ id, descricao }));
}

// Filtro para as opções de autocomplete
private _filterOptions(value: string): {type: string, value: string}[] {
  const filterValue = value.toLowerCase();

  const clientesFiltrados = this.clientesOptions
    .filter(option => option.nome.toLowerCase().includes(filterValue))
    .map(option => ({ type: 'Cliente', value: option.nome }));

  const produtosFiltrados = this.produtosOptions
    .filter(option => option.descricao.toLowerCase().includes(filterValue))
    .map(option => ({ type: 'Produto', value: option.descricao }));

  return [...clientesFiltrados, ...produtosFiltrados];
}

// Método que é chamado quando uma opção é selecionada
onOptionSelected(event: MatAutocompleteSelectedEvent) {
  const selectedValue = event.option.value;
  this.filtroControl.setValue(selectedValue);

  // Aplica o filtro quando uma opção é selecionada
  this.dataSource.filter = selectedValue.toLowerCase();
  if (this.dataSource.paginator) {
    this.dataSource.paginator.firstPage();
  }
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

  // atualizar as vars do tipo Date e string que sao usados no filtro por periodo
  Update_vars_dh_filtro() {

    this.val_dhini_picker = this.periodo_range.get("dhinicio")?.value;
    this.val_dhfim_picker = this.periodo_range.get("dhfim")?.value;
    //console.log("val_dhini_picker=" + val_dhini_picker);
    //console.log("val_dhfim_picker=" + val_dhfim_picker);

    try {
      this.dhinicio_str = this.datepipe.transform(this.val_dhini_picker, 'yyyy/MM/dd');
      this.dhfim_str = this.datepipe.transform(this.val_dhfim_picker, 'yyyy/MM/dd') ;
      //console.log("periodo=" + this.dhinicio_str + " - " + this.dhfim_str);
    }
    catch {
      this.dhinicio_str = "";
      this.dhfim_str = "";
    }

  } // Update_vars_dh_filtro

  // botao Filtrar do filtro por periodo
  BtnFiltroPeriodoClick(event: Event) {

    // atualziar as vars Date e string usadas no filtro por periodo
    this.Update_vars_dh_filtro();

    // se
    if ( ( ! Utils.isDate(this.val_dhini_picker) ) || ( ! Utils.isDate(this.val_dhfim_picker) )  ) {
      alert("A \"Data Inicial\" e a \"Data Final\" devem ser informadas!");
      return;
    }

    // gravar os cookies com as datas do periodo do filtro
    this.cookieService.set( 'movimentacao-cs-dhinicio', this.dhinicio_str ?? "" );
    this.cookieService.set( 'movimentacao-cs-dhfim', this.dhfim_str ?? "" );

    this.fetchData();
  } // BtnFiltroPeriodoClick

  // retorna o nome da classe css que deve ser usada para pintar a linha do table com base no campo tipo_mov
  getCSSClassForRow(row :movimentacaoData) {
    return (row.tipo_mov === 'E' ? "linha-entrada" : (row.tipo_mov === 'S') ? "linha-saida" : "");
  }

} // class
