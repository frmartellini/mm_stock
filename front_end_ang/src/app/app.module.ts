import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { MatPaginatorModule } from '@angular/material/paginator';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { ClienteListComponent } from './cliente-list/cliente-list.component';
import { ProdutoListComponent } from './produto-list/produto-list.component';
import { FornecedorListComponent } from './fornecedor-list/fornecedor-list.component';
import { FornecedorDetComponent } from './fornecedor-det/fornecedor-det.component';
import { ProdutoDetComponent } from './produto-det/produto-det.component';
import { ClienteDetComponent } from './cliente-det/cliente-det.component';
import { LoginComponent } from './login/login.component';
import { ConfigComponent } from './config/config.component';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { ProdutoEntradaComponent } from './produto-entrada/produto-entrada.component';
import { ProdutoSaidaComponent } from './produto-saida/produto-saida.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { MatSelectModule }  from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MovimentacaoCsComponent } from './movimentacao-cs/movimentacao-cs.component';


@NgModule({
  declarations: [
    HomeComponent
    ,AppComponent
    ,ProdutoListComponent
    ,FornecedorListComponent
    ,FornecedorDetComponent
    ,ProdutoDetComponent
    ,ClienteDetComponent
    ,ClienteListComponent
    ,LoginComponent
    ,ConfigComponent
    ,ProdutoEntradaComponent
    ,ProdutoSaidaComponent
    ,MovimentacaoCsComponent


  ],
  imports: [
    BrowserModule
    ,FormsModule
    ,ReactiveFormsModule
    ,AppRoutingModule
    ,HttpClientModule
    ,MatSortModule
    ,MatInputModule
    ,MatFormFieldModule
    ,MatPaginatorModule
    ,MatTableModule
    ,ToastrModule.forRoot()
    ,BrowserAnimationsModule
    ,MatSort
    ,MatSelectModule
    ,MatButtonModule

  ],
  providers: [
    provideClientHydration(),
    provideAnimationsAsync(),

  ],
  bootstrap: [AppComponent]
})

export class AppModule { }
