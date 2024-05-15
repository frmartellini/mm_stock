import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { MatPaginatorModule,MatPaginatorIntl } from '@angular/material/paginator';
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
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule, MatIconButton } from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MovimentacaoCsComponent } from './movimentacao-cs/movimentacao-cs.component';
import { CustomPaginator } from './custom-paginator';

import {HashLocationStrategy, LocationStrategy, registerLocaleData, DecimalPipe} from '@angular/common';
import { LOCALE_ID } from '@angular/core';
import locale_pt from '@angular/common/locales/pt';
registerLocaleData(locale_pt);

import { CurrencyMaskConfig, CurrencyMaskModule, CURRENCY_MASK_CONFIG } from "ng2-currency-mask";

// configuracoes pre-definidas para o input "currencyMask" (ng2-currency-mask)
export const CustomCurrencyMaskConfig: CurrencyMaskConfig = {
  align: "right",
  allowNegative: false,
  decimal: ",",
  precision: 2,
  prefix: "R$ ",
  suffix: "",
  thousands: "."
};

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
    ,ProdutoSaidaComponent


  ],
  imports: [
    BrowserModule
    , FormsModule
    , ReactiveFormsModule
    , AppRoutingModule
    , HttpClientModule
    , MatSortModule
    , MatInputModule
    , MatIconModule
    , MatFormFieldModule
    , MatPaginatorModule
    , MatTableModule
    , ToastrModule.forRoot()
    , BrowserAnimationsModule
    , MatSort
    , MatSelectModule
    , MatButtonModule
    , MatAutocompleteModule
    , MatTooltipModule
    , CurrencyMaskModule

  ],
  providers: [
    provideClientHydration(),
    provideAnimationsAsync(),
    { provide: MatPaginatorIntl, useValue: CustomPaginator() },
    { provide: LOCALE_ID, useValue: 'pt' },
    { provide: CURRENCY_MASK_CONFIG, useValue: CustomCurrencyMaskConfig },

  ],
  bootstrap: [AppComponent]
})

export class AppModule { }
