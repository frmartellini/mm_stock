import { Component, Input, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ClienteService } from '../services/cliente.service';
import { response } from 'express';
import { clienteData } from '../CLIENTEDATA';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Location } from '@angular/common';

@Component({
  selector: 'app-cliente-det',
  templateUrl: './cliente-det.component.html',
  styleUrl: './cliente-det.component.css'
})
export class ClienteDetComponent implements OnInit {

  @Input() cliente: clienteData;

  // id do registro que estah sendo exibido (deve ser zero quando abrir a tela para fazer um novo cadastro)
  public id :number = 0;

  // contem o modo que a tel aestah sendo utilizada: V - visualizacao , E = Edicao , I - Inclusao
  public mode :string = "";

  private readonly clientsApiService = inject(ClienteService)

  public cliente_form: FormGroup = new FormGroup({
    nome_completo: new FormControl(''),
    email: new FormControl(''),
    telefone: new FormControl(''),
    nome_loja: new FormControl(''),
    cpf: new FormControl(''),
    cnpj: new FormControl(''),
    tipo_cliente: new FormControl(''),
    endereco: new FormControl(''),
    numero: new FormControl(''),
    complemento: new FormControl(''),
    cidade: new FormControl(''),
    uf: new FormControl(''),
  });

  constructor(
    private route: ActivatedRoute
    ,private location: Location
    ,private toastr: ToastrService
    ,private router: Router
    /*,private movservice: MovimentacaoService
    ,private prodservice: ProdutoService
    ,private formBuilder: FormBuilder
    */
    )
  {

    this.cliente = {} as clienteData;

  };

  ngOnInit(): void {

    console.log("this.route.snapshot.params[mode]=" +this.route.snapshot.params["mode"]);

    this.id = Number(this.route.snapshot.paramMap.get('id'));
    //this.mode = String(this.route.snapshot.params["mode"]); // nao funciona
    this.mode = String(this.route.snapshot.queryParamMap.get('mode'));
    //console.log("this.id=" + this.id);
    //console.log("this.mode inicial=" + this.mode);
    if ( this.id == 0) {
      this.mode = "I";
    }
    else {
      //this.mode = String(this.route.snapshot.params["mode"]);
      if ( (this.mode != "E") && (this.mode != "V") ) {
        this.mode = "V";
      }
    }

    //console.log("this.mode final=" + this.mode);

    // carregar os dados do cliente se foi recebido um id na url
    this.getCliente();

  }

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
    
    console.log("id=" + this.id);

    if ( this.id ) {
      this.clientsApiService.getCliente_http(this.id)
        .subscribe(cliente => this.cliente = cliente);
    }
  }

  public postCliente():void {
    const cliente = this.cliente_form.value;
    this.clientsApiService.criarNovoCliente(cliente).subscribe({
      next: (response) => console.log(response),
      //error: (err) => console.log(err)
    });
    // &todo& melhorar este tratamento de erro para avisar o usuario
    
  }

  //Submit(pFormValues: any): void {
    Submit(): void {

    var local_toastr = this.toastr;

    var local_router = this.router;

    //console.log("post param=" + JSON.stringify(pFormValues));

    // funcao executada quando ha sucesso
    function OnSaveSuccess_CallBackFunction() {

      // local_toastr.success('Entrada de produto registrada!' , '', {
      //   timeOut: 3000
      //   ,positionClass: 'toast-top-center'
      // });
      alert("deu certo");
      // &todo& revisar e melhorar

      local_router.navigate(['/cliente-list']);
  
    } // OnSaveSuccess_CallBackFunction

    // funcao executada quando ha erro
    function OnSaveError_CallBackFunction() {

      // local_toastr.error('Erro ao registrar a entrada de produto!' , '', {
      //   timeOut: 3000
      //   ,positionClass: 'toast-top-center'
      // });
      alert("deu erro");
      // &todo& revisar e melhorar
  
    } // OnSaveError_CallBackFunction

    //console.log("this.cliente=" + JSON.stringify(this.cliente));
    //console.log("this.IsInViewMode=" + this.IsInViewMode());
    //console.log("this.mode=" + this.mode);

    if ( ! this.IsInViewMode() ) {

      if (this.cliente != null) {

        if ( this.mode == "I") {

          //this.movimentacao.data_hora = Utils.getCurrentDateTime_forMysql();
          //this.movimentacao.tipo_mov = "E";

          //console.log("this.movimentacao.data_hora=" + this.movimentacao.data_hora);

          //console.log("vai executar o this.clientsApiService.postCliente");

          //this.postCliente();

          //const cliente = this.cliente_form.value;
          this.clientsApiService.criarNovoCliente(this.cliente)
            .subscribe({
              //next: (response) => console.log(response),
              next: response => {},

              error: error => {
                OnSaveError_CallBackFunction();
              },

              complete() {
                OnSaveSuccess_CallBackFunction();
              }
              //error: (err) => console.log(err)
            });
          
        }
        else if (this.mode == "E") {

          //console.log("vai executar o this.clientsApiService.editarCliente");

          // setar os campos que nao pegaram o valro automaticamente nao sei porque
          this.cliente.tipo_cliente = this.cliente_form.get("tipo_cliente")?.value;
          this.cliente.uf = this.cliente_form.get("uf")?.value;

          this.clientsApiService.editarCliente(this.cliente, this.id)
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

    }

  } // onSubmit

} // class
