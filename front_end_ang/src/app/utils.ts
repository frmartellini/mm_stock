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

} // class
