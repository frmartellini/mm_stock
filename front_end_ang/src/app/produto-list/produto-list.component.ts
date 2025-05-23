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

export interface produtoData{

  id_produto: number;
  descricao: string;
  cor: string;
  tamanho: string;
  tipo_material: string;
  preco_venda: number;
  quantidade_atual: number;
  localizacao: string | null | undefined;
}

let PRODUTO_DATA: produtoData[]=[];
@Component({
  selector: 'app-produto-list',
  templateUrl: './produto-list.component.html',
  styleUrl: './produto-list.component.scss',

})

export class ProdutoListComponent implements OnInit {
  public dataSource : any; // apenas declarar aqui porque este obj vai ser criado soh depois quando os regs forem obtidos do bd
  public displayColumn: string[] = ['id_produto','descricao','cor','tamanho','tipo_material','preco_venda','quantidade_atual', 'localizacao', 'actions'];
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
    this.bPodeIncluir = this.authservice.CheckPrivilegio("CadProdInc");
    //console.log("bPodeIncluir=" + this.bPodeIncluir);
    this.bPodeEditar = this.authservice.CheckPrivilegio("CadProdEdi");
    //console.log("bPodeEditar=" + this.bPodeEditar);
    this.bPodeExcluir = this.authservice.CheckPrivilegio("CadProdExc");
    //console.log("bPodeExcluir=" + this.bPodeExcluir);
  }
    
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
        console.error('Erro ao deletar produto:', error.error);
        // error.error contém a mensagem de erro enviada pelo servidor
        //alert(error.error);
        // avisar o usuario
        this.toastr.error(error.error , 'Erro', {
          disableTimeOut: true
          ,positionClass: 'toast-top-center'
        });
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

