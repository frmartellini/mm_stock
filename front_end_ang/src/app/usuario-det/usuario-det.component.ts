import { Component, Input, OnInit, QueryList, ViewChild, inject } from '@angular/core';
import { UsuarioService } from '../services/usuario.service';
import { USUARIO } from '../USUARIO';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Location } from '@angular/common';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatListOption, MatSelectionList } from '@angular/material/list';

@Component({
  selector: 'app-usuario-det',
  templateUrl: './usuario-det.component.html',
  styleUrl: './usuario-det.component.scss'
})

export class UsuarioDetComponent implements OnInit {

  @Input() usuario: USUARIO;

  // id do registro que estah sendo exibido (deve ser zero quando abrir a tela para fazer um novo cadastro)
  public id :number = 0;

  // contem o modo que a tela estah sendo utilizada: V - visualizacao , E = Edicao , I - Inclusao
  public mode :string = "";

  private readonly usuariosApiService = inject(UsuarioService)

  public usuario_form: any;

  public PageTitle: String = "Incluindo ou editando usuario";
  public SubmitButtonText: String = "Confirmar";

  public PrivilegiosObj = UsuarioService.PrivilegiosObj;

  @ViewChild('privilegios') ListPrivilegios: MatSelectionList = {} as MatSelectionList;

  constructor (
    private route: ActivatedRoute
    ,private location: Location
    ,private toastr: ToastrService
    ,private router: Router
    ,private formBuilder: FormBuilder
    )
  {
    this.usuario = {} as USUARIO;
  };

