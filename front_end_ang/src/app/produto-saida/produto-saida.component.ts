import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

import { MOVIMENTACAO } from '../MOVIMENTACAO';
import { MovimentacaoService } from '../services/movimentacao.service';
import Utils from '../utils';
import { ProdutoService } from '../services/produto.service';
import { ClienteService } from '../services/cliente.service';
import { PRODUTO } from '../PRODUTO';
import { CLIENTE_PESQ } from '../CLIENTE_PESQ';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-produto-saida',
  templateUrl: './produto-saida.component.html',
  styleUrl: './produto-saida.component.scss'

})

export class ProdutoSaidaComponent implements OnInit {

  @Input() movimentacao: MOVIMENTACAO;

  // id do registro que estah sendo exibido (eh zero quando abriu a tela para fazer uam nova entrada de material)
  public id :number = 0;

  // lista de produtos para exibir o controle Select
  public produtos: PRODUTO[] = [];
  // contem apenas os produtos conforme filtrado pela digitacao do usuario no "Produto_Input"
  public filtered_produtos: PRODUTO[] = [];

  // lista de produtos para exibir o controle Select
  public clientes: CLIENTE_PESQ[] = [];
  // contem apenas os clientes conforme filtrado pela digitacao do usuario no "Cliente_Input"
  public filtered_clientes: CLIENTE_PESQ[] = [];

  form: FormGroup = new FormGroup({
    Produto_Input: new FormControl(''),
    QuantidadeInput: new FormControl(''),
    Cliente_Input: new FormControl(''),
    NumPedidoInput: new FormControl(''),
    ObsTextArea: new FormControl('')
  });
  submitted = false;


  constructor(
    private route: ActivatedRoute
    ,private location: Location
    ,private toastr: ToastrService
    ,private router: Router
    ,private movservice: MovimentacaoService
    ,private prodservice: ProdutoService
    ,private clienteservice: ClienteService
    ,private formBuilder: FormBuilder
    )
  {

    this.movimentacao = {} as MOVIMENTACAO;

  };

  // retorna true se estah nomodo de visualizacao de um registro
  IsInViewMode() : boolean {
    return this.id > 0;
  }

  getAllProdutos(): void {
     this.prodservice.getAllProdutos_http().subscribe(produtos => this.produtos = produtos);
  }

  getAllClientes(): void {
    this.clienteservice.getAllClientesPesq_http().subscribe(clientes => this.clientes = clientes);
  }

  ngOnInit(): void {

    this.form = this.formBuilder.group(
      {
        Produto_Input: ['', Validators.required]
        ,QuantidadeInput: ['', Validators.required]
        ,Cliente_Input: ['', ]
        ,NumPedidoInput: ['', ]
        ,ObsTextArea: ['', ]
      }
    );

    this.id = Number(this.route.snapshot.paramMap.get('id'));

    this.getMovimentacao();

    this.getAllProdutos();

    this.getAllClientes();

    if ( this.IsInViewMode() ) {
      this.form.get("Produto_Input")?.disable();
      this.form.get("QuantidadeInput")?.disable();
      this.form.get("Cliente_Input")?.disable();
      this.form.get("NumPedidoInput")?.disable();
      this.form.get("ObsTextArea")?.disable();
    }

  }

  getMovimentacao(): void {

    //console.log("id=" + this.id);

    if ( this.id ) {
      this.movservice.getMovimentacao_http(this.id)
        .subscribe(movimentacao => this.movimentacao = movimentacao);
    }
  }

  // executado quando o usuario digita no campo Input do autocomplete do campo "Produto"
  public FilterProdutos(value :string, EventName: any): void {
    //console.log("value="+ value);
    if( EventName == "input") {
      this.filtered_produtos = this.produtos.filter(produto => produto.descricao.toLowerCase().includes(value.toLowerCase()));
      //console.log("this.filtered_produtos abaixo");
      //console.table(this.filtered_produtos);
    }
    else if( EventName == "focus") {
      this.filtered_produtos = this.produtos;
    }
  } // FilterProdutos

