import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {GlobalsVars} from "../global/globals-vars";

@Injectable({
  providedIn: 'root'
})
export class CitasService {

  constructor(private http: HttpClient, private globals: GlobalsVars) { }

  /**
   * Obtiene los años para los que exista al menos una cita asignada (años del producto citado) en el sistema
   * (solo citas activos para mostrar)
   */
  getAniosConCitasAsignadas(idsInstScintra?: Array<any>, idsInstRor?: Array<any>, idsInvestigadores?: Array<any>)
  {
    let endpoint = `${this.globals.backend_base_url}/citas/aniosasignados?test=0`
    if (idsInstScintra)
      endpoint += `?idsInstScintra=${encodeURIComponent(idsInstScintra.join(' '))}`;
    if (idsInstRor)
      endpoint += `&idsInstRor=${encodeURIComponent(idsInstRor.join(' '))}`;
    if (idsInvestigadores)
      endpoint += `&idsInvestigadores=${encodeURIComponent(idsInvestigadores.join(' '))}`;
    return this.http.get(endpoint)
  }

  /**
   * Obtiene los años para los que exista al menos una cita publicada en el sistema (solo citas activos para mostrar)
   */
  getAniosConCitasPublicadas(idsInstScintra?: Array<any>, idsInstRor?: Array<any>, idsInvestigadores?: Array<any>)
  {
    let endpoint = `${this.globals.backend_base_url}/citas/aniospublicados?test=0`
    if (idsInstScintra)
      endpoint += `?idsInstScintra=${encodeURIComponent(idsInstScintra.join(' '))}`;
    if (idsInstRor)
      endpoint += `&idsInstRor=${encodeURIComponent(idsInstRor.join(' '))}`;
    if (idsInvestigadores)
      endpoint += `&idsInvestigadores=${encodeURIComponent(idsInvestigadores.join(' '))}`;
    return this.http.get(endpoint)
  }

  /**
   * Obtiene las visibilidades (scopus, jcr, scielo, conacyt, etc) para las cuales exista cita
   */
  getVisibilidadesConCita(idsInvestigadores?: Array<any>, idsInstScintra?: Array<any>, idsInstRor?: Array<any>)
  {
    let endpoint = `${this.globals.backend_base_url}/citas/visibilidades?test=0`
    if (idsInstScintra)
      endpoint += `&idsInstScintra=${encodeURIComponent(idsInstScintra.join(' '))}`;
    if (idsInstRor)
      endpoint += `&idsInstRor=${encodeURIComponent(idsInstRor.join(' '))}`;
    if (idsInvestigadores)
      endpoint += `&idsInvestigadores=${encodeURIComponent(idsInvestigadores.join(' '))}`;
    return this.http.get(endpoint)
  }
}