  ngOnInit(): void {

    this.usuario_form = this.formBuilder.group(
      {
        Cad_Usuario_Login: ['', Validators.required]
        ,Cad_Usuario_Nome: ['', Validators.required]
        ,Cad_Usuario_Senha: ['', this.GetMode() == "I" ? Validators.required : Validators.nullValidator ]
        ,Cad_Usuario_SenhaConf: ['', this.GetMode() == "I" ? Validators.required : Validators.nullValidator ]
        ,Cad_Usuario_Privs: [ ]
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

    // carregar os dados do usuario se foi recebido um id na url
    this.getUsuario();

    // desativar os campos se estiver no modo de visualizacao
    if ( this.IsInViewMode() ) {
      this.usuario_form.get("Cad_Usuario_Login")?.disable();
      this.usuario_form.get("Cad_Usuario_Nome")?.disable();
      this.usuario_form.get("Cad_Usuario_Privs")?.disable();

      this.PageTitle = "Visualizando usuário";

    }
    else {

      if ( this.GetMode() == "I") {
        this.SubmitButtonText = "Confirmar Inclusão";
        this.PageTitle = "Incluindo usuário";
      }
      else if ( this.GetMode() == "E") {
        this.SubmitButtonText = "Confirmar Edição";
        this.PageTitle = "Editando usuário";
      }

    }

    // adicionar o validador da senha apenas se estiver incluindo um usuario
    if ( this.mode == "I" ) {
      this.usuario_form.validator = ConfirmPasswordValidator.MatchPassword;
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

  // obter o dados do usuario conforme o id recebido na url
  getUsuario(): void {

    //console.log("id=" + this.id);

    if ( this.id ) {
      this.usuariosApiService.getUsuario_http(this.id)
        .subscribe(usuario => {
          this.usuario = usuario;
          // inicializar
          if ( (this.GetMode() == "E") || this.GetMode() == "V" ) {
            this.RestoreStrPriv(this.ListPrivilegios,this.usuario.privilegios);
          }
        });
      // &todo& precisa tratar aqui o caso do usuario digitar uma url com um id de usuario que nao existe
      // a ideia eh exibir uma msg avisando usando o toastr e redirecionar para a tela do cadastro
    }
  }

  // obter uma string com zeros e uns (a partir do controle mat-selection-list) representando os privilegios do usuario
  public GetStrPriv(pCtrlList :MatSelectionList) : string {
    
    let str_privs : string = ""; // var que serah retornada pela funcao
    
    let pos : number;

    // se o pCtrlList eh valido e possui opcoes
    if ( pCtrlList && pCtrlList.options) {

      // inicializar a strng com zero em cada char da string
      str_privs = "0".repeat(pCtrlList.options.length);
      //console.log("str_privs inicialziado="+str_privs+ " length="+ str_privs.length);

      // passar pelos itens (privilegios) do controle mat-selection-list
      for ( let i = 0; i < pCtrlList.options.length; i++ ) {
        // se o item estah selecionado
        if ( pCtrlList.options.get(i)?.selected ) {
          // obter a posicao do privilegio na string
          pos = pCtrlList.options.get(i)?.value;
          //console.log("pos="+pos);

          // se a posicao NAO eh a primeira
          if ( pos > 0 ) {
          // remontar a string colocando "1" na posicao "pos" da string
          str_privs = str_privs.substring(0,pos-1) + "1" + str_privs.substring(pos);
          }
          // se a posicao EH a primeira
          else {
            str_privs = "1" + str_privs.substring(pos+1);
          }
        } // for

        //console.log(i + "  str_privs final="+str_privs + " length="+ str_privs.length);
      } // for
      
    } // if

    //console.log("str_privs final="+str_privs + " length="+ str_privs.length);
    return str_privs;
  } // GetStrPriv

  // selecionar os itens do mat-selection-list a partir da string contendo os zeros e uns indicando os privilegios
  public RestoreStrPriv(pCtrlList :MatSelectionList, pStrPrivs :String) {
    //console.log("RestoreStrPriv - inicio");
    //console.log("pStrPrivs=" + pStrPrivs);
    let str_privs : string = "";
    
    let pos : number;

    if ( pCtrlList && pCtrlList.options && pStrPrivs ) {
      //console.log("RestoreStrPriv - entrou no if");
      // passar por cada opcao e selecionar a opcao se o char da string for 1
      for (let i = 0; i < pCtrlList.options.length; i++ ) {
        
        pos = pCtrlList.options.get(i)?.value;
        //console.log("RestoreStrPriv - pos=" + pos);
        if ( pStrPrivs.charAt(pos-1) == "1" ) {
          //console.log("RestoreStrPriv - entrou no if == 1");
          pCtrlList.options.get(i)?._setSelected(true);
        }
      } // for
    } // if
    //console.log("RestoreStrPriv - fim");
    return str_privs;
  } // RestoreStrPriv

  // executado quando o botao type submit eh clicado
  onSubmit(pFormValues: any): void {

    var local_toastr = this.toastr;

    var local_router = this.router;

    //console.log("post param=" + JSON.stringify(pFormValues));

    // montar a msg que serah exibida se a confirmacao for feita com sucesso
    var MsgSucesso : string = "";
    MsgSucesso = this.GetMode() == "I" ? "Usuário incluído com sucesso!" : (this.GetMode() == "E" ? "Usuário alterado com sucesso!" : "");

    // funcao executada quando ha sucesso
    function OnSaveSuccess_CallBackFunction() {

      local_toastr.success(MsgSucesso , '', {
         timeOut: 3000
         ,enableHtml: true
         ,positionClass: 'toast-top-center'
      });

      local_router.navigate(['/usuario-list']);

    } // OnSaveSuccess_CallBackFunction

    // funcao executada quando ha erro
    function OnSaveError_CallBackFunction(pError : any) {

      local_toastr.error("Erro! <br />" + pError.message + "<br />" + pError.error, '', {
         disableTimeOut: true
         ,enableHtml: true
         ,positionClass: 'toast-top-center'
      });

    } // OnSaveError_CallBackFunction

    //console.log("this.usuario=" + JSON.stringify(this.usuario));
    //console.log("this.IsInViewMode=" + this.IsInViewMode());
    //console.log("this.mode=" + this.mode);

    if ( ! this.IsInViewMode() ) {

      if (this.usuario != null) {

        this.usuario.privilegios = this.GetStrPriv(this.ListPrivilegios);

        if ( this.mode == "I") {

          //console.log("this.movimentacao.data_hora=" + this.movimentacao.data_hora);

          //console.log("vai executar o this.usuariosApiService.postCliente");

          this.usuario.senha = this.usuario_form.get("Cad_Usuario_Senha").value;

          this.usuariosApiService.criarNovoUsuario(this.usuario)
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

          //console.log("vai executar o this.usuariosApiService.editarCliente");

          this.usuariosApiService.editarUsuario(this.usuario, this.id)
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

// confirmacao da senha
export class ConfirmPasswordValidator {
  /**
   * Check matching password with confirm password
   * @param control AbstractControl
   */
  static MatchPassword(control: AbstractControl) {
    
    const senha = control.get('Cad_Usuario_Senha')?.value;
    const senhaconf = control.get('Cad_Usuario_SenhaConf')?.value;
    //console.log("senhas digitadas=" + senhaconf + '  ' + senhaconf);
    
    // se as senhas digitadas nos dois campos nao batem, indicarque estah com erro
    if (senha !== senhaconf) {
      // indicar que houve erro
      control.get('Cad_Usuario_SenhaConf')?.setErrors({ConfirmPassword: true});
    }
    else
    {
      // remover a indicacao de erro
      control.get('Cad_Usuario_SenhaConf')?.setErrors(null);  
    }
    return;
  }
}
