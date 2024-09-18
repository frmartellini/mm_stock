import { Component, Input, OnInit, inject } from '@angular/core';
import { ClienteService } from '../services/cliente.service';
import { clienteData } from '../CLIENTEDATA';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Location } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-cliente-det',
  templateUrl: './cliente-det.component.html',
  styleUrl: './cliente-det.component.scss'
})
export class ClienteDetComponent implements OnInit {

  @Input() cliente: clienteData;

  // id do registro que estah sendo exibido (deve ser zero quando abrir a tela para fazer um novo cadastro)
  public id :number = 0;

  // contem o modo que a tel aestah sendo utilizada: V - visualizacao , E = Edicao , I - Inclusao
  public mode :string = "";

  private readonly clientsApiService = inject(ClienteService)

  public cliente_form: any;

  public PageTitle: String = "Incluindo ou editando cliente";
  public SubmitButtonText: String = "Confirmar";

  // vars que contem o texto a ser exibido no tooltip dos controles do CPF e CNPJ
  public tooltip_cpf: string = "";
  public tooltip_cnpj: string = "";

  constructor(
    private route: ActivatedRoute
    ,private location: Location
    ,private toastr: ToastrService
    ,private router: Router
    ,private formBuilder: FormBuilder
    )
  {

    this.cliente = {} as clienteData;

  };

