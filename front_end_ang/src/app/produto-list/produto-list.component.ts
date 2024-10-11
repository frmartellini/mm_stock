import { Component,ViewChild,OnInit} from '@angular/core';
import { ENV } from '../env';
import { HttpClient } from '@angular/common/http';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import { MatTableDataSource} from '@angular/material/table';
import { ProdutoService } from '../services/produto.service';
import { ToastrService } from 'ngx-toastr';
import { AuthenticationService } from '../services/authentication.service';
import Utils from '../utils';
import { UsuarioService } from '../services/usuario.service';
import { MatSelectionList } from '@angular/material/list';



export interface produtoData{

  id_produto: number;
  descricao: string;
  cor: string;
  tamanho: string;
  tipo_material: string;
  preco_venda: number;
  quantidade_atual: number;
}

let PRODUTO_DATA: produtoData[]=[];
@Component({
  selector: 'app-produto-list',
  templateUrl: './produto-list.component.html',
  styleUrl: './produto-list.component.scss',

})

export class ProdutoListComponent implements OnInit {
  public dataSource : any; // apenas declarar aqui porque este obj vai ser criado soh depois quando os regs forem obtidos do bd
  public displayColumn: string[] = ['id_produto','descricao','cor','tamanho','tipo_material','preco_venda','quantidade_atual','actions'];
  public bPodeIncluir : boolean = false;
  public bPodeEditar : boolean = false;
  public bPodeExcluir : boolean = false;
  // precisa ter esta declaracao public para poder chamar do template HTML
  public GetEditarLink = Utils.GetEditarLink;
  
  
  @ViewChild(MatPaginator) paginator: MatPaginator | any;
  @ViewChild(MatSort) sort: MatSort | any;

  constructor(private http: HttpClient
              ,private authservice : AuthenticationService
              ,private produtoService: ProdutoService
              ,private toastr: ToastrService
              )
  {
    // inicializar as vars
    this.bPodeIncluir = this.authservice.CheckPrivilegio("CadUsuInc");
    //console.log("bPodeIncluir=" + this.bPodeIncluir);
    this.bPodeEditar = this.authservice.CheckPrivilegio("CadUsuEdi");
    //console.log("bPodeEditar=" + this.bPodeEditar);
    this.bPodeExcluir = this.authservice.CheckPrivilegio("CadUsuExc");
    //console.log("bPodeExcluir=" + this.bPodeExcluir);
  }
    
  public PrivilegiosObj = UsuarioService.PrivilegiosObj;

  @ViewChild('privilegios') ListPrivilegios: MatSelectionList = {} as MatSelectionList;

  //Inicialização dos dados na tabela
  ngOnInit(){
    this.fetchData();
    //console.log("UsuarioListComponent.ngOnInit - this.authservice.UsuarioLogado=" + JSON.stringify(this.authservice.UsuarioLogado));
  }

   // Obtenção dos Dados da API
   fetchData(): void {
    this.http.get(ENV.REST_API_URL+'/produto').subscribe(
        (response: any) =>
          {
            PRODUTO_DATA = response;
            this.dataSource = new MatTableDataSource(PRODUTO_DATA);
            this.dataSource.sort = this.sort;
            this.dataSource.paginator = this.paginator;
           /* setTimeout(() => {
              console.log(this.sort) //not undefined
              this.dataSource.sort = this.sort;
            })*/

          }
    )
  }
  public GetStrPriv(pCtrlList :MatSelectionList) : string {

    let str_privs : string = ""; // var que serah retornada pela funcao

    // se o pCtrlList eh valido e possui opcoes
    if ( pCtrlList && pCtrlList.options) {
      // inicializar a strng com zero em cada char da string
      str_privs = "0".repeat(pCtrlList.options.length);
      //console.log("str_privs inicialziado="+str_privs+ " length="+ str_privs.length);
      // passar pelos itens (privilegios)
      for ( let i = 0; i < pCtrlList.options.length; i++ ) {

        if ( pCtrlList.options.get(i)?.selected ) {
          // remontar a string trocando o char da posicao i de 0 para 1
          str_privs = str_privs.substring(0,i) + "1" + str_privs.substring(i+1);
        }

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

    if ( pCtrlList && pCtrlList.options && pStrPrivs ) {
      //console.log("RestoreStrPriv - entrou no if");
      // passar por cada opcao e selecionar a opcao se o char da string for 1
      for (let i = 0; i < pCtrlList.options.length; i++ ) {
        if ( pStrPrivs.charAt(i) == '1' ) {
          pCtrlList.options.get(i)?._setSelected(true);
        }
      } // for
    } // if
    //console.log("RestoreStrPriv - fim");
    return str_privs;
  } // RestoreStrPriv

  //Deletar cadastro
  excluirItem(id_produto: number) {
    if (confirm('Tem certeza que deseja excluir este produto?')) {
      this.produtoService.excluirItem(id_produto).subscribe(() => {
        // avisar o usuario
        this.toastr.success('Produto excluído com sucesso!' , '', {
          timeOut: 3000
          ,positionClass: 'toast-top-center'
        });
        this.fetchData(); // Recarregar os itens após a exclusão
      },
      (error) => {
        console.error('Erro ao deletar post:', error.error);
        // error.error contém a mensagem de erro enviada pelo servidor
        alert(error.error);
      }); // subscribe
    } // confirm
  } // excluirItem
 
  //filtro
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  ngOnChanges(){
    this.dataSource.sort = this.sort;
    console.log(this.sort)
    this.dataSource.paginator = this.paginator;
    console.log("paginador",this.paginator);

  }

}

