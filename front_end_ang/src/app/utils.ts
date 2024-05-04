import { formatDate } from "@angular/common";

// classe que contem rotinas diversas usadas no projeto
export default class Utils {
  
  // retorna uma string com a data/hroa atual no formato brasileiro
  static getDateTimeString() :string {
    return formatDate(Date.now(), 'dd/MM/yyyy HH:mm:ss', 'en-US', '-0300');
  } // getDateTimeString()



} // class
