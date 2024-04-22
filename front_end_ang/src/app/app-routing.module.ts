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

const routes: Routes = [

  { path: '', redirectTo: 'home', pathMatch: 'full' } //default route
  ,{ path: 'home', component: HomeComponent }
  ,{ path: 'produto-list', component: ProdutoListComponent }
  ,{ path: 'cliente-list', component: ClienteListComponent }
  ,{ path: 'fornecedor-list', component: FornecedorListComponent }
  ,{ path: 'produto-det/:id', component: ProdutoDetComponent }
  ,{ path: 'cliente-det/:id', component: ClienteDetComponent }
  ,{ path: 'fornecedor-det/:id', component: FornecedorDetComponent }

  ,{ path: 'produto-entrada', component: HomeComponent }
  ,{ path: 'produto-saida', component: HomeComponent }
  ,{ path: 'cs-mov-estq', component: HomeComponent }
  ,{ path: 'config', component: HomeComponent }
  

];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot(routes)

  ],
  
  exports: [RouterModule]
})
export class AppRoutingModule { }
