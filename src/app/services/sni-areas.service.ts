import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {GlobalsVars} from "../global/globals-vars";

@Injectable({
  providedIn: 'root'
})
export class SniAreasService {

  constructor(private http: HttpClient, private globals: GlobalsVars) { }

  getAllAreas() {
    let endpoint = `${this.globals.backend_base_url}/sni_areas`
    return this.http.get(endpoint)
  }

  getAreasByInvestigator(idInvest:number) {
    let endpoint = `${this.globals.backend_base_url}/sni_areas?idsInvest=${idInvest}`
    return this.http.get(endpoint)
  }

  addAreaToInvestigador(idInvest:number,idArea:number){
    let endpoint = `${this.globals.backend_base_url}/investigador/${idInvest}/sniarea/${idArea}/asociar`
    let datos = new FormData();
    return this.http.post(endpoint,datos)
  }

  removeAreaToInvestigador(idInvest:number,idArea:number){
    let endpoint = `${this.globals.backend_base_url}/investigador/${idInvest}/sniarea/${idArea}/desasociar`
    let datos = new FormData();
    return this.http.post(endpoint,datos)
  }

}

