import {EventEmitter, Injectable, Output} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {GlobalsVars} from "../../global/globals-vars";

@Injectable({
  providedIn: 'root'
})
export class MetasService {

  constructor(private http: HttpClient, private globals: GlobalsVars) { }

  getMetasByInstitucion(idInstitucion:number, idsTipoMeta:string, fechaInicio:string, fechaFinal:string) {
    let endpointUrl = `${this.globals.backend_base_url}/metas?idsInstSc=${idInstitucion}&idsTipMeta=${idsTipoMeta}&tiempoInicio=${fechaInicio}&tiempoFinal=${fechaFinal}`
    return this.http.get(endpointUrl)
  }

  addMetas (valor:number, idCampus:number, fechaInicio:string, fechaFinal:string, idsTipoMeta:number) {
    const ENDPOINT = `${this.globals.backend_base_url}/metas/create`
    return this.http.post(ENDPOINT,{valor:valor,id_campus:idCampus,tiempo_inicio:fechaInicio,tiempo_final:fechaFinal,id_tipo_meta:idsTipoMeta})
  }

  updateMetas (id:number,valor:number) {
    const ENDPOINT = `${this.globals.backend_base_url}/metas/${id}/update`
    return this.http.post(ENDPOINT,{valor:valor})
  }

  deleteMetas (id:number) {
    const ENDPOINT = `${this.globals.backend_base_url}/metas/${id}/delete`
    return this.http.delete(ENDPOINT);
  }

}