  ngOnInit(): void {

    this.cliente_form = this.formBuilder.group(
      {
        Cad_Cliente_Nome: ['', Validators.required]
        ,Cad_Cliente_Email: ['', Validators.required]
        ,Cad_Cliente_Telefone: ['', ]
        ,Cad_Cliente_Nome_Loja: ['', ]
        ,Cad_Cliente_Tipo: ['', ]
        ,Cad_Cliente_CPF: ['', ]
        ,Cad_Cliente_CNPJ: ['', ]
        ,Cad_Cliente_Endereco: ['', ]
        ,Cad_Cliente_Numero: ['', ]
        ,Cad_Cliente_Complemento: ['', ]
        ,Cad_Cliente_Cidade: ['', ]
        ,Cad_Cliente_Estado: ['', ]
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

    // carregar os dados do cliente se foi recebido um id na url
    this.getCliente();

    // desativar os campos se estiver no modo de visualizacao
    if ( this.IsInViewMode() ) {
      this.cliente_form.get("Cad_Cliente_Nome")?.disable();
      this.cliente_form.get("Cad_Cliente_Email")?.disable();
      this.cliente_form.get("Cad_Cliente_Telefone")?.disable();
      this.cliente_form.get("Cad_Cliente_Nome_Loja")?.disable();
      this.cliente_form.get("Cad_Cliente_Tipo")?.disable();
      this.cliente_form.get("Cad_Cliente_CPF")?.disable();
      this.cliente_form.get("Cad_Cliente_CNPJ")?.disable();
      this.cliente_form.get("Cad_Cliente_Endereco")?.disable();
      this.cliente_form.get("Cad_Cliente_Numero")?.disable();
      this.cliente_form.get("Cad_Cliente_Complemento")?.disable();
      this.cliente_form.get("Cad_Cliente_Cidade")?.disable();
      this.cliente_form.get("Cad_Cliente_Estado")?.disable();

      this.PageTitle = "Visualizando cliente";

      this.tooltip_cpf = "";
      this.tooltip_cnpj = "";
    }
    else {

      if ( this.GetMode() == "I") {
        this.SubmitButtonText = "Confirmar Inclusão";
        this.PageTitle = "Incluindo cliente";
        // desativar estes campos porque o campo correto serah ativado quando o usuario seleciona o "tipo do cliente"
        this.cliente_form.get("Cad_Cliente_CNPJ")?.disable();
        this.cliente_form.get("Cad_Cliente_CPF")?.disable();

        this.tooltip_cpf = "Selecione primeiro o \'Tipo do Cliente\'";
        this.tooltip_cnpj = "Selecione primeiro o \'Tipo do Cliente\'";
      }
      else if ( this.GetMode() == "E") {
        this.SubmitButtonText = "Confirmar Edição";
        this.PageTitle = "Editando cliente";
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

  // obter o dados do cliente conforme o id recebido na url
  getCliente(): void {

    //console.log("id=" + this.id);

    if ( this.id ) {
      this.clientsApiService.getCliente_http(this.id)
        .subscribe(cliente => this.cliente = cliente);
      // &todo& precisa tratar aqui o caso do usuario digitar uma url com um id de cliente que nao existe
      // a ideia eh exibir uma msg avisando usando o toastr e redirecionar para a tela do cadastro
    }
  }

  // executado quando o usuario seleciona algum "tipo do cliente" no respectivo select
  on_Cad_Cliente_Tipo_Change(value :String) {

    //console.log("on_Cad_Cliente_Tipo_Change - value=" + value);

    // desativar os campos CPF e CNPF
    this.cliente_form.get("Cad_Cliente_CNPJ")?.disable();
    this.cliente_form.get("Cad_Cliente_CPF")?.disable();

    // se nao estah no modo de visualizacao, eh inclusao ou edicao e
    // deve habilitar algum dos campos CPF ou CNPJ e limpar o outro
    if ( !this.IsInViewMode() ) {
      // ativar o campo CPF ou CNPJ de acordo com o tipo cliente selecionado pelo usuario
      if ( value == "Pessoa Física") {
        this.cliente_form.get("Cad_Cliente_CPF")?.enable();
        this.cliente_form.get("Cad_Cliente_CNPJ")?.setValue("");
        this.tooltip_cpf = "";
        this.tooltip_cnpj = "Fica habilitado apenas se selecionar o tipo de cliente 'Pessoa Jurídica'";
      }
      else if ( value == "Pessoa Jurídica") {
        this.cliente_form.get("Cad_Cliente_CNPJ")?.enable();
        this.cliente_form.get("Cad_Cliente_CPF")?.setValue("");
        this.tooltip_cpf = "Fica habilitado apenas se selecionar o tipo de cliente 'Pessoa Física'";
        this.tooltip_cnpj = "";
      }
      else if ( value == "") {
        this.tooltip_cpf = "Selecione primeiro o \'Tipo do Cliente\'";
        this.tooltip_cnpj = "Selecione primeiro o \'Tipo do Cliente\'";
      }
    }

    return true;
  } // on_Cad_Cliente_Tipo_Change

  // executado quando o botao type submit eh clicado
  onSubmit(pFormValues: any): void {

    var local_toastr = this.toastr;

    var local_router = this.router;

    //console.log("post param=" + JSON.stringify(pFormValues));

    // montar a msg que serah exibida se a confirmacao for feita com sucesso
    var MsgSucesso : string = "";
    MsgSucesso = this.GetMode() == "I" ? "Cliente incluído com sucesso!" : (this.GetMode() == "E" ? "Cliente alterado com sucesso!" : "");

    // funcao executada quando ha sucesso
    function OnSaveSuccess_CallBackFunction() {

      local_toastr.success(MsgSucesso , '', {
         timeOut: 3000
         ,enableHtml: true
         ,positionClass: 'toast-top-center'
      });

      local_router.navigate(['/cliente-list']);

    } // OnSaveSuccess_CallBackFunction

    // funcao executada quando ha erro
    function OnSaveError_CallBackFunction(pError : any) {

      local_toastr.error("Erro! <br />" + pError.message + "<br />" + pError.error, '', {
         disableTimeOut: true
         ,enableHtml: true
         ,positionClass: 'toast-top-center'
      });

    } // OnSaveError_CallBackFunction

    //console.log("this.cliente=" + JSON.stringify(this.cliente));
    //console.log("this.IsInViewMode=" + this.IsInViewMode());
    //console.log("this.mode=" + this.mode);

    if ( ! this.IsInViewMode() ) {

      if (this.cliente != null) {

        if ( this.mode == "I") {

          //console.log("this.movimentacao.data_hora=" + this.movimentacao.data_hora);

          //console.log("vai executar o this.clientsApiService.postCliente");

          this.clientsApiService.criarNovoCliente(this.cliente)
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

          //console.log("vai executar o this.clientsApiService.editarCliente");

          this.clientsApiService.editarCliente(this.cliente, this.id)
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
