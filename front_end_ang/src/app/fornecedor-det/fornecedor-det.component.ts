import { Component, Input, OnInit, inject } from '@angular/core';
import { FornecedorService } from '../services/fornecedor.service';
import { FORNECEDOR } from '../FORNECEDOR';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Location } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-fornecedor-det',
  templateUrl: './fornecedor-det.component.html',
  styleUrl: './fornecedor-det.component.css'
})
export class FornecedorDetComponent implements OnInit{

  @Input() fornecedor: FORNECEDOR;

  // id do registro que estah sendo exibido (deve ser zero quando abrir a tela para fazer um novo cadastro)
  public id :number = 0;

  // contem o modo que a tel aestah sendo utilizada: V - visualizacao , E = Edicao , I - Inclusao
  public mode :string = "";

  private readonly fornecedoresApiService = inject(FornecedorService)

  public fornecedor_form: any;

  public PageTitle: String = "Incluindo ou editando fornecedor";
  public SubmitButtonText: String = "Confirmar";

  constructor(
    private route: ActivatedRoute
    ,private location: Location
    ,private toastr: ToastrService
    ,private router: Router
    ,private formBuilder: FormBuilder
    )
  {

    this.fornecedor = {} as FORNECEDOR;

  };

  ngOnInit(): void {
    //console.log(this.fornecedor);
    this.fornecedor_form = this.formBuilder.group(
      {
        Cad_fornecedor_Nome: ['', Validators.required]
        ,Cad_fornecedor_Responsavel: ['', Validators.required]
        ,Cad_fornecedor_Contato_Telefonico: ['', ]
        ,Cad_fornecedor_Redes_Sociais: ['', ]
        ,Cad_fornecedor_Materiais_Fornecidos: ['',Validators.required ]
        ,Cad_fornecedor_CNPJ: ['',Validators.required ]
        ,Cad_fornecedor_Endereco: ['', ]
        ,Cad_fornecedor_Numero: ['', ]
        ,Cad_fornecedor_Complemento: ['', ]
        ,Cad_fornecedor_Cidade: ['', ]
        ,Cad_fornecedor_Estado: ['', ]
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

    // carregar os dados do fornecedor se foi recebido um id na url
    this.getFornecedor();

    // desativar os campos se estiver no modo de visualizacao
    if ( this.IsInViewMode() ) {
      this.fornecedor_form.get("Cad_fornecedor_Nome")?.disable();
      this.fornecedor_form.get("Cad_fornecedor_Responsavel")?.disable();
      this.fornecedor_form.get("Cad_fornecedor_Contato_Telefonico")?.disable();
      this.fornecedor_form.get("Cad_fornecedor_Redes_Sociais")?.disable();
      this.fornecedor_form.get("Cad_fornecedor_Materiais_Fornecidos")?.disable();
      this.fornecedor_form.get("Cad_fornecedor_CNPJ")?.disable();
      this.fornecedor_form.get("Cad_fornecedor_Endereco")?.disable();
      this.fornecedor_form.get("Cad_fornecedor_Numero")?.disable();
      this.fornecedor_form.get("Cad_fornecedor_Complemento")?.disable();
      this.fornecedor_form.get("Cad_fornecedor_Cidade")?.disable();
      this.fornecedor_form.get("Cad_fornecedor_Estado")?.disable();
    
      this.PageTitle = "Visualizando fornecedor";
}
    else {

      if ( this.GetMode() == "I") {
        this.SubmitButtonText = "Confirmar Inclusão";
        this.PageTitle = "Incluindo fornecedor";


      }
      else if ( this.GetMode() == "E") {
        this.SubmitButtonText = "Confirmar Edição";
        this.PageTitle = "Editando Fornecedor";
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

  // obter o dados do fornecedor conforme o id recebido na url
  getFornecedor(): void {

    //console.log("id=" + this.id);

    if ( this.id ) {
      this.fornecedoresApiService.getFornecedor_http(this.id)
        .subscribe(fornecedor => this.fornecedor = fornecedor);
        //console.log(this.fornecedor);
       // &todo& precisa tratar aqui o caso do usuario digitar uma url com um id de fornecedor que nao existe
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
    MsgSucesso = this.GetMode() == "I" ? "Fornecedor incluído com sucesso!" : (this.GetMode() == "E" ? "Fornecedor alterado com sucesso!" : "");

    // funcao executada quando ha sucesso
    function OnSaveSuccess_CallBackFunction() {

      local_toastr.success(MsgSucesso , '', {
         timeOut: 3000
         ,enableHtml: true
         ,positionClass: 'toast-top-center'
      });

      local_router.navigate(['/Fornecedor-list']);

    } // OnSaveSuccess_CallBackFunction

    // funcao executada quando ha erro
    function OnSaveError_CallBackFunction(pError : any) {

      local_toastr.error("Erro! <br />" + pError.message + "<br />" + pError.error, '', {
         disableTimeOut: true
         ,enableHtml: true
         ,positionClass: 'toast-top-center'
      });

    } // OnSaveError_CallBackFunction

    //console.log("this.fornecedor=" + JSON.stringify(this.fornecedor));
    //console.log("this.IsInViewMode=" + this.IsInViewMode());
    //console.log("this.mode=" + this.mode);

    if ( ! this.IsInViewMode() ) {

      if (this.fornecedor != null) {

        if ( this.mode == "I") {

          //console.log("this.movimentacao.data_hora=" + this.movimentacao.data_hora);

          //console.log("vai executar o this.clientsApiService.postfornecedor");

          this.fornecedoresApiService.criarNovoFornecedor(this.fornecedor)
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

          //console.log("vai executar o this.clientsApiService.editarfornecedor");

          this.fornecedoresApiService.editarFornecedor(this.fornecedor, this.id)
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

}





