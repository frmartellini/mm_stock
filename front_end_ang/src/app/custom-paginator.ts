import { MatPaginatorIntl } from "@angular/material/paginator";

// traduzir os textos do paginator do table do angular material
export function CustomPaginator() {
  const customPaginatorIntl = new MatPaginatorIntl();

  customPaginatorIntl.itemsPerPageLabel = 'Itens por Página:';
  customPaginatorIntl.firstPageLabel = 'Primeira página';
  customPaginatorIntl.previousPageLabel = 'Página anterior';
  customPaginatorIntl.nextPageLabel = 'Próxima página';
  customPaginatorIntl.lastPageLabel = 'Última página';

  return customPaginatorIntl;
}
