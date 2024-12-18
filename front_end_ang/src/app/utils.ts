import { formatDate } from "@angular/common";

// classe que contem rotinas diversas usadas no projeto
export default class Utils {
  
  // retorna uma string com a data/hora atual no formato brasileiro
  static getDateTimeString() :string {
    return formatDate(Date.now(), 'dd/MM/yyyy HH:mm:ss', 'en-US', '-0300');
  } // getDateTimeString()


  static getCurrentDateTime_forMysql() :string {

    const date = new Date();
    return new Date(date.getTime() - (date.getTimezoneOffset() * 60000)).toISOString().replace(/T/, ' ').replace(/\..+/, '');  

  }

  // retorna o tipo da movimentação "Entrada" ou "Saída" por extenso a partir do tipo de movimentacao abreviado "E" ou "S"
  static getTipoMovText(pTipoMovAbrev: string) :string {

    if ( pTipoMovAbrev == "E" ) {
      return "Entrada";
    }
    else if ( pTipoMovAbrev == "S" ) {
      return "Saída";
    }

    return ""; // retorno default que nunca deve ocorrer

  } // getTipoMovText

  // retorna se uma data eh valida (true) ou nao (false)
  static isDate = (value: unknown): value is Date => {
    
    return value instanceof Date && !isNaN(+value);
    
  } // isDate

  // recarregar a pagina atual
  // o param "pThis" deve ser o objeto do component que tem o "private router: Router" injected no constructor
  static reloadCurrentRoute(pThis : any) : void {
    let currentUrl = pThis.router.url;
    pThis.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
      pThis.router.navigate([currentUrl]);
    });
  } // reloadCurrentRoute

  static GetEditarLink(pID :number, pbPodeEditar :boolean, pRoutePart :string) : string {
    return pbPodeEditar ? '/'+pRoutePart+'-det/' + pID + '?mode=E' : '';
  }

} // class
