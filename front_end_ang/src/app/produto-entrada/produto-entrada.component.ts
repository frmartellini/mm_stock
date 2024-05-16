import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

import { MOVIMENTACAO } from '../MOVIMENTACAO';
import { MovimentacaoService } from '../services/movimentacao.service';
import Utils from '../utils';
import { ProdutoService } from '../services/produto.service';
import { PRODUTO } from '../PRODUTO';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-produto-entrada',
  templateUrl: './produto-entrada.component.html',
  styleUrl: './produto-entrada.component.css'
  
})

export class ProdutoEntradaComponent implements OnInit {

  @Input() movimentacao: MOVIMENTACAO;

  // id do registro que esta sendo exibido (eh zero quando abriu a tela para fazer uam nova entrada de material)
  public id :number = 0;

  // lista de produtos para exibir o controle Select
  public produtos: PRODUTO[] = [];
  // contem apenas os produtos conforme filtrado pela digitacao do usuario no "Produto_Input"
  public filtered_produtos: PRODUTO[] = [];

  //formfieldControl = new FormControl( '', [Validators.required] );

  form: FormGroup = new FormGroup({
    ProdutoSelect: new FormControl(''),
    QuantidadeInput: new FormControl(''),
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
    ,private formBuilder: FormBuilder
    )
  {

    this.movimentacao = {} as MOVIMENTACAO;

  };

  // retorna true se estah no modo de visualizacao de um registro
  IsInViewMode() : boolean {
    return this.id > 0;
  }

  getAllProdutos(): void {
     this.prodservice.getAllProdutos_http().subscribe(produtos => this.produtos = produtos);
   }

  ngOnInit(): void {
    //console.log("produto-entrada - ngOnInit");
    this.form = this.formBuilder.group(
      {
        //ProdutoSelect: ['', Validators.required]
        Produto_Input: ['', Validators.required]
        ,QuantidadeInput: ['', Validators.required]
        ,ObsTextArea: ['', ]
      }
    );

    this.id = Number(this.route.snapshot.paramMap.get('id'));

    this.getMovimentacao();

    this.getAllProdutos();

    if ( this.IsInViewMode() ) {
      //this.form.get("ProdutoSelect")?.disable();
      this.form.get("Produto_Input")?.disable();
      this.form.get("QuantidadeInput")?.disable();
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
      //console.log("this.filtered_cores abaixo");
      //console.table(this.filtered_cores);
    }
    else if( EventName == "focus") {
      this.filtered_produtos = this.produtos;
    }
  } // FilterCores

  // funcao que retorna o rexto a ser exibido em cada opcao do autocomplete do Produto
  // pProduto contem o objeto PRODUTO que eh enviado pelo autocomplete para esta funcao "decidir" e retornar o texto que deve ser exibido na opcao da lista
  Produto_Auto_DisplayFn(pProduto: PRODUTO): string {
    //console.log("Produto_Auto_DisplayFn - pProduto=" + JSON.stringify(pProduto));
    return pProduto && pProduto.descricao ? pProduto.descricao : '';
  }

  onSubmit(pFormValues: any): void {

    var local_toastr = this.toastr;

    var local_router = this.router;

    // funcao executada quando ha sucesso
    function OnSaveSuccess_CallBackFunction() {

      local_toastr.success('Entrada de produto registrada!' , '', {
        timeOut: 3000
        ,positionClass: 'toast-top-center'
      });

      local_router.navigate(['/produto-entrada']);  
      //local_router.navigate(['/produto-list']);
      //location.reload();

    } // OnSaveSuccess_CallBackFunction

    // funcao executada quando ha erro
    function OnSaveError_CallBackFunction() {

      local_toastr.error('Erro ao registrar a entrada de produto!' , '', {
        timeOut: 3000
        ,positionClass: 'toast-top-center'
      });
  
    } // OnSaveError_CallBackFunction

    if (this.movimentacao) {

      //console.log("pFormValues=" + JSON.stringify(pFormValues));

      // obter o obj que contem o produto selecionado pelo usuario usando o autocomplete "Produto_Auto"
      var prod :PRODUTO = this.form.get("Produto_Input")?.value;
      //console.log("prod=" + JSON.stringify(prod));
      // precisa setar o this.movimentacao.id_produto porque nenhum controle faz o binding com este campo
      this.movimentacao.id_produto = prod.id_produto;

      this.movimentacao.data_hora = Utils.getCurrentDateTime_forMysql();
      this.movimentacao.tipo_mov = "E";

      //console.log("this.movimentacao.data_hora=" + this.movimentacao.data_hora);
      //console.log("this.movimentacao=" + JSON.stringify(this.movimentacao));

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
  } // onSubmit

  voltar(): void {
    this.location.back();
  }

} // class
