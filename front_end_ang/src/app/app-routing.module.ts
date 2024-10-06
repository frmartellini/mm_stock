import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';

import { HomeComponent } from './home/home.component';
import { ProdutoListComponent } from './produto-list/produto-list.component';
import { ClienteListComponent } from './cliente-list/cliente-list.component';
import { FornecedorListComponent } from './fornecedor-list/fornecedor-list.component';
import { FornecedorDetComponent } from './fornecedor-det/fornecedor-det.component';
import { ClienteDetComponent } from './cliente-det/cliente-det.component';
import { ProdutoDetComponent } from './produto-det/produto-det.component';
import { UsuarioListComponent } from './usuario-list/usuario-list.component';
import { UsuarioDetComponent } from './usuario-det/usuario-det.component';
import { LoginComponent } from './login/login.component';
import { UsuarioNaoAutenticadoGuard } from './services/guards/usuario-nao-autenticado.guard';
import { UsuarioAutenticadoGuard } from './services/guards/usuario-autenticado.guard';
import { ConfigComponent } from './config/config.component';
import { ProdutoEntradaComponent } from './produto-entrada/produto-entrada.component';
import { ProdutoSaidaComponent } from './produto-saida/produto-saida.component';
import { MovimentacaoCsComponent } from './movimentacao-cs/movimentacao-cs.component';
import { AlterSenhaComponent } from './altersenha/altersenha.component';

const routes: Routes = [

  { path: 'login', component: LoginComponent, canActivate: [UsuarioNaoAutenticadoGuard]},

  { path: '', pathMatch: 'full' , canActivate: [UsuarioAutenticadoGuard] ,
    children: [
      { path: '', component: HomeComponent }
    ]
  } //default route
  ,{ path: 'home', component: HomeComponent , canActivate: [UsuarioAutenticadoGuard] }
  ,{ path: 'produto-list', component: ProdutoListComponent , canActivate: [UsuarioAutenticadoGuard] }
  ,{ path: 'cliente-list', component: ClienteListComponent , canActivate: [UsuarioAutenticadoGuard] }
  ,{ path: 'fornecedor-list', component: FornecedorListComponent , canActivate: [UsuarioAutenticadoGuard] }
  ,{ path: 'produto-det/:id', component: ProdutoDetComponent , canActivate: [UsuarioAutenticadoGuard] }
  ,{ path: 'cliente-det/:id', component: ClienteDetComponent , canActivate: [UsuarioAutenticadoGuard] }
  ,{ path: 'fornecedor-det/:id', component: FornecedorDetComponent , canActivate: [UsuarioAutenticadoGuard] }
  ,{ path: 'usuario-list', component: UsuarioListComponent , canActivate: [UsuarioAutenticadoGuard] }
  ,{ path: 'usuario-det/:id', component: UsuarioDetComponent , canActivate: [UsuarioAutenticadoGuard] }

  ,{ path: 'produto-entrada', component: ProdutoEntradaComponent , canActivate: [UsuarioAutenticadoGuard] }
  ,{ path: 'produto-entrada/:id', component: ProdutoEntradaComponent , canActivate: [UsuarioAutenticadoGuard] }
  ,{ path: 'produto-saida', component: ProdutoSaidaComponent , canActivate: [UsuarioAutenticadoGuard] }
  ,{ path: 'produto-saida/:id', component: ProdutoSaidaComponent , canActivate: [UsuarioAutenticadoGuard] }
  ,{ path: 'movimentacao-cs', component: MovimentacaoCsComponent , canActivate: [UsuarioAutenticadoGuard] }
  ,{ path: 'config', component: ConfigComponent , canActivate: [UsuarioAutenticadoGuard] }
  ,{ path: 'altersenha', component: AlterSenhaComponent , canActivate: [UsuarioAutenticadoGuard] }


];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot(routes)

  ],

  exports: [RouterModule]
})
export class AppRoutingModule { }
