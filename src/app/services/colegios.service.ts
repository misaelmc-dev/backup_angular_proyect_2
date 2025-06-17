import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {GlobalsVars} from "../global/globals-vars";

@Injectable({
  providedIn: 'root'
})
export class ColegiosService {

  constructor(private http: HttpClient, private globals: GlobalsVars) { }

  /**
   * Consulta los colegios
   */
  get(id_institucion?: any, id_centro?:any, id_investigador?: any, id_campus?: any, idsEvento?: Array<any>,
      idsInvestProd?: Array<any>, idsInstScintraProd?: Array<any>, idsInstRorProd?: Array<any>,
      idsInvestCita?: Array<any>, idsInstScintraCita?: Array<any>, idsInstRorCita?: Array<any>,
      con_institucion?: boolean, soloConProduct?: boolean)
  {
    let endpoint = `${this.globals.backend_base_url}/colegios?no_paginate=&test=0`
    if (id_institucion)
      endpoint += `&idsInst=${encodeURIComponent(id_institucion)}`;
    if (id_centro)
      endpoint += `&idsCentrosInv=${encodeURIComponent(id_centro)}`;
    if (id_investigador)
      endpoint += `&idsInvest=${encodeURIComponent(id_investigador)}`;
    if (id_campus)
      endpoint += `&idsCampus=${encodeURIComponent(id_campus)}`;
    if (idsEvento)
      endpoint += `&idsEvento=${encodeURIComponent(idsEvento.join(' '))}`;
    if (idsInvestProd)
      endpoint += `&idsInvestProd=${encodeURIComponent(idsInvestProd.join(' '))}`;
    if (idsInstScintraProd)
      endpoint += `&idsInstScintraProd=${encodeURIComponent(idsInstScintraProd.join(' '))}`;
    if (idsInstRorProd)
      endpoint += `&idsInstRorProd=${encodeURIComponent(idsInstRorProd.join(' '))}`;
    if (idsInvestCita)
      endpoint += `&idsInvestCita=${encodeURIComponent(idsInvestCita.join(' '))}`;
    if (idsInstScintraCita)
      endpoint += `&idsInstScintraCita=${encodeURIComponent(idsInstScintraCita.join(' '))}`;
    if (idsInstRorCita)
      endpoint += `&idsInstRorCita=${encodeURIComponent(idsInstRorCita.join(' '))}`;
    if (con_institucion)
      endpoint += `&con_institucion=`;
    if (soloConProduct)
      endpoint += `&soloConProduct=`;
    return this.http.get(endpoint)
  }
}
