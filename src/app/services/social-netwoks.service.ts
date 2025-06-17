import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {GlobalsVars} from "../global/globals-vars";

@Injectable({
  providedIn: 'root'
})
export class SocialNetwoksService {

  constructor(private http: HttpClient, private globals: GlobalsVars) { }

  getAllRedes() {
    let endpoint = `${this.globals.backend_base_url}/redes_sociales`
    return this.http.get(endpoint)
  }

  getRedesByInvestigator(idInvest:number) {
    let endpoint = `${this.globals.backend_base_url}/investigador/${idInvest}/redes`
    return this.http.get(endpoint)
  }

  addRedToInvestigador(idInvest:number,idRed:number,url:string){
    let endpoint = `${this.globals.backend_base_url}/investigador/${idInvest}/redsocial/${idRed}/asociar`
    let datos = new FormData();
    datos.append('url_perfil', url.toString());
    return this.http.post(endpoint,datos)
  }

  removeRedToInvestigador(idInvest:number,idRed:number){
    let endpoint = `${this.globals.backend_base_url}/investigador/${idInvest}/redsocial/${idRed}/desasociar`
    let datos = new FormData();
    return this.http.post(endpoint,datos)
  }

}
