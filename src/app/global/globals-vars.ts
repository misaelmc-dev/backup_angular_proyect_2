import { Injectable } from '@angular/core';

@Injectable()
export class GlobalsVars {
  /**
   * Para sysadmin
   * Según el ambiente (producción, desarrollo o sandbox) descomentar SOLO la variable correspondiente
   */

  env = 'dev' //para ambiente de desarrollo
  //env = 'production' // para ambiente de producción
  //env = 'sandbox' // para ambiente de sandbox

  /**
   * Para sysadmin
   * NO TOCAR NADA DE LO DE ABAJO
   */
  base_path = 'https://backend' + `${(this.env == 'production') ? ('') : ('-' + this.env)}` + '.scintra.com'
  //base_path = 'http://localhost:8000'
  base_broadcasting_auth_url = this.base_path + '/broadcasting/auth'

  base_sig_url = 'https://sig' + `${(this.env == 'production') ? ('') : ('-' + this.env)}` + '.scintra.com'
  //base_sig_url = 'http://localhost:63342/sig/index.html'

  backend_base_url = `${this.base_path}/api`;
}
