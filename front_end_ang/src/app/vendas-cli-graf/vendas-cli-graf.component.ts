import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import moment from 'moment';
import { VendasCliGrafDATA } from '../VendasCliGraf_DATA';
import { ENV } from '../env';
import { FormControl, FormGroup } from '@angular/forms';
import { DatePipe } from '@angular/common'
import { CookieService } from 'ngx-cookie-service';
import Utils from '../utils';
import { MatTableDataSource } from '@angular/material/table';
import * as iconv from 'iconv-lite';

@Component({
  selector: 'app-vendas-cli-graf',
  templateUrl: './vendas-cli-graf.component.html',
  styleUrl: './vendas-cli-graf.component.scss'
})

export class VendasCliGrafComponent implements OnInit {

  data: any; // dados para o chart

  options: any; // opcoes e configuracoes do chart

  // contem os objetos VendasCliGrafDATA retornados do BD
  graf_data: VendasCliGrafDATA[] = [];

  // Array para a tabela
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
      labels: [],
      datasets: [
        {
          order: 2,
          label: 'Vendas (R$)',
          yAxisID: 'y',
          type: 'bar',
          backgroundColor: '#208104', // verde
          borderColor: '#0',
          data: [] // array que eh preenchido em run-time
        }
        ,
        {
          order: 1,
          label: '%',
          yAxisID: 'y1',
          type: 'line',
          tension: 0.4,
          backgroundColor: '#fd7e14', // laranja
          borderColor: '#fd7e14',
          data: [] // array que eh preenchido em run-time
        }
      ]
    }; // this.data

    this.options = {
      maintainAspectRatio: false,
      aspectRatio: 0.8,
      plugins: {
        legend: {
          display: true,
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
              label: function(tooltipItem : any) {
                let value = "";
                if ( tooltipItem.datasetIndex == 0 ) {
                  // formatar o numero como moeda R$ quando for exibir o tooltip dos pontos do grafico
                  value = Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(tooltipItem.raw);
                }
                else if ( tooltipItem.datasetIndex == 1 ) {
                  // formatar o numero normalmente e adicionando o % no final
                  value = Intl.NumberFormat('pt-BR', { maximumFractionDigits: 2 }).format(tooltipItem.raw) + " %";
                }
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
          display: true
          ,position: 'left'
          ,ticks: {
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
        ,y1: {
          //display: true
          position: 'right'
          ,min: 0
          ,max: 100
          ,ticks: {
            color: textColorSecondary
            ,font: {
              size: 18
            }
            ,
            // Include a dollar sign in the ticks
            callback: function(value : number, index :number, ticks : any) {
              return  value + "%";
            }
          }, // ticks
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

    this.http.get<VendasCliGrafDATA>(ENV.REST_API_URL+'/vendas_cli_graf_por_periodo?dhinicio='+ this.dhinicio_str +'&dhfim='+ this.dhfim_str + ' 23:59:59/').subscribe(
        (response: any) =>
          {
            this.graf_data = response;

            /*
            // dados para testes
            this.graf_data = [
              { cliente: "zeh", valor_total: 30, perc: 10 }
              ,{ cliente: "jose", valor_total: 60, perc: 20 }
              ,{ cliente: "carlos", valor_total: 50, perc: 30 }
              ,{ cliente: "ana", valor_total: 50, perc: 10 }
              ,{ cliente: "paula", valor_total: 7, perc: 30 }
              ,{ cliente: "maria", valor_total: 50, perc: 50 }
              ,{ cliente: "joao", valor_total: 80, perc: 30 }
            ];
            */

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

    // limpar o array dos labels do eixo X
    this.data.labels = [] ;
    // limpar os arrays que contem os valores das duas series de dados
    this.data.datasets[0].data = []; // valor_total
    this.data.datasets[1].data = []; // perc
    

    if ( this.graf_data ) {
      //console.log("this.graf_data.length=" + this.graf_data.length);
      //console.log("this.graf_data=" + JSON.stringify( this.graf_data));

      // passar pelos registros obtidos do BD
      for (let i = 0; i < this.graf_data.length; i++) {

        this.data.labels[i] = this.graf_data[i].cliente;
        this.data.datasets[0].data[i] = this.graf_data[i].valor_total;
        this.data.datasets[1].data[i] = this.graf_data[i].perc;

      } // for

      // montar "tableData" que serah o datasource para a tabela
      const tabelaData = this.data.labels.map((cliente: string, index: number) => ({
        cliente: cliente
        ,valor_total: this.data.datasets[0].data[index]
        ,perc: this.data.datasets[1].data[index]
      }));
      
      //console.log("tabelaData=" + JSON.stringify(tabelaData) );

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
    let csvContent = "Cliente\tValor Total (R$)\t%\r\n"; // Cabeçalho com TAB e CRLF
    for (let i = 0; i < this.data.labels.length; i++) {
      const cliente = this.data.labels[i]; // Mês
      const valor_total = this.data.datasets[0].data[i] || 0; // Valor total
      const perc = this.data.datasets[1].data[i] || 0; // percentual
      const perc_str = Number(perc).toFixed(2);
      csvContent += `${cliente}\t${valor_total}\t${perc_str}\r\n`; // CRLF no final de cada linha
    }

    // Criar o nome do arquivo no formato vendas-por-cliente-aaaa-mm-dd-hh-nn-ss.txt
    const now = new Date();
    const timestamp = now.toISOString().replace(/[-T:]/g, "").split(".")[0]; // yyyyMMddHHmmss
    const fileName = `vendas-por-cliente-${timestamp}.txt`;

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

