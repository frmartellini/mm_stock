import { Directive, OnInit } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';

const PAGE_SIZE_KEY = 'paginator_page_size';

/*

Esta directiva "PersistPaginatorDirective" serve para configurar o paginator do table do angular material
para salvar e carregar as suas infos a partir do LocalStorage.
Por enquanto, estah salvando e carregando APENAS a "qtde de itens por página" (prop pageSize do Paginator).

Para usar esta diretiva, precisa:

- adicionar o import abaixo no app.module.ts
import { PersistPaginatorDirective } from './PersistPaginator.directive';

- adicionar   PersistPaginatorDirective dentro "declarations" do "NgModule" do app.module.ts

- adicionar PersistPaginator como atributo no mat-paginator.

*/

@Directive({
    selector: '[PersistPaginator]'
})

export class PersistPaginatorDirective implements OnInit {
    
  private element: MatPaginator;

  // retorna o nome da key que eh gravada/lida do LocalStorage
  private GetKeyName() : string {
    var key: string = "";
    // montar o KeyName usando o caminho do location e a const PAGE_SIZE_KEY
    key = (window.location.pathname ?? "") + '?' + PAGE_SIZE_KEY;
    //console.log("PersistPaginatorDirective - GetKeyName() vai retornar =" + key);
    return key;
  }

  // ler o pageSize do LocalStorage e retornar
  get pageSize() {
    var value: string = "";
    value = localStorage.getItem(this.GetKeyName()) ?? "10";
    var PageSize = parseInt(value, 10);
    //console.log("PersistPaginatorDirective - get pageSize() - PageSize=" + PageSize);
    return PageSize;
  }

  // salvar o pageSize no LocalStorage
  set pageSize(size: number) {
    //console.log("PersistPaginatorDirective - set pageSize() - PageSize=" + size);
    localStorage.setItem(this.GetKeyName(), '' + size);
  }

  constructor(private el: MatPaginator) {
    this.element = el;
  }

  ngOnInit(): void {
    
    this.element.pageSize = this.pageSize;

    this.element.page.subscribe((page: PageEvent) => {
      this.pageSize = page.pageSize;
      //console.log("this.element.page.subscribe");
    });
  }

}
