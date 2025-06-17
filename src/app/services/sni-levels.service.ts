import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {GlobalsVars} from "../global/globals-vars";

@Injectable({
  providedIn: 'root'
})
export class SniLevelsService {

  constructor(private http: HttpClient, private globals: GlobalsVars) { }

  getAllLevels() {
    let endpoint = `${this.globals.backend_base_url}/sni_niveles`
    return this.http.get(endpoint)
  }

  getLevelsByInvestigator(idInvest:number) {
    let endpoint = `${this.globals.backend_base_url}/sni_niveles?idsInvest=${idInvest}`
    return this.http.get(endpoint)
  }

  addLevelToInvestigador(idInvest:number,idNivel:number){
    let endpoint = `${this.globals.backend_base_url}/investigador/${idInvest}/sni/${idNivel}/asociar`
    let datos = new FormData();
    return this.http.post(endpoint,datos)
  }

  removeLevelToInvestigador(idInvest:number,idNivel:number){
    let endpoint = `${this.globals.backend_base_url}/investigador/${idInvest}/sni/${idNivel}/desasociar`
    let datos = new FormData();
    return this.http.post(endpoint,datos)
  }

}

