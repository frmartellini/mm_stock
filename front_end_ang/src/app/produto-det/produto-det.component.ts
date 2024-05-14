import { Component, Input, OnInit, inject } from '@angular/core';
import { ProdutoService } from '../services/produto.service';
import { PRODUTO } from '../PRODUTO';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Location } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-produto-det',
  templateUrl: './produto-det.component.html',
  styleUrl: './produto-det.component.css'
})
export class ProdutoDetComponent implements OnInit {

  @Input() produto: PRODUTO;

  // id do registro que estah sendo exibido (deve ser zero quando abrir a tela para fazer um novo cadastro)
  public id :number = 0;

  // contem o modo que a tel aestah sendo utilizada: V - visualizacao , E = Edicao , I - Inclusao
  public mode :string = "";

  private readonly produtoApiService = inject(ProdutoService)

  public produto_form: any;

  public PageTitle: String = "Incluindo ou editando produto"; 
  public SubmitButtonText: String = "Confirmar";

  constructor(
    private route: ActivatedRoute
    ,private location: Location
    ,private toastr: ToastrService
    ,private router: Router
    ,private formBuilder: FormBuilder
    )
  {

    this.produto = {} as PRODUTO;

  };

  ngOnInit(): void {

    this.produto_form = this.formBuilder.group(
      {
        Cad_Produto_Descricao: ['', Validators.required]
        ,Cad_Produto_Cor: ['', Validators.required]
        ,Cad_Produto_Tamanho: ['', Validators.required]
        ,Cad_Produto_Tipo_Material: ['', Validators.required]
        ,Cad_Produto_Preco_Venda: ['', Validators.required]
        ,Cad_Produto_Quantidade_Atual: ['', Validators.required]
      }
    ); // this.formBuilder.group

    //console.log("this.route.snapshot.params[mode]=" +this.route.snapshot.params["mode"]);

    // obter os params da url e guardar nas vars do obj desta tela
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    //this.mode = String(this.route.snapshot.params["mode"]); // nao funciona
    this.mode = String(this.route.snapshot.queryParamMap.get('mode'));
    //console.log("this.id=" + this.id);
    //console.log("this.mode inicial=" + this.mode);
    
    // se o param id recebido nao for um numero, vai forcar que seja 0 para forcar a tela no modo inclusao
    if ( Number.isNaN(this.id) ) {
      this.id = 0;
    }

    // se o id recebido eh 0, entao vai usar a tela no modo inclusao
    if (this.id == 0) {
      this.mode = "I";
    }
    // se o id for maior que 0
    else if (this.id > 0) {
      //this.mode = String(this.route.snapshot.params["mode"]);
      if ( (this.mode != "E") && (this.mode != "V") ) {
        this.mode = "V";
      }
    }

    //console.log("this.id final=" + this.id);
    //console.log("this.mode final=" + this.mode);

    // carregar os dados do produto se foi recebido um id na url
    this.getProduto();

    // desativar os campos se estiver no modo de visualizacao
    if ( this.IsInViewMode() ) {
      this.produto_form.get("Cad_Produto_Descricao")?.disable();
      this.produto_form.get("Cad_Produto_Cor")?.disable();
      this.produto_form.get("Cad_Produto_Tamanho")?.disable();
      this.produto_form.get("Cad_Produto_Tipo_Material")?.disable();
      this.produto_form.get("Cad_Produto_Preco_Venda")?.disable();
      this.produto_form.get("Cad_Produto_Quantidade_Atual")?.disable();
    }
    else {

      if ( this.GetMode() == "I") {
        this.SubmitButtonText = "Confirmar Inclusão";
        this.PageTitle = "Incluindo produto";
      }
      else if ( this.GetMode() == "E") {
        this.SubmitButtonText = "Confirmar Edição";
        this.PageTitle = "Editando produto";
        // &todo& talvez poderia desativar o campo da qtde por seguranca, mas inicialmente vai ficar liberado alterar a qtde
        // this.produto_form.get("Cad_Produto_Quantidade_Atual")?.disable();
      }

    }

  } // ngOnInit

  // retorna true se estah no modo de visualizacao de um registro
  public IsInViewMode() : boolean {
    return this.mode == "V";
  }

  // retorna o modo de uso da tela ( V / E / I )
  public GetMode() : string {
    return this.mode;
  }

  // obter o dados do produto conforme o id recebido na url
  getProduto(): void {
    
    //console.log("id=" + this.id);

    if ( this.id ) {
      this.produtoApiService.getProduto_http(this.id)
        .subscribe(produto => this.produto = produto);
      // &todo& precisa tratar aqui o caso do usuario digitar uma url com um id de produto que nao existe
      // a ideia eh exibir uma msg avisando usando o toastr e redirecionar para a tela do cadastro
    }
  }

  // executado quando o botao type submit eh clicado
  onSubmit(pFormValues: any): void {

    var local_toastr = this.toastr;

    var local_router = this.router;

    //console.log("post param=" + JSON.stringify(pFormValues));

    // montar a msg que serah exibida se a confirmacao for feita com sucesso
    var MsgSucesso : string = "";
    MsgSucesso = this.GetMode() == "I" ? "Produto incluído com sucesso!" : (this.GetMode() == "E" ? "Produto alterado com sucesso!" : "");

    // funcao executada quando ha sucesso
    function OnSaveSuccess_CallBackFunction() {

      local_toastr.success(MsgSucesso , '', {
         timeOut: 3000
         ,enableHtml: true
         ,positionClass: 'toast-top-center'
      });
      
      local_router.navigate(['/produto-list']);
  
    } // OnSaveSuccess_CallBackFunction

    // funcao executada quando ha erro
    function OnSaveError_CallBackFunction(pError : any) {

      local_toastr.error("Erro! <br />" + pError.message + "<br />" + pError.error, '', {
         disableTimeOut: true
         ,enableHtml: true
         ,positionClass: 'toast-top-center'
      });
      
    } // OnSaveError_CallBackFunction

    //console.log("this.produto=" + JSON.stringify(this.produto));
    //console.log("this.IsInViewMode=" + this.IsInViewMode());
    //console.log("this.mode=" + this.mode);

    if ( ! this.IsInViewMode() ) {

      if (this.produto != null) {

        if ( this.mode == "I") {

          //console.log("this.movimentacao.data_hora=" + this.movimentacao.data_hora);

          //console.log("vai executar o this.produtoApiService.postProduto");

          this.produtoApiService.criarNovoProduto(this.produto)
            .subscribe({
              //next: (response) => console.log(response),
              next: response => {},

              error: error => {
                OnSaveError_CallBackFunction(error);
              },

              complete() {
                OnSaveSuccess_CallBackFunction();
              }
              
            }); // subscribe
          
        } // if
        else if (this.mode == "E") {

          //console.log("vai executar o this.produtoApiService.editarProduto");

          this.produtoApiService.editarProduto(this.produto, this.id)
            .subscribe( {
              
              next: response => {},

              error: error => {
                console.log("error=" + JSON.stringify(error));
                OnSaveError_CallBackFunction(error);
              },

              complete() {
                OnSaveSuccess_CallBackFunction();
              }
    
            }); // subscribe

        } // else if
      } // if

    } // if

  } // onSubmit

  voltar(): void {
    this.location.back();
  } // voltar()

} // class
