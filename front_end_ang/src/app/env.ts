
// 18/05/2024
// este arquivo NAO DEVE MAIS SER ALTERADO para "trocar" a configuracao REST_API_URL
// esta config REST_API_URL deve ser alterada nos arquivos "environment"

// configs, consts e vars do projeto

import { environment } from "../environments/environment";

//console.log("environment.production=" + environment.production);
//console.log("environment.REST_API_URL=" + environment.REST_API_URL);

export const ENV = {

  REST_API_URL: environment.REST_API_URL
  
};
