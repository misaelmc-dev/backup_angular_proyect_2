import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {GlobalsVars} from "../global/globals-vars";

@Injectable({
  providedIn: 'root'
})
export class SourceQuartilsService {

  constructor(private http: HttpClient, private globals: GlobalsVars) { }

  getQuartilesBySouerce(idFuente:number,page:number) {
    let endpoint = `${this.globals.backend_base_url}/cuartilesfuente?idsFuente=${idFuente}&pageSize=10&page=${page}`
    return this.http.get(endpoint)
  }

  addQuartilToSource(idFuente:number,anio:number,q_scintra:string,q_scimago:string){
    let endpoint = `${this.globals.backend_base_url}/cuartilesfuente/create`
    let datos = new FormData();
    datos.append('id_fuente', idFuente.toString());
    datos.append('anio', anio.toString());
    datos.append('cuartil_scintra', q_scintra.toString());
    datos.append('cuartil_scimago', q_scimago.toString());
    return this.http.post(endpoint,datos)
  }

  updateQuartilToSource(idQuartil:number,anio:number,q_scintra:string,q_scimago:string){
    let endpoint = `${this.globals.backend_base_url}/cuartilesfuente/${idQuartil}/update`
    let datos = new FormData();
    datos.append('anio', anio.toString());
    datos.append('cuartil_scintra', q_scintra.toString());
    datos.append('cuartil_scimago', q_scimago.toString());
    return this.http.post(endpoint,datos)
  }

  removeQuartilToSource(idquartil:number){
    let endpoint = `${this.globals.backend_base_url}/cuartilesfuente/${idquartil}`
    return this.http.delete(endpoint)
  }
}
