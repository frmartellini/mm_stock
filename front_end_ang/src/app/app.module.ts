import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';

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

@NgModule({
  declarations: [
    HomeComponent,
    AppComponent,
    ClienteListComponent,
    ProdutoListComponent,
    FornecedorListComponent,
    FornecedorDetComponent,
    ProdutoDetComponent,
    ClienteDetComponent
    ,LoginComponent
    ,ConfigComponent
    
  ],
  imports: [
    BrowserModule
    ,FormsModule
    ,ReactiveFormsModule
    ,AppRoutingModule
    ,HttpClientModule

    ,ToastrModule.forRoot()
    ,BrowserAnimationsModule
    
  ],
  providers: [
    provideClientHydration()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