  // executado quando o usuario digita no campo Input do autocomplete do campo "Cliente"
  public FilterClientes(value :string, EventName: any): void {
    //console.log("value="+ value);
    if( EventName == "input") {
      this.filtered_clientes = this.clientes.filter(cliente => cliente.nome_completo.toLowerCase().includes(value.toLowerCase()));
      //console.log("this.filtered_clientes abaixo");
      //console.table(this.filtered_clientes);
    }
    else if( EventName == "focus") {
      this.filtered_clientes = this.clientes;
    }
  } // FilterClientes

  // funcao que retorna o rexto a ser exibido em cada opcao do autocomplete do Produto
  // pProduto contem o objeto PRODUTO que eh enviado pelo autocomplete para esta funcao "decidir" e retornar o texto que deve ser exibido na opcao da lista
  Produto_Auto_DisplayFn(pProduto: PRODUTO): string {
    //console.log("Produto_Auto_DisplayFn - pProduto=" + JSON.stringify(pProduto));
    return pProduto && pProduto.descricao ? pProduto.descricao : '';
  }

  // funcao que retorna o rexto a ser exibido em cada opcao do autocomplete do Cliente
  // pCliente contem o objeto CLIENTE_PESQ que eh enviado pelo autocomplete para esta funcao "decidir" e retornar o texto que deve ser exibido na opcao da lista
  Cliente_Auto_DisplayFn(pCliente: CLIENTE_PESQ): string {
    //console.log("Cliente_Auto_DisplayFn - pCliente=" + JSON.stringify(pCliente));
    return pCliente && pCliente.nome_completo ? pCliente.nome_completo : '';
  }

  onSubmit(pFormValues: any): void {

    var local_toastr = this.toastr;

    var local_router = this.router;

    var _this = this;

    //console.log("post param=" + JSON.stringify(pFormValues));

    // funcao executada quando ha sucesso
    function OnSaveSuccess_CallBackFunction() {

      local_toastr.success('Saída de produto registrada!' , '', {
        timeOut: 3000
        ,positionClass: 'toast-top-center'
      });

      //local_router.navigate(['/produto-saida']);
      Utils.reloadCurrentRoute(_this); // recarregar a pagina atual

    } // OnSaveSuccess_CallBackFunction

    // funcao executada quando ha erro
    function OnSaveError_CallBackFunction() {

      local_toastr.error('Erro ao registrar a saída de produto!' , '', {
        timeOut: 3000
        ,positionClass: 'toast-top-center'
      });

    } // OnSaveError_CallBackFunction

    if (this.movimentacao) {

      // obter o obj que contem o produto selecionado pelo usuario usando o autocomplete "Produto_Auto"
      var prod :PRODUTO = this.form.get("Produto_Input")?.value;
      // console.log("prod=" + JSON.stringify(prod));
      // precisa setar o this.movimentacao.id_produto porque nenhum controle faz o binding com este campo
      this.movimentacao.id_produto = prod.id_produto;

      // obter o obj que contem o cliente selecionado pelo usuario usando o autocomplete "Cliente_Auto"
      var cli :CLIENTE_PESQ = this.form.get("Cliente_Input")?.value;
      // console.log("cli=" + JSON.stringify(cli));
      // precisa setar o this.movimentacao.id_cliente porque nenhum controle faz o binding com este campo
      this.movimentacao.id_cliente = cli.id_cliente;

      this.movimentacao.data_hora = Utils.getCurrentDateTime_forMysql();
      this.movimentacao.tipo_mov = "S";

      //console.log("this.movimentacao.data_hora=" + this.movimentacao.data_hora);

      this.movservice.createMovimentacao_http(this.movimentacao)
        .subscribe( {

          next: response => {},

          error: error => {
            OnSaveError_CallBackFunction();
          },

          complete() {
            OnSaveSuccess_CallBackFunction();
          }

        });
    }
  }

  voltar(): void {
    this.location.back();
  }

}
