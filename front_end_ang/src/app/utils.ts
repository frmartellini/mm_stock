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

} // class
