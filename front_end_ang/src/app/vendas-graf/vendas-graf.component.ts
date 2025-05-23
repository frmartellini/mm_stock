import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import moment from 'moment';
import { VendasGrafDATA } from '../VendasGraf_DATA';
import { ENV } from '../env';
import { FormControl, FormGroup } from '@angular/forms';
import { DatePipe } from '@angular/common'
import { CookieService } from 'ngx-cookie-service';
import Utils from '../utils';
import { MatTableDataSource } from '@angular/material/table';
import * as iconv from 'iconv-lite';

@Component({
  selector: 'app-vendas-graf',
  templateUrl: './vendas-graf.component.html',
  styleUrl: './vendas-graf.component.scss'
})

export class VendasGrafComponent implements OnInit {

  data: any; // dados para o chart

  options: any; // opcoes e configuracoes do chart

  // contem os objetos VendasGrafRecord retornados do BD
  graf_data: VendasGrafDATA[] = [];

  // vai conter uma string com o mes em cada posicao e o formato eh YYYY/MM
  // eh usado na montagem do grafico para achar a posicao do ponto do grafico mais facilmente a partir do mes retornado do BD
  graf_labels_internal_array : string[] = [];

  // Array para a tabela
  displayedColumns: string[] = ['mes', 'valor'];
  tabelaVendas = new MatTableDataSource<any>([]);  // Inicializa com um array vazio

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  // guarda as datas do filtro por periodo no formato yyyy/MM/dd
  dhinicio_str: string | null = "";
  dhfim_str: string | null = "";
  // guarda as datas do filtro por periodo em obj tipo Date
  val_dhini_picker : any; // Date
  val_dhfim_picker : any;  // Date

  @ViewChild('chart') chart: any;

  periodo_range = new FormGroup({
    dhinicio: new FormControl<Date | null>(null),
    dhfim: new FormControl<Date | null>(null),
  });

  constructor(private http: HttpClient
              ,public datepipe: DatePipe
              ,private cookieService: CookieService
              )
  {

  }

  ngOnInit() {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

    // obter as datas dos cookies
    this.dhinicio_str = this.cookieService.get('vendas-graf-dhinicio');
    this.dhfim_str = this.cookieService.get('vendas-graf-dhfim');

    // setar as datas do "periodo_filtro_daterangepicker" com as datas obtidas dos cookies
    try {
      this.periodo_range.get("dhinicio")?.setValue(new Date(this.dhinicio_str));
      this.periodo_range.get("dhfim")?.setValue(new Date(this.dhfim_str));
    }
    catch {}

    this.Update_vars_dh_filtro();

    this.data = {
      //labels: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Movembro', 'Dezembro'],
      labels: [],
      datasets: [
        {
          label: 'Vendas (R$)',
          backgroundColor: '#208104', // verde
          borderColor: '#0',
          data: [] // array que eh preenchido em run-time
        }
      ]
    }; // this.data

    this.options = {
      maintainAspectRatio: false,
      aspectRatio: 0.8,
      plugins: {
        legend: {
          display: false,
          labels: {
            color: textColor
            ,font: {
              size: 18
            }
          }
        }
        ,title: {
          display: false,
          text: 'Gráfico'
        }
        ,tooltip: {
          callbacks: {
              // formatar o numero como moeda R$ quando for exibir o tooltip dos pontos do grafico
              //label: (tooltipItem : any) => Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(parseFloat(tooltipItem.raw))
              label: function(tooltipItem : any) {
                // formatar o numero como moeda R$ quando for exibir o tooltip dos pontos do grafico
                let value = Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(tooltipItem.raw);
                return value;
              }
          }
        }
      },
      elements: {
        point: {
          radius: 8
          ,hoverRadius: 10

        }
      },
      scales: {
        x: {
          ticks: {
            color: textColorSecondary,
            font: {
              weight: 500
              ,size: 18
            }
          },
          grid: {
              color: surfaceBorder,
              drawBorder: false
          }
        },
        y: {
          ticks: {
            color: textColorSecondary
            ,font: {
              size: 18
            }
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false
          }
        }

      }
    }; // this.options

    this.fetchData();

  } // ngOnInit

  fetchData(): void {

    this.http.get<VendasGrafDATA>(ENV.REST_API_URL+'/vendas_graf_por_periodo?dhinicio='+ this.dhinicio_str +'&dhfim='+ this.dhfim_str + ' 23:59:59/').subscribe(
        (response: any) =>
          {
            this.graf_data = response;
            this.MontarGrafico();
          }
    );
  }

