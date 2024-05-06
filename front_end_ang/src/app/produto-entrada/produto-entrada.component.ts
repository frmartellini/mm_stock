import { Component, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

import { MOVIMENTACAO } from '../MOVIMENTACAO';
import { MovimentacaoService } from '../services/movimentacao.service';
import Utils from '../utils';
import { ProdutoService } from '../services/produto.service';
import { PRODUTO } from '../PRODUTO';

@Component({
  selector: 'app-produto-entrada',
  templateUrl: './produto-entrada.component.html',
  styleUrl: './produto-entrada.component.css'
  
})

export class ProdutoEntradaComponent {

  @Input() movimentacao: MOVIMENTACAO;

  // id do registro que estah sendo exibido (eh zero quando abriu a tela para fazer uam nova entrada de material)
  public id :number = 0;

  // lista de produtos para exibir o controle Select
  public produtos: PRODUTO[] = [];

  constructor(
    private route: ActivatedRoute
    ,private location: Location
    ,private toastr: ToastrService
    ,private router: Router
    ,private movservice: MovimentacaoService
    ,private prodservice: ProdutoService
    
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

  ngOnInit(): void {
    
    this.id = Number(this.route.snapshot.paramMap.get('id'));

    this.getMovimentacao();

    this.getAllProdutos();

  }

  getMovimentacao(): void {
    
    //console.log("id=" + this.id);

    if ( this.id ) {
      this.movservice.getMovimentacao_http(this.id)
        .subscribe(movimentacao => this.movimentacao = movimentacao);
    }
  }

  confirmar(): void {

    var local_toastr = this.toastr;

    var local_router = this.router;

    // funcao executada quando ha sucesso
    function OnSaveSuccess_CallBackFunction() {

      local_toastr.success('Entrada de produto registrada!' , '', {
        timeOut: 3000
        ,positionClass: 'toast-top-center'
      });
  
      local_router.navigate(['']);

    } // OnSaveSuccess_CallBackFunction

    // funcao executada quando ha erro
    function OnSaveError_CallBackFunction() {

      local_toastr.error('Erro ao registrar a entrada de produto!' , '', {
        timeOut: 3000
        ,positionClass: 'toast-top-center'
      });
  
    } // OnSaveError_CallBackFunction

    if (this.movimentacao) {

      this.movimentacao.data_hora = Utils.getCurrentDateTime_forMysql();
      this.movimentacao.tipo_mov = "E";

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
