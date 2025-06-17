import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {GlobalsVars} from "../global/globals-vars";

@Injectable({
  providedIn: 'root'
})
export class PaisesService {

  constructor(private http: HttpClient, private globals: GlobalsVars) { }

  /**
   * Obtiene los países
   */
  get(soloConProduct?: boolean, soloConCita?: boolean, idsInvestigadores?: Array<any>, idsInstScintra?: Array<any>,
      idsInstRor?: Array<any>, idsInvestOrigProdColab?: Array<any>, idsInvestOrigCitaColab?: Array<any>,
      idsInstScintraOrigProdColab?: Array<any>, idsInstScintraOrigCitaColab?: Array<any>,
      idsInstRorOrigProdColab?: Array<any>, idsInstRorOrigCitaColab?: Array<any>) {
    let endpoint = `${this.globals.backend_base_url}/paises/simples?no_paginate=&test=0`
    if (idsInvestigadores)
      endpoint += `&idsInvestigadores=${encodeURIComponent(idsInvestigadores.join(' '))}`;
    if (idsInstScintra)
      endpoint += `&idsInstScintra=${encodeURIComponent(idsInstScintra.join(' '))}`;
    if (idsInstRor)
      endpoint += `&idsInstRor=${encodeURIComponent(idsInstRor.join(' '))}`;
    if (idsInvestOrigProdColab)
      endpoint += `&idsInvestOrigProdColab=${encodeURIComponent(idsInvestOrigProdColab.join(' '))}`;
    if (idsInvestOrigCitaColab)
      endpoint += `&idsInvestOrigCitaColab=${encodeURIComponent(idsInvestOrigCitaColab.join(' '))}`;
    if (idsInstScintraOrigProdColab)
      endpoint += `&idsInstScintraOrigProdColab=${encodeURIComponent(idsInstScintraOrigProdColab.join(' '))}`;
    if (idsInstScintraOrigCitaColab)
      endpoint += `&idsInstScintraOrigCitaColab=${encodeURIComponent(idsInstScintraOrigCitaColab.join(' '))}`;
    if (idsInstRorOrigProdColab)
      endpoint += `&idsInstRorOrigProdColab=${encodeURIComponent(idsInstRorOrigProdColab.join(' '))}`;
    if (idsInstRorOrigCitaColab)
      endpoint += `&idsInstRorOrigCitaColab=${encodeURIComponent(idsInstRorOrigCitaColab.join(' '))}`;
    if (soloConProduct)
      endpoint += `&soloConProduct=`;
    if (soloConCita)
      endpoint += `&soloConCita=`;
    return this.http.get(endpoint)
  }
}