  MontarGrafico() : void {

    //this.dhinicio_str = "2024/05/01";
    //this.dhfim_str = "2024/12/31";

    //var dini : Date = new Date(this.dhinicio_str );
    //var dfim : Date = new Date(this.dhfim_str);

    //console.log("this.dhinicio_str="+this.dhinicio_str);
    //console.log("this.dhfim_str="+this.dhfim_str);

    var dini  = moment.utc(this.dhinicio_str,"YYYY/MM/DD");
    var dfim = moment.utc(this.dhfim_str,"YYYY/MM/DD");

    //var dfim : Date = new Date("2024-11-10T00:00:00.000Z");
    //var dfim : Date = new Date("2024-11-10");

    //console.log("dini=" + dini.toISOString());
    //console.log("dfim=" + dfim.toISOString());

    //dfim.setMonth(dfim.getMonth()+2);
    //console.log("dfim=" + dfim.toISOString());

    //var qtde_months = (dini.getFullYear()*12 + dfim.getMonth()) - (dini.getFullYear()*12 + dini.getMonth());
    var qtde_months = Math.round(dfim.diff(dini, 'months', true));
    //console.log("qtde_months=" + qtde_months);

    // limpar o array dos labels do eixo X
    this.data.labels = [] ;
    // limpar os arrays que contem os valores das duas series de dados
    this.data.datasets[0].data = []; // entradas
    //this.data.datasets[1].data = []; // saidas

    // inicia com a data inicial e dentro do for vai avancando o mes
    var curr_date = dini;

    // setar os labels dos pontos do eixo X
    for ( let i = 0; i < qtde_months; i++) {

      //console.log("curr_date=" + curr_date.toISOString());

      this.data.labels[i] = curr_date.format('MM/YYYY');
      this.graf_labels_internal_array[i] = curr_date.format('YYYY/MM');

      //curr_date.setMonth(curr_date.getMonth()+1);
      // aumentar um mes na var curr_date
      curr_date.add(1,'month');

    } // for

    let char_x_idx = -1;

    if ( this.graf_data ) {
      //console.log("this.graf_data.length=" + this.graf_data.length);
      //console.log("this.graf_data=" + JSON.stringify( this.graf_data));

      // passar pelos registros obtidos do BD
      for (let i = 0; i < this.graf_data.length; i++) {

        // obter o indice do mes do registro no grafico
        char_x_idx = this.graf_labels_internal_array.indexOf(this.graf_data[i].mes);

        this.data.datasets[0].data[char_x_idx] = this.graf_data[i].valor_total;

      } // for

      //console.log("this.graf_data=" + JSON.stringify(this.graf_data) );
      
      //console.log("this.data.datasets[0].data=" + JSON.stringify( this.data.datasets[0].data) );

      // passar pelo this.data.datasets[0].data e colocar zero onde tiver null, considerando a qtde de meses do grafico
      // (fica null nos meses que nao teve venda)
      for (let i = 0; i < qtde_months; i++) {
        if ( this.data.datasets[0].data[i] == null) {
          this.data.datasets[0].data[i] = 0;
        }
      } // for

      //console.log("this.data.datasets[0].data=" + JSON.stringify( this.data.datasets[0].data) );

      // montar "tableData" que serah o datasource para a tabela
      const tabelaData = this.data.labels.map((mes: string, index: number) => ({
        mes: mes,
        valor: this.data.datasets[0].data[index]
      }));

      // Atribuir os dados à tabela
      this.tabelaVendas.data = tabelaData;

      // atualizar o grafico
      this.chart.refresh();

    } // if
  } // MontarGrafico

  exportToCSV() {
    if (!this.data || !this.data.labels || !this.data.datasets[0].data) {
      alert("Nenhum dado disponível para exportação.");
      return;
    }

    // Construir o conteúdo do arquivo
    let csvContent = "Mês\tVendas (R$)\r\n"; // Cabeçalho com TAB e CRLF
    for (let i = 0; i < this.data.labels.length; i++) {
      const mes = this.data.labels[i]; // Mês
      const vendas = this.data.datasets[0].data[i] || 0; // Valor da venda
      csvContent += `${mes}\t${vendas}\r\n`; // CRLF no final de cada linha
    }

    // Criar o nome do arquivo no formato graf-mov-aaaa-mm-dd-hh-nn-ss.txt
    const now = new Date();
    const timestamp = now.toISOString().replace(/[-T:]/g, "").split(".")[0]; // yyyyMMddHHmmss
    const fileName = `vendas-${timestamp}.txt`;

    const win1252Content = iconv.encode(csvContent, 'win1252');

    // Criando um Blob com encoding Windows-1252
    const blob = new Blob([win1252Content], { type: 'text/plain;charset=windows-1252' });

    // Criar link para download
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
  BtnAtualizarPeriodoClick(event: Event) {

    // atualziar as vars Date e string usadas no filtro por periodo
    this.Update_vars_dh_filtro();

    //console.log("this.val_dhini_picker=" + this.val_dhini_picker);
    //console.log("this.val_dhfim_picker=" + this.val_dhfim_picker);

    // se alguma data estah vazia
    if ( ( ! Utils.isDate(this.val_dhini_picker) ) || ( ! Utils.isDate(this.val_dhfim_picker) )  ) {
      alert("A \"Data Inicial\" e a \"Data Final\" devem ser informadas!");
      return;
    }

    // a data inicial deve ser o primeiro dia do mes
    const startOfIniMonthStr = moment(this.val_dhini_picker).startOf('month').format('YYYY-MM-DD');
    //console.log("startOfMonth=" + startOfIniMonthStr);
    if ( moment(this.val_dhini_picker).format('YYYY-MM-DD') != startOfIniMonthStr) {
      alert("A Data Inicial deve ser o primeiro dia do mês.");
      return;
    }

    // a data final deve ser o ultimo dia do mes
    const endOfEndMonthStr = moment(this.val_dhfim_picker).endOf('month').format('YYYY-MM-DD');
    //console.log("endOfEndMonthStr=" + endOfEndMonthStr);
    if ( moment(this.val_dhfim_picker).format('YYYY-MM-DD') != endOfEndMonthStr) {
      alert("A Data Final deve ser o último dia do mês.");
      return;
    }

    if ( this.val_dhini_picker > this.val_dhfim_picker) {
      alert("A Data Inicial deve ser menor que a Data Final.");
      return;
    }

    // gravar os cookies com as datas do periodo do filtro
    this.cookieService.set( 'vendas-graf-dhinicio', this.dhinicio_str ?? "" );
    this.cookieService.set( 'vendas-graf-dhfim', this.dhfim_str ?? "" );

    this.fetchData();
  } // BtnAtualizarPeriodoClick

} // class VendasGrafComponent

