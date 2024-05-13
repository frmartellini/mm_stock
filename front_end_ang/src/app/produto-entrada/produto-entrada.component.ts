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

  // retorna true se estah nomodo de visualizacao de um registro
  IsInViewMode() : boolean {
    return this.id > 0;
  }

  getAllProdutos(): void {
     this.prodservice.getAllProdutos_http().subscribe(produtos => this.produtos = produtos);
   }

  ngOnInit(): void {
    
    this.form = this.formBuilder.group(
      {
        ProdutoSelect: ['', Validators.required]
        ,QuantidadeInput: ['', Validators.required]
        ,ObsTextArea: ['', ]
      }
    );

    this.id = Number(this.route.snapshot.paramMap.get('id'));

    this.getMovimentacao();

    this.getAllProdutos();

    if ( this.IsInViewMode() ) {
      this.form.get("ProdutoSelect")?.disable();
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

  onSubmit(pFormValues: any): void {

    var local_toastr = this.toastr;

    var local_router = this.router;

    //console.log("post param=" + JSON.stringify(pFormValues));

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
