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
  styleUrl: './produto-saida.component.css'
  
})

export class ProdutoSaidaComponent implements OnInit {

  @Input() movimentacao: MOVIMENTACAO;

  // id do registro que estah sendo exibido (eh zero quando abriu a tela para fazer uam nova entrada de material)
  public id :number = 0;

  // lista de produtos para exibir o controle Select
  public produtos: PRODUTO[] = [];

  // lista de produtos para exibir o controle Select
  public clientes: CLIENTE_PESQ[] = [];

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
        ProdutoSelect: ['', Validators.required]
        ,QuantidadeInput: ['', Validators.required]
        ,ClienteSelect: ['', ]
        ,NumPedidoInput: ['', ]
        ,ObsTextArea: ['', ]
      }
    );

    this.id = Number(this.route.snapshot.paramMap.get('id'));

    this.getMovimentacao();

    this.getAllProdutos();

    this.getAllClientes();

    if ( this.IsInViewMode() ) {
      this.form.get("ProdutoSelect")?.disable();
      this.form.get("QuantidadeInput")?.disable();
      this.form.get("ClienteSelect")?.disable();
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

  onSubmit(pFormValues: any): void {

    var local_toastr = this.toastr;

    var local_router = this.router;

    //console.log("post param=" + JSON.stringify(pFormValues));

    // funcao executada quando ha sucesso
    function OnSaveSuccess_CallBackFunction() {

      local_toastr.success('Saída de produto registrada!' , '', {
        timeOut: 3000
        ,positionClass: 'toast-top-center'
      });
  
      local_router.navigate(['/produto-saida']);

    } // OnSaveSuccess_CallBackFunction

    // funcao executada quando ha erro
    function OnSaveError_CallBackFunction() {

      local_toastr.error('Erro ao registrar a saída de produto!' , '', {
        timeOut: 3000
        ,positionClass: 'toast-top-center'
      });
  
    } // OnSaveError_CallBackFunction

    if (this.movimentacao) {

      this.movimentacao.data_hora = Utils.getCurrentDateTime_forMysql();
      this.movimentacao.tipo_mov = "S";

      console.log("this.movimentacao.data_hora=" + this.movimentacao.data_hora);

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
