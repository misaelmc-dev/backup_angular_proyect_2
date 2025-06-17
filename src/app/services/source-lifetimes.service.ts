import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {GlobalsVars} from "../global/globals-vars";

@Injectable({
  providedIn: 'root'
})
export class SourceLifetimesService {

  constructor(private http: HttpClient, private globals: GlobalsVars) { }

  getLifetimesBySouerce(idFuente:number,page:number) {
    let endpoint = `${this.globals.backend_base_url}/vigenciasfuente?idsFuente=${idFuente}&pageSize=10&page=${page}`
    return this.http.get(endpoint)
  }

  addLifetimesToSource(
    idFuente:number,
    year:number,
  ){
    let endpoint = `${this.globals.backend_base_url}/vigenciasfuente/create`
    let datos = new FormData();
    datos.append('id_fuente', idFuente.toString());
    datos.append('year', year.toString());
    return this.http.post(endpoint,datos)
  }

  updateLifetimesToSource(
    id:number,
    year:number,
    scopus:boolean,
    scimago:boolean,
    woscc:boolean,
    jcr:boolean,
    scielo:boolean,
    conacyt:boolean,
    allow_scopus_modification:boolean,
    allow_scimago_modification:boolean
  ){
    let endpoint = `${this.globals.backend_base_url}/vigenciasfuente/${id}/update`
    let datos = new FormData();
    datos.append('year', year.toString());
    if(scopus){
      datos.append('scopus', '1'.toString());
    }else{
      datos.append('scopus', '0'.toString());
    }
    if(scimago){
      datos.append('scimago', '1'.toString());
    }else{
      datos.append('scimago', '0'.toString());
    }
    if(woscc){
      datos.append('woscc', '1'.toString());
    }else{
      datos.append('woscc', '0'.toString());
    }
    if(jcr){
      datos.append('jcr', '1'.toString());
    }else{
      datos.append('jcr', '0'.toString());
    }
    if(scielo){
      datos.append('scielo', '1'.toString());
    }else{
      datos.append('scielo', '0'.toString());
    }
    if(conacyt){
      datos.append('conacyt', '1'.toString());
    }else{
      datos.append('conacyt', '0'.toString());
    }
    if(allow_scopus_modification){
      datos.append('allow_scopus_modification', '1'.toString());
    }else{
      datos.append('allow_scopus_modification', '0'.toString());
    }
    if(allow_scimago_modification){
      datos.append('allow_scimago_modification', '1'.toString());
    }else{
      datos.append('allow_scimago_modification', '0'.toString());
    }
    return this.http.post(endpoint,datos)
  }

  removeLifetimesToSource(idVigencia:number){
    let endpoint = `${this.globals.backend_base_url}/vigenciasfuente/${idVigencia}`
    return this.http.delete(endpoint)
  }
}
